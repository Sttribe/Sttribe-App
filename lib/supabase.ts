import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Database types
export interface Profile {
  id: string
  email: string
  full_name: string
  phone?: string
  avatar_url?: string
  location?: string
  referral_code: string
  total_savings: number
  created_at: string
  updated_at: string
}

export interface Group {
  id: string
  name: string
  description?: string
  platform: string
  plan_name: string
  monthly_cost: number
  max_members: number
  current_members: number
  group_code: string
  is_private: boolean
  owner_id: string
  status: 'active' | 'inactive' | 'suspended'
  next_billing_date?: string
  credentials_email?: string
  credentials_password?: string
  created_at: string
  updated_at: string
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  payment_status: 'pending' | 'paid' | 'overdue'
  joined_at: string
  last_payment_date?: string
}

export interface GroupWallet {
  id: string
  group_id: string
  total_collected: number
  available_balance: number
  total_withdrawn: number
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  group_id: string
  user_id: string
  amount: number
  payment_method: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  billing_cycle: string
  created_at: string
}

export interface Withdrawal {
  id: string
  group_id: string
  withdrawn_by: string
  amount: number
  purpose: string
  platform?: string
  subscription_details?: any
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

export interface GroupMessage {
  id: string
  group_id: string
  sender_id?: string
  message_type: 'text' | 'recommendation' | 'system' | 'payment'
  content: string
  metadata: any
  created_at: string
}

export interface RechargeTransaction {
  id: string
  user_id: string
  recharge_type: string
  number_or_id: string
  amount: number
  operator?: string
  status: 'pending' | 'completed' | 'failed'
  transaction_id: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  data: any
  read: boolean
  created_at: string
}