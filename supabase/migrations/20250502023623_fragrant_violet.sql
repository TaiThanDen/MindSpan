/*
  # Initial schema setup for file management and email settings

  1. New Tables
    - `folders`
      - `id` (uuid, primary key)
      - `name` (text)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `files`
      - `id` (uuid, primary key)
      - `name` (text)
      - `content` (text)
      - `folder_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `last_reviewed` (timestamp)
    
    - `email_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `send_time` (time)
      - `frequency` (integer)
      - `selected_folders` (uuid[])
      - `last_sent` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create folders table
CREATE TABLE folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create files table
CREATE TABLE files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  content text NOT NULL,
  folder_id uuid REFERENCES folders(id),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  last_reviewed timestamptz
);

-- Create email settings table
CREATE TABLE email_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) UNIQUE,
  send_time time NOT NULL DEFAULT '08:00',
  frequency integer NOT NULL DEFAULT 1,
  selected_folders uuid[] DEFAULT '{}',
  last_sent timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own folders"
  ON folders
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own files"
  ON files
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own email settings"
  ON email_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);