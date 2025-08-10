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
      groupId,
      amount,
      purpose,
      platform,
      subscriptionDetails
    } = await req.json()

    // Verify user is group owner
    const { data: group } = await supabase
      .from('groups')
      .select('owner_id, name')
      .eq('id', groupId)
      .single()

    if (group?.owner_id !== user.user.id) {
      return new Response(
        JSON.stringify({ error: 'Only group owner can withdraw funds' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check available balance
    const { data: wallet } = await supabase
      .from('group_wallets')
      .select('available_balance')
      .eq('group_id', groupId)
      .single()

    if (!wallet || wallet.available_balance < amount) {
      return new Response(
        JSON.stringify({ error: 'Insufficient funds' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create withdrawal record
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .insert({
        group_id: groupId,
        withdrawn_by: user.user.id,
        amount,
        purpose,
        platform,
        subscription_details: subscriptionDetails,
        status: 'completed'
      })
      .select()
      .single()

    if (withdrawalError) {
      throw withdrawalError
    }

    // Update subscription credentials if provided
    if (subscriptionDetails?.email && subscriptionDetails?.password) {
      await supabase
        .from('groups')
        .update({
          credentials_email: subscriptionDetails.email,
          credentials_password: subscriptionDetails.password, // Encrypt in production
          next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
        .eq('id', groupId)
    }

    // Create system message
    await supabase.rpc('create_system_message', {
      p_group_id: groupId,
      p_content: `${platform || 'Subscription'} has been purchased! Login credentials will be shared separately.`,
      p_metadata: { 
        type: 'subscription_purchased', 
        platform,
        amount,
        withdrawal_id: withdrawal.id
      }
    })

    // Notify all group members
    await supabase.rpc('notify_group_members', {
      p_group_id: groupId,
      p_title: 'Subscription Activated',
      p_message: `${platform || 'Subscription'} has been activated for ${group?.name}! Enjoy streaming!`,
      p_type: 'subscription',
      p_data: { platform, amount, withdrawal_id: withdrawal.id }
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        withdrawal,
        message: 'Funds withdrawn and subscription activated successfully'
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