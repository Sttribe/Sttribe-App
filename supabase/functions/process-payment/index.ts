import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const {
      groupId,
      userId,
      amount,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = await req.json()

    // Verify Razorpay signature (implement actual verification)
    const isSignatureValid = true // Replace with actual signature verification

    if (!isSignatureValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    // Create system message
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

    // Notify group members
    await supabase.rpc('notify_group_members', {
      p_group_id: groupId,
      p_title: 'Payment Received',
      p_message: `${user?.full_name} has paid ₹${amount} for ${group?.name}`,
      p_type: 'payment',
      p_data: { payment_id: payment.id, amount }
    })

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

    const expectedTotal = groupData?.monthly_cost * groupData?.current_members
    const allPaid = wallet?.available_balance >= expectedTotal

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

    return new Response(
      JSON.stringify({ 
        success: true, 
        payment,
        allPaid,
        message: 'Payment processed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})