/*
  # Add Storage and Files Policies

  1. Storage Policies
    - Add policy for mindspandb bucket to allow authenticated users to upload files
    - Add policy for mindspandb bucket to allow authenticated users to read their files
  
  2. Files Table Policies
    - Add policy to allow authenticated users to insert their own files
    - Add policy to allow authenticated users to read their own files
*/

-- Enable Storage Policies for mindspandb bucket
BEGIN;

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('mindspandb', 'mindspandb')
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload files to their own directory
CREATE POLICY "Allow users to upload files to their directory"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'mindspandb' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow users to read their own files
CREATE POLICY "Allow users to read their own files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'mindspandb' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Files table policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can manage their own files" ON files;
  DROP POLICY IF EXISTS "Allow insert if user_id = auth.uid()" ON files;
  
  -- Create new comprehensive policies
  CREATE POLICY "Users can read their own files"
    ON files FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert their own files"
    ON files FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update their own files"
    ON files FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can delete their own files"
    ON files FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
END $$;

COMMIT;