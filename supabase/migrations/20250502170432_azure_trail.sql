/*
  # Add Storage RLS Policy for File Uploads

  1. Security
    - Add RLS policy to allow authenticated users to upload files to mindspandb bucket
    - Policy ensures only authenticated users can upload files
    - Bucket ID is checked to ensure uploads only go to mindspandb bucket

  Note: This migration adds the necessary storage policy to allow file uploads
*/

-- Add policy to allow authenticated users to upload files
CREATE POLICY "Authenticated can upload"
ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'mindspandb' AND 
  auth.role() = 'authenticated'
);