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

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: user } = await supabase.auth.getUser(token)

    if (!user.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const {
      rechargeType,
      number,
      amount,
      operator,
      razorpayPaymentId
    } = await req.json()

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Create recharge transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('recharge_transactions')
      .insert({
        user_id: user.user.id,
        recharge_type: rechargeType,
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

    // Simulate recharge API call
    const rechargeApiKey = Deno.env.get('RECHARGE_API_KEY')
    let rechargeResult = { success: true, status: 'completed' }

    if (rechargeApiKey) {
      // Integrate with actual recharge API
      try {
        const rechargeResponse = await fetch('https://api.recharge-provider.com/recharge', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${rechargeApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: rechargeType,
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
          ? `₹${amount} ${rechargeType} recharge for ${number} completed successfully.`
          : `₹${amount} ${rechargeType} recharge for ${number} failed. Please try again.`,
        data: { 
          transaction_id: transactionId,
          recharge_type: rechargeType,
          amount,
          status: finalStatus
        }
      })

    return new Response(
      JSON.stringify({ 
        success: rechargeResult.success,
        transaction: {
          ...transaction,
          status: finalStatus
        },
        message: rechargeResult.success 
          ? 'Recharge completed successfully'
          : 'Recharge failed. Please try again.'
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