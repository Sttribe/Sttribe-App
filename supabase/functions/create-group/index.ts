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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
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
      name,
      description,
      platform,
      planName,
      monthlyCost,
      maxMembers,
      isPrivate,
      memberContacts
    } = await req.json()

    // Create group
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({
        name,
        description,
        platform,
        plan_name: planName,
        monthly_cost: monthlyCost,
        max_members: maxMembers,
        is_private: isPrivate,
        owner_id: user.user.id,
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })
      .select()
      .single()

    if (groupError) {
      throw groupError
    }

    // Send invitations to members
    if (memberContacts && memberContacts.length > 0) {
      for (const contact of memberContacts) {
        if (contact.value.trim()) {
          // Create invitation record or send notification
          // This would integrate with your WhatsApp/Email service
          console.log(`Sending invitation to ${contact.value} via ${contact.type}`)
        }
      }
    }

    // Create system message
    await supabase.rpc('create_system_message', {
      p_group_id: group.id,
      p_content: `Group "${name}" created successfully! Welcome to ${platform} sharing.`,
      p_metadata: { type: 'group_created', platform }
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        group,
        message: 'Group created successfully'
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