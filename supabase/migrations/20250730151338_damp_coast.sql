/*
  # Groups and Memberships Schema

  1. New Tables
    - `groups`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `platform` (text) - Netflix, Disney+, etc.
      - `plan_name` (text) - Basic, Premium, etc.
      - `monthly_cost` (numeric)
      - `max_members` (integer)
      - `current_members` (integer, default 1)
      - `group_code` (text, unique)
      - `is_private` (boolean, default false)
      - `owner_id` (uuid, references profiles)
      - `status` (text, default 'active')
      - `next_billing_date` (date)
      - `credentials_email` (text)
      - `credentials_password` (text, encrypted)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `group_members`
      - `id` (uuid, primary key)
      - `group_id` (uuid, references groups)
      - `user_id` (uuid, references profiles)
      - `role` (text, default 'member')
      - `payment_status` (text, default 'pending')
      - `joined_at` (timestamp)
      - `last_payment_date` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for group access and management
*/

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  platform text NOT NULL,
  plan_name text NOT NULL,
  monthly_cost numeric NOT NULL CHECK (monthly_cost > 0),
  max_members integer NOT NULL CHECK (max_members BETWEEN 2 AND 10),
  current_members integer DEFAULT 1 CHECK (current_members <= max_members),
  group_code text UNIQUE DEFAULT UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8)),
  is_private boolean DEFAULT false,
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  next_billing_date date,
  credentials_email text,
  credentials_password text, -- Will be encrypted in production
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue')),
  joined_at timestamptz DEFAULT now(),
  last_payment_date timestamptz,
  UNIQUE(group_id, user_id)
);

-- Enable RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Policies for groups
CREATE POLICY "Users can view groups they are members of"
  ON groups
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT group_id FROM group_members WHERE user_id = auth.uid()
    ) OR NOT is_private
  );

CREATE POLICY "Group owners can update their groups"
  ON groups
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create groups"
  ON groups
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Group owners can delete their groups"
  ON groups
  FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Policies for group_members
CREATE POLICY "Users can view group members of their groups"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (
    group_id IN (
      SELECT group_id FROM group_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Group owners can manage members"
  ON group_members
  FOR ALL
  TO authenticated
  USING (
    group_id IN (
      SELECT id FROM groups WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can join groups"
  ON group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave groups"
  ON group_members
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Function to automatically add owner as member when creating group
CREATE OR REPLACE FUNCTION add_owner_as_member()
RETURNS trigger AS $$
BEGIN
  INSERT INTO group_members (group_id, user_id, role, payment_status)
  VALUES (NEW.id, NEW.owner_id, 'owner', 'paid');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to add owner as member
CREATE TRIGGER on_group_created
  AFTER INSERT ON groups
  FOR EACH ROW EXECUTE FUNCTION add_owner_as_member();

-- Function to update member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE groups 
    SET current_members = (
      SELECT COUNT(*) FROM group_members WHERE group_id = NEW.group_id
    )
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE groups 
    SET current_members = (
      SELECT COUNT(*) FROM group_members WHERE group_id = OLD.group_id
    )
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for member count
CREATE TRIGGER update_member_count_on_insert
  AFTER INSERT ON group_members
  FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

CREATE TRIGGER update_member_count_on_delete
  AFTER DELETE ON group_members
  FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

-- Add updated_at triggers
CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_members_updated_at
  BEFORE UPDATE ON group_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();