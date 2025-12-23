import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export async function POST(request: Request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration')
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500, headers: corsHeaders }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

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
      name,
      description,
      platform,
      planName,
      plan_name,
      monthlyCost,
      monthly_cost,
      maxMembers,
      max_members,
      isPrivate,
      is_private,
      memberContacts,
      member_contacts
    } = await request.json()

    // Support both camelCase and snake_case
    const finalPlanName = planName || plan_name
    const finalMonthlyCost = monthlyCost || monthly_cost
    const finalMaxMembers = maxMembers || max_members
    const finalIsPrivate = isPrivate ?? is_private ?? false
    const finalMemberContacts = memberContacts || member_contacts || []

    // Generate unique group code
    const groupCode = crypto.randomBytes(4).toString('hex').toUpperCase()

    // Create group
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({
        name,
        description,
        platform,
        plan_name: finalPlanName,
        monthly_cost: finalMonthlyCost,
        max_members: finalMaxMembers,
        is_private: finalIsPrivate,
        owner_id: user.user.id,
        group_code: groupCode,
        current_members: 1, // Owner is the first member
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })
      .select()
      .single()

    if (groupError) {
      console.error('Group creation error:', groupError)
      throw groupError
    }

    // Create group wallet
    const { error: walletError } = await supabase
      .from('group_wallets')
      .insert({
        group_id: group.id,
        total_collected: 0,
        available_balance: 0,
        total_withdrawn: 0
      })

    if (walletError) {
      console.error('Wallet creation error:', walletError)
      // Don't fail the whole operation, just log it
    }

    // Add owner as group member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: user.user.id,
        role: 'owner',
        payment_status: 'pending'
      })

    if (memberError) {
      console.error('Member creation error:', memberError)
      // Don't fail the whole operation, just log it
    }

    // Send invitations to members (if provided)
    if (finalMemberContacts && finalMemberContacts.length > 0) {
      for (const contact of finalMemberContacts) {
        if (contact?.value?.trim()) {
          // TODO: Create invitation record or send notification
          // This would integrate with your WhatsApp/Email service
          console.log(`Sending invitation to ${contact.value} via ${contact.type}`)
        }
      }
    }

    // Create system message (if RPC exists)
    try {
      await supabase.rpc('create_system_message', {
        p_group_id: group.id,
        p_content: `Group "${name}" created successfully! Welcome to ${platform} sharing.`,
        p_metadata: { type: 'group_created', platform }
      })
    } catch (rpcError) {
      // RPC might not exist, that's okay
      console.log('System message RPC not available, skipping')
    }

    return Response.json(
      {
        success: true,
        group,
        message: 'Group created successfully'
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Create group error:', error)
    return Response.json(
      { error: error?.message || 'Failed to create group' },
      { status: 400, headers: corsHeaders }
    )
  }
}

