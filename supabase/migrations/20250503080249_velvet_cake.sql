/*
  # Cập nhật hệ thống lưu trữ và email

  1. Thay đổi
    - Thêm các cột mới vào bảng files
    - Thêm ràng buộc cho kích thước và loại file
    - Thiết lập storage bucket và policies
  
  2. Bảo mật
    - Đảm bảo RLS cho tất cả các bảng
    - Thiết lập policies cho storage
*/

-- Cập nhật bảng files
ALTER TABLE files
ADD COLUMN IF NOT EXISTS path text,
ADD COLUMN IF NOT EXISTS type text,
ADD COLUMN IF NOT EXISTS size integer;

-- Thêm ràng buộc cho files sau khi đã thêm cột
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_file_type'
  ) THEN
    ALTER TABLE files
    ADD CONSTRAINT valid_file_type CHECK (
      type = ANY (ARRAY[
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ])
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_file_size'
  ) THEN
    ALTER TABLE files
    ADD CONSTRAINT valid_file_size CHECK (size <= 10485760); -- 10MB in bytes
  END IF;
END $$;

-- Thiết lập storage
DO $$
BEGIN
  -- Tạo bucket nếu chưa tồn tại
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('file_storage', 'file_storage', false)
  ON CONFLICT (id) DO NOTHING;

  -- Xóa policies cũ nếu tồn tại
  DROP POLICY IF EXISTS "Users can upload files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

  -- Tạo policies mới
  CREATE POLICY "Allow user upload to file_storage"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'file_storage' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );

  CREATE POLICY "Allow user view from file_storage"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
      bucket_id = 'file_storage' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );

  CREATE POLICY "Allow user delete from file_storage"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'file_storage' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
END $$;