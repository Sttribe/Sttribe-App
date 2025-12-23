import { supabase } from './supabase'

// Auth functions
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Helper function to get auth token for API calls
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || null
}

// Group functions
export const createGroup = async (groupData: any) => {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    const response = await fetch('/api/create-group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(groupData),
    })

    const result = await response.json()

    if (!response.ok) {
      return { data: null, error: result }
    }

    return { data: result, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error?.message || 'Failed to create group' } }
  }
}

export const getMyGroups = async () => {
  const { data, error } = await supabase
    .from('groups')
    .select(`
      *,
      group_members!inner(role, payment_status),
      group_wallets(*)
    `)
    .eq('group_members.user_id', (await supabase.auth.getUser()).data.user?.id)
  
  return { data, error }
}

export const getGroupDetails = async (groupId: string) => {
  const { data, error } = await supabase
    .from('groups')
    .select(`
      *,
      group_members(
        *,
        profiles(full_name, avatar_url, email)
      ),
      group_wallets(*),
      payments(*),
      withdrawals(*)
    `)
    .eq('id', groupId)
    .single()
  
  return { data, error }
}

export const joinGroup = async (groupCode: string) => {
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .select('id, current_members, max_members')
    .eq('group_code', groupCode)
    .single()

  if (groupError) return { data: null, error: groupError }

  if (group.current_members >= group.max_members) {
    return { data: null, error: { message: 'Group is full' } }
  }

  const { data, error } = await supabase
    .from('group_members')
    .insert({
      group_id: group.id,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()

  return { data, error }
}

// Payment functions
export const createPayment = async (paymentData: any) => {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    const response = await fetch('/api/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    })

    const result = await response.json()

    if (!response.ok) {
      return { data: null, error: result }
    }

    return { data: result, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error?.message || 'Failed to process payment' } }
  }
}

export const withdrawFunds = async (withdrawalData: any) => {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    const response = await fetch('/api/withdraw-funds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(withdrawalData),
    })

    const result = await response.json()

    if (!response.ok) {
      return { data: null, error: result }
    }

    return { data: result, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error?.message || 'Failed to withdraw funds' } }
  }
}

// Recharge functions
export const processRecharge = async (rechargeData: any) => {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    const response = await fetch('/api/recharge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(rechargeData),
    })

    const result = await response.json()

    if (!response.ok) {
      return { data: null, error: result }
    }

    return { data: result, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error?.message || 'Failed to process recharge' } }
  }
}

export const getRechargeHistory = async () => {
  const { data, error } = await supabase
    .from('recharge_transactions')
    .select('*')
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

// Chat functions
export const getGroupMessages = async (groupId: string) => {
  const { data, error } = await supabase
    .from('group_messages')
    .select(`
      *,
      profiles(full_name, avatar_url)
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: true })
  
  return { data, error }
}

export const sendMessage = async (groupId: string, content: string, messageType = 'text', metadata = {}) => {
  const { data, error } = await supabase
    .from('group_messages')
    .insert({
      group_id: groupId,
      sender_id: (await supabase.auth.getUser()).data.user?.id,
      message_type: messageType,
      content,
      metadata,
    })
    .select()

  return { data, error }
}

// Notification functions
export const getNotifications = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const markNotificationAsRead = async (notificationId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
  
  return { data, error }
}

// WhatsApp functions
export const sendWhatsAppNotification = async (phone: string, message: string, type: string) => {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    const response = await fetch('/api/whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ phone, message, type }),
    })

    const result = await response.json()

    if (!response.ok) {
      return { data: null, error: result }
    }

    return { data: result, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error?.message || 'Failed to send WhatsApp notification' } }
  }
}