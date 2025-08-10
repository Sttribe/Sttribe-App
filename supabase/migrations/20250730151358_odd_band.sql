/*
  # Payments and Transactions Schema

  1. New Tables
    - `group_wallets`
      - `id` (uuid, primary key)
      - `group_id` (uuid, references groups)
      - `total_collected` (numeric, default 0)
      - `available_balance` (numeric, default 0)
      - `total_withdrawn` (numeric, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `payments`
      - `id` (uuid, primary key)
      - `group_id` (uuid, references groups)
      - `user_id` (uuid, references profiles)
      - `amount` (numeric)
      - `payment_method` (text)
      - `razorpay_order_id` (text)
      - `razorpay_payment_id` (text)
      - `status` (text)
      - `created_at` (timestamp)

    - `withdrawals`
      - `id` (uuid, primary key)
      - `group_id` (uuid, references groups)
      - `withdrawn_by` (uuid, references profiles)
      - `amount` (numeric)
      - `purpose` (text)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for payment access and management
*/

-- Create group_wallets table
CREATE TABLE IF NOT EXISTS group_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid UNIQUE NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  total_collected numeric DEFAULT 0 CHECK (total_collected >= 0),
  available_balance numeric DEFAULT 0 CHECK (available_balance >= 0),
  total_withdrawn numeric DEFAULT 0 CHECK (total_withdrawn >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  payment_method text NOT NULL,
  razorpay_order_id text,
  razorpay_payment_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  billing_cycle date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  withdrawn_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  purpose text NOT NULL,
  platform text,
  subscription_details jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Create recharge_transactions table
CREATE TABLE IF NOT EXISTS recharge_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recharge_type text NOT NULL,
  number_or_id text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  operator text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  transaction_id text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE group_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE recharge_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for group_wallets
CREATE POLICY "Group members can view wallet"
  ON group_wallets
  FOR SELECT
  TO authenticated
  USING (
    group_id IN (
      SELECT group_id FROM group_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Group owners can update wallet"
  ON group_wallets
  FOR UPDATE
  TO authenticated
  USING (
    group_id IN (
      SELECT id FROM groups WHERE owner_id = auth.uid()
    )
  );

-- Policies for payments
CREATE POLICY "Users can view their payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    group_id IN (
      SELECT id FROM groups WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policies for withdrawals
CREATE POLICY "Group members can view withdrawals"
  ON withdrawals
  FOR SELECT
  TO authenticated
  USING (
    group_id IN (
      SELECT group_id FROM group_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Group owners can create withdrawals"
  ON withdrawals
  FOR INSERT
  TO authenticated
  WITH CHECK (
    withdrawn_by = auth.uid() AND
    group_id IN (
      SELECT id FROM groups WHERE owner_id = auth.uid()
    )
  );

-- Policies for recharge_transactions
CREATE POLICY "Users can view their recharge transactions"
  ON recharge_transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create recharge transactions"
  ON recharge_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Function to create wallet when group is created
CREATE OR REPLACE FUNCTION create_group_wallet()
RETURNS trigger AS $$
BEGIN
  INSERT INTO group_wallets (group_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create wallet
CREATE TRIGGER on_group_wallet_created
  AFTER INSERT ON groups
  FOR EACH ROW EXECUTE FUNCTION create_group_wallet();

-- Function to update wallet on payment
CREATE OR REPLACE FUNCTION update_wallet_on_payment()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE group_wallets 
    SET 
      total_collected = total_collected + NEW.amount,
      available_balance = available_balance + NEW.amount,
      updated_at = now()
    WHERE group_id = NEW.group_id;
    
    -- Update member payment status
    UPDATE group_members 
    SET 
      payment_status = 'paid',
      last_payment_date = now()
    WHERE group_id = NEW.group_id AND user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for payment completion
CREATE TRIGGER on_payment_completed
  AFTER UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_wallet_on_payment();

-- Function to update wallet on withdrawal
CREATE OR REPLACE FUNCTION update_wallet_on_withdrawal()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE group_wallets 
    SET 
      available_balance = available_balance - NEW.amount,
      total_withdrawn = total_withdrawn + NEW.amount,
      updated_at = now()
    WHERE group_id = NEW.group_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for withdrawal completion
CREATE TRIGGER on_withdrawal_completed
  AFTER UPDATE ON withdrawals
  FOR EACH ROW EXECUTE FUNCTION update_wallet_on_withdrawal();

-- Add updated_at triggers
CREATE TRIGGER update_group_wallets_updated_at
  BEFORE UPDATE ON group_wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();