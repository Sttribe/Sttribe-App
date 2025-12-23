import { createClient } from '@supabase/supabase-js'

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
      groupId,
      amount,
      purpose,
      platform,
      subscriptionDetails
    } = await request.json()

    // Verify user is group owner
    const { data: group } = await supabase
      .from('groups')
      .select('owner_id, name')
      .eq('id', groupId)
      .single()

    if (group?.owner_id !== user.user.id) {
      return Response.json(
        { error: 'Only group owner can withdraw funds' },
        { status: 403, headers: corsHeaders }
      )
    }

    // Check available balance
    const { data: wallet } = await supabase
      .from('group_wallets')
      .select('available_balance')
      .eq('group_id', groupId)
      .single()

    if (!wallet || (wallet.available_balance || 0) < amount) {
      return Response.json(
        { error: 'Insufficient funds' },
        { status: 400, headers: corsHeaders }
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

    // Decrement wallet balance
    const { error: walletUpdateError } = await supabase.rpc('decrement_wallet_balance', {
      p_group_id: groupId,
      p_amount: amount
    })

    // If RPC doesn't exist, manually update
    if (walletUpdateError) {
      const { data: currentWallet } = await supabase
        .from('group_wallets')
        .select('available_balance, total_withdrawn')
        .eq('group_id', groupId)
        .single()

      if (currentWallet) {
        await supabase
          .from('group_wallets')
          .update({
            available_balance: Math.max(0, (currentWallet.available_balance || 0) - amount),
            total_withdrawn: (currentWallet.total_withdrawn || 0) + amount
          })
          .eq('group_id', groupId)
      }
    }

    // Update subscription credentials if provided (TODO: Encrypt password)
    if (subscriptionDetails?.email && subscriptionDetails?.password) {
      await supabase
        .from('groups')
        .update({
          credentials_email: subscriptionDetails.email,
          credentials_password: subscriptionDetails.password, // TODO: Encrypt in production
          next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
        .eq('id', groupId)
    }

    // Create system message (if RPC exists)
    try {
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
    } catch (rpcError) {
      console.log('System message RPC not available, skipping')
    }

    // Notify all group members (if RPC exists)
    try {
      await supabase.rpc('notify_group_members', {
        p_group_id: groupId,
        p_title: 'Subscription Activated',
        p_message: `${platform || 'Subscription'} has been activated for ${group?.name}! Enjoy streaming!`,
        p_type: 'subscription',
        p_data: { platform, amount, withdrawal_id: withdrawal.id }
      })
    } catch (rpcError) {
      console.log('Notify group members RPC not available, skipping')
    }

    return Response.json(
      {
        success: true,
        withdrawal,
        message: 'Funds withdrawn and subscription activated successfully'
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Withdraw funds error:', error)
    return Response.json(
      { error: error?.message || 'Failed to withdraw funds' },
      { status: 400, headers: corsHeaders }
    )
  }
}

