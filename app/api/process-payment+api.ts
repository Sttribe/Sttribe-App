import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export async function POST(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration')
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500, headers: corsHeaders }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const {
      groupId,
      userId,
      amount,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = await request.json()

    // Validate required fields
    if (!groupId || !userId || !amount || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return Response.json(
        { error: 'Missing required payment fields' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Verify Razorpay signature
    const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET

    if (!RAZORPAY_SECRET) {
      console.error('Missing RAZORPAY_SECRET environment variable')
      return Response.json(
        { error: 'Payment gateway configuration error' },
        { status: 500, headers: corsHeaders }
      )
    }

    // Verify Razorpay signature using HMAC SHA256
    const hmac = crypto.createHmac('sha256', RAZORPAY_SECRET)
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`)
    const generatedSignature = hmac.digest('hex')

    const isSignatureValid = generatedSignature === razorpaySignature

    if (!isSignatureValid) {
      console.error('Payment signature verification failed', {
        order_id: razorpayOrderId,
        payment_id: razorpayPaymentId,
        expected: generatedSignature,
        received: razorpaySignature
      })
      return Response.json(
        { error: 'Invalid payment signature' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        group_id: groupId,
        user_id: userId,
        amount,
        payment_method: paymentMethod,
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        status: 'completed',
        billing_cycle: new Date().toISOString().split('T')[0]
      })
      .select()
      .single()

    if (paymentError) {
      throw paymentError
    }

    // Update wallet balance
    const { error: walletUpdateError } = await supabase.rpc('increment_wallet_balance', {
      p_group_id: groupId,
      p_amount: amount
    })

    // If RPC doesn't exist, manually update
    if (walletUpdateError) {
      const { data: wallet } = await supabase
        .from('group_wallets')
        .select('available_balance, total_collected')
        .eq('group_id', groupId)
        .single()

      if (wallet) {
        await supabase
          .from('group_wallets')
          .update({
            available_balance: (wallet.available_balance || 0) + amount,
            total_collected: (wallet.total_collected || 0) + amount
          })
          .eq('group_id', groupId)
      }
    }

    // Get group and user details for notifications
    const { data: group } = await supabase
      .from('groups')
      .select('name, platform, owner_id')
      .eq('id', groupId)
      .single()

    const { data: user } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single()

    // Create system message (if RPC exists)
    try {
      await supabase.rpc('create_system_message', {
        p_group_id: groupId,
        p_content: `${user?.full_name} has paid ₹${amount} for this month.`,
        p_metadata: {
          type: 'payment_completed',
          amount,
          user_id: userId,
          payment_id: payment.id
        }
      })
    } catch (rpcError) {
      console.log('System message RPC not available, skipping')
    }

    // Notify group members (if RPC exists)
    try {
      await supabase.rpc('notify_group_members', {
        p_group_id: groupId,
        p_title: 'Payment Received',
        p_message: `${user?.full_name} has paid ₹${amount} for ${group?.name}`,
        p_type: 'payment',
        p_data: { payment_id: payment.id, amount }
      })
    } catch (rpcError) {
      console.log('Notify group members RPC not available, skipping')
    }

    // Check if all members have paid
    const { data: wallet } = await supabase
      .from('group_wallets')
      .select('available_balance, total_collected')
      .eq('group_id', groupId)
      .single()

    const { data: groupData } = await supabase
      .from('groups')
      .select('monthly_cost, current_members')
      .eq('id', groupId)
      .single()

    const expectedTotal = (groupData?.monthly_cost || 0) * (groupData?.current_members || 0)
    const allPaid = (wallet?.available_balance || 0) >= expectedTotal

    if (allPaid) {
      // Notify owner that funds are ready for withdrawal
      await supabase
        .from('notifications')
        .insert({
          user_id: group?.owner_id,
          type: 'funds_ready',
          title: 'Funds Ready for Withdrawal',
          message: `All members have paid for ${group?.name}. You can now withdraw ₹${wallet?.available_balance} to purchase the subscription.`,
          data: { group_id: groupId, amount: wallet?.available_balance }
        })
    }

    return Response.json(
      {
        success: true,
        payment,
        allPaid,
        message: 'Payment processed successfully'
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Process payment error:', error)
    return Response.json(
      { error: error?.message || 'Failed to process payment' },
      { status: 400, headers: corsHeaders }
    )
  }
}

