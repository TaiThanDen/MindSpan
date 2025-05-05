/*
  # Add file type and URL columns to files table

  1. Changes
    - Add `file_type` column to `files` table to store MIME type
    - Add `file_url` column to `files` table to store storage URL
*/

ALTER TABLE files
ADD COLUMN file_type text,
ADD COLUMN file_url text;