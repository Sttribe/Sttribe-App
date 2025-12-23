import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Process recharge
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

    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: user, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user.user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      )
    }

    const {
      rechargeType,
      recharge_type,
      type,
      number,
      amount,
      operator,
      razorpayPaymentId,
      razorpay_payment_id
    } = await request.json()

    // Support multiple field name formats
    const finalRechargeType = rechargeType || recharge_type || type
    const finalRazorpayPaymentId = razorpayPaymentId || razorpay_payment_id

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    // Create recharge transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('recharge_transactions')
      .insert({
        user_id: user.user.id,
        recharge_type: finalRechargeType,
        number_or_id: number,
        amount,
        operator,
        transaction_id: transactionId,
        status: 'pending'
      })
      .select()
      .single()

    if (transactionError) {
      throw transactionError
    }

    // Process recharge API call
    const rechargeApiKey = process.env.RECHARGE_API_KEY
    let rechargeResult = { success: true, status: 'completed' }

    if (rechargeApiKey) {
      // Integrate with actual recharge API
      try {
        const rechargeApiUrl = process.env.RECHARGE_API_URL || 'https://api.recharge-provider.com/recharge'
        const rechargeResponse = await fetch(rechargeApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${rechargeApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: finalRechargeType,
            number,
            amount,
            operator,
            transaction_id: transactionId
          })
        })

        rechargeResult = await rechargeResponse.json()
      } catch (error) {
        console.error('Recharge API error:', error)
        rechargeResult = { success: false, status: 'failed' }
      }
    } else {
      // Simulate success for demo (90% success rate)
      rechargeResult.success = Math.random() > 0.1
      rechargeResult.status = rechargeResult.success ? 'completed' : 'failed'
    }

    // Update transaction status
    const finalStatus = rechargeResult.success ? 'completed' : 'failed'
    await supabase
      .from('recharge_transactions')
      .update({ status: finalStatus })
      .eq('id', transaction.id)

    // Create notification
    await supabase
      .from('notifications')
      .insert({
        user_id: user.user.id,
        type: 'recharge',
        title: rechargeResult.success ? 'Recharge Successful' : 'Recharge Failed',
        message: rechargeResult.success
          ? `₹${amount} ${finalRechargeType} recharge for ${number} completed successfully.`
          : `₹${amount} ${finalRechargeType} recharge for ${number} failed. Please try again.`,
        data: {
          transaction_id: transactionId,
          recharge_type: finalRechargeType,
          amount,
          status: finalStatus
        }
      })

    return Response.json(
      {
        success: rechargeResult.success,
        transaction: {
          ...transaction,
          status: finalStatus
        },
        message: rechargeResult.success
          ? 'Recharge completed successfully'
          : 'Recharge failed. Please try again.'
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Process recharge error:', error)
    return Response.json(
      { error: error?.message || 'Failed to process recharge' },
      { status: 400, headers: corsHeaders }
    )
  }
}

// Get recharge history
export async function GET(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500, headers: corsHeaders }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: user, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user.user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      )
    }

    const { data: history, error } = await supabase
      .from('recharge_transactions')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return Response.json(
      {
        success: true,
        data: history || []
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Get recharge history error:', error)
    return Response.json(
      { error: error?.message || 'Failed to fetch history' },
      { status: 500, headers: corsHeaders }
    )
  }
}