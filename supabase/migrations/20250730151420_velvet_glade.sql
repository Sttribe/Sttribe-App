/*
  # Chat and Messaging Schema

  1. New Tables
    - `group_messages`
      - `id` (uuid, primary key)
      - `group_id` (uuid, references groups)
      - `sender_id` (uuid, references profiles)
      - `message_type` (text) - text, recommendation, system
      - `content` (text)
      - `metadata` (jsonb) - for recommendations, system messages
      - `created_at` (timestamp)

    - `content_recommendations`
      - `id` (uuid, primary key)
      - `group_id` (uuid, references groups)
      - `recommended_by` (uuid, references profiles)
      - `title` (text)
      - `platform` (text)
      - `genre` (text)
      - `rating` (numeric)
      - `image_url` (text)
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for group chat access
*/

-- Create group_messages table
CREATE TABLE IF NOT EXISTS group_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'recommendation', 'system', 'payment')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create content_recommendations table
CREATE TABLE IF NOT EXISTS content_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  recommended_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  platform text NOT NULL,
  genre text,
  rating numeric CHECK (rating >= 0 AND rating <= 5),
  image_url text,
  description text,
  external_id text, -- For linking to external APIs
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies for group_messages
CREATE POLICY "Group members can view messages"
  ON group_messages
  FOR SELECT
  TO authenticated
  USING (
    group_id IN (
      SELECT group_id FROM group_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can send messages"
  ON group_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    group_id IN (
      SELECT group_id FROM group_members WHERE user_id = auth.uid()
    )
  );

-- Policies for content_recommendations
CREATE POLICY "Group members can view recommendations"
  ON content_recommendations
  FOR SELECT
  TO authenticated
  USING (
    group_id IN (
      SELECT group_id FROM group_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can create recommendations"
  ON content_recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    recommended_by = auth.uid() AND
    group_id IN (
      SELECT group_id FROM group_members WHERE user_id = auth.uid()
    )
  );

-- Policies for notifications
CREATE POLICY "Users can view their notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Function to create system message
CREATE OR REPLACE FUNCTION create_system_message(
  p_group_id uuid,
  p_content text,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  message_id uuid;
BEGIN
  INSERT INTO group_messages (group_id, message_type, content, metadata)
  VALUES (p_group_id, 'system', p_content, p_metadata)
  RETURNING id INTO message_id;
  
  RETURN message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to notify group members
CREATE OR REPLACE FUNCTION notify_group_members(
  p_group_id uuid,
  p_title text,
  p_message text,
  p_type text DEFAULT 'info',
  p_data jsonb DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  SELECT 
    gm.user_id,
    p_type,
    p_title,
    p_message,
    p_data
  FROM group_members gm
  WHERE gm.group_id = p_group_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;