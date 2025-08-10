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

// Group functions
export const createGroup = async (groupData: any) => {
  const { data, error } = await supabase.functions.invoke('create-group', {
    body: groupData,
  })
  return { data, error }
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
  const { data, error } = await supabase.functions.invoke('process-payment', {
    body: paymentData,
  })
  return { data, error }
}

export const withdrawFunds = async (withdrawalData: any) => {
  const { data, error } = await supabase.functions.invoke('withdraw-funds', {
    body: withdrawalData,
  })
  return { data, error }
}

// Recharge functions
export const processRecharge = async (rechargeData: any) => {
  const { data, error } = await supabase.functions.invoke('process-recharge', {
    body: rechargeData,
  })
  return { data, error }
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
  const { data, error } = await supabase.functions.invoke('send-whatsapp', {
    body: { phone, message, type },
  })
  return { data, error }
}