/*
  # Update file storage implementation
  
  1. Changes
    - Make content column nullable since we'll store file content in Storage
    - Add indexes for faster queries
    - Update RLS policies to handle file storage

  2. Security
    - Maintain existing RLS policies
    - Ensure secure file access
*/

-- Make content nullable since we'll store actual files in Storage
ALTER TABLE files 
ALTER COLUMN content DROP NOT NULL;

-- Add indexes for common queries
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_folder_id ON files(folder_id);
CREATE INDEX idx_files_created_at ON files(created_at);

-- Update the files policy to include storage access
CREATE POLICY "Users can access their own files in storage" 
ON storage.objects 
FOR ALL 
TO authenticated 
USING (bucket_id = 'mindspandb' AND (storage.foldername(name))[1] = auth.uid()::text);