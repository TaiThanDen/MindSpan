import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  Clock,
  FolderPlus,
  Folder,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../config/supabase';

const DailyEmail: React.FC = () => {
  const [folders, setFolders] = useState<any[]>([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [emailSettings, setEmailSettings] = useState({
    sendTime: '08:00',
    frequency: 1,
    selectedFolders: [] as string[],
  });

  useEffect(() => {
    fetchUserEmail();
    fetchFolders();
    fetchEmailSettings();
  }, []);
  const normalizeFileName = (name: string) => {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
      .replace(/\s+/g, '-') // Thay khoảng trắng bằng "-"
      .replace(/[^a-zA-Z0-9-\.]/g, '') // Loại bỏ ký tự đặc biệt (giữ lại .)
      .toLowerCase(); // Chuyển về chữ thường
  };

  const fetchUserEmail = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email) setUserEmail(user.email);
  };

  const fetchEmailSettings = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.id) return;

    const { data } = await supabase
      .from('email_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (data) {
      setEmailSettings({
        sendTime: data.send_time,
        frequency: data.frequency,
        selectedFolders: data.selected_folders || [],
      });
    }
  };

  const sanitizeContent = (content: string) =>
    content
      .replace(/\0/g, '')
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
      .trim();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!selectedFolder) {
        setMessage({
          type: 'error',
          text: 'Vui lòng chọn thư mục trước khi tải lên',
        });
        return;
      }
      setLoading(true);
      setMessage(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user?.id) throw new Error('User not authenticated');

        for (const file of acceptedFiles) {
          const normalizedName = normalizeFileName(file.name); // 🔄 Thay vì dùng file.name

          let fileContent: string;
          let publicUrl: string | null = null;
          let storagePath: string | null = null;

          if (
            file.type.startsWith('image/') ||
            file.type === 'application/pdf'
          ) {
            const path = `uploads/${user.id}/${Date.now()}-${normalizedName}`; // 🔄 dùng tên đã chuẩn hóa
            const { data: sd, error: se } = await supabase.storage
              .from('mindspandb')
              .upload(path, file, { cacheControl: '3600' });
            if (se) throw se;
            storagePath = sd.path;

            const { data: pu } = supabase.storage
              .from('mindspandb')
              .getPublicUrl(storagePath);
            publicUrl = pu.publicUrl;

            fileContent = sanitizeContent(
              `[${
                file.type.startsWith('image/') ? 'Image' : 'PDF'
              }] ${normalizedName}` // 🔄 tên file chuẩn hóa
            );
          } else {
            const text = await file.text();
            fileContent = sanitizeContent(text);
          }

          const { error: fe } = await supabase.from('files').insert({
            name: normalizedName, // 🔄 ghi tên file đã chuẩn hóa vào DB
            content: fileContent,
            file_url: publicUrl,
            storage_path: storagePath,
            folder_id: selectedFolder,
            user_id: user.id,
            file_type: file.type,
          });
          if (fe) throw fe;
        }
        setMessage({ type: 'success', text: 'Tải lên tệp thành công' });
      } catch (err: any) {
        setMessage({ type: 'error', text: 'Lỗi khi tải lên: ' + err.message });
      } finally {
        setLoading(false);
      }
    },
    [selectedFolder]
  );
  const handleTestEmail = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('User not authenticated');

      const session = await supabase.auth.getSession();
      const access_token = session.data.session?.access_token;
      if (!access_token) throw new Error('Missing access token');

      const res = await fetch(
        'https://fvrnedtqidpcfiymfnjz.supabase.co/functions/v1/send-daily-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({ user_id: user.id }),
        }
      );

      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error('Phản hồi không hợp lệ từ server');
      }

      if (!res.ok) throw new Error(result.error || 'Gửi thử thất bại');

      setMessage({
        type: 'success',
        text: `Đã gửi thử email thành công đến ${user.email}`,
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Lỗi gửi thử email: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
  });

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('User not authenticated');
      const { error } = await supabase.from('folders').insert({
        name: newFolderName,
        user_id: user.id,
      });
      if (error) throw error;
      setNewFolderName('');
      await fetchFolders();
      setMessage({ type: 'success', text: 'Tạo thư mục thành công' });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: 'Lỗi khi tạo thư mục: ' + err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.id) return;
    const { data } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', user.id);
    setFolders(data || []);
  };

  const updateEmailSettings = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('User not authenticated');
      const { error } = await supabase.from('email_settings').upsert(
        {
          user_id: user.id,
          send_time: emailSettings.sendTime,
          frequency: emailSettings.frequency,
          selected_folders: emailSettings.selectedFolders,
        },
        { onConflict: ['user_id'] }
      );
      if (error) throw error;
      setMessage({
        type: 'success',
        text: 'Cập nhật cài đặt email thành công',
      });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: 'Lỗi khi cập nhật cài đặt email: ' + err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Cài đặt Email Hàng ngày
      </h1>
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          <AlertCircle className="h-5 w-5 mr-2" />
          {message.text}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cấu hình Email */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-600" /> Cấu hình Email
          </h2>
          <label className="block text-sm font-medium mb-1">
            Địa chỉ Email của bạn
          </label>
          <input
            type="email"
            value={userEmail}
            readOnly
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 mb-2"
          />
          <p className="text-sm text-gray-500">
            Email này sẽ nhận các bài đánh giá hàng ngày
          </p>
          <button
            onClick={handleTestEmail}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 mt-4"
          >
            Gửi thử email
          </button>
        </div>

        {/* Quản lý Thư mục */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FolderPlus className="h-5 w-5 mr-2 text-blue-600" /> Quản lý Thư
            mục
          </h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Tên thư mục mới"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            />
            <button
              onClick={createFolder}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Tạo
            </button>
          </div>
          <div className="space-y-2">
            {folders.map((f) => (
              <div
                key={f.id}
                onClick={() => setSelectedFolder(f.id)}
                className={`p-3 rounded-md cursor-pointer flex items-center ${
                  selectedFolder === f.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <Folder className="h-5 w-5 mr-2" />
                {f.name}
              </div>
            ))}
          </div>
        </div>

        {/* Tải lên Tệp */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Upload className="h-5 w-5 mr-2 text-blue-600" /> Tải lên Tệp
          </h2>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-500'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p>
              {isDragActive
                ? 'Thả tệp vào đây...'
                : 'Kéo & thả hoặc click để chọn tệp'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Hỗ trợ .txt, .docx, .pdf, .xls, .xlsx, ảnh
            </p>
          </div>
        </div>

        {/* Lịch Đánh giá */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" /> Lịch Đánh giá
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Thời gian gửi
              </label>
              <input
                type="time"
                value={emailSettings.sendTime}
                onChange={(e) =>
                  setEmailSettings({
                    ...emailSettings,
                    sendTime: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Tần suất (ngày)
              </label>
              <select
                value={emailSettings.frequency}
                onChange={(e) =>
                  setEmailSettings({
                    ...emailSettings,
                    frequency: Number(e.target.value),
                  })
                }
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              >
                <option value={1}>Mỗi ngày</option>
                <option value={3}>3 ngày một lần</option>
                <option value={7}>Mỗi tuần</option>
                <option value={14}>2 tuần một lần</option>
                <option value={30}>Mỗi tháng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Chọn Thư mục để Đánh giá
              </label>
              <div className="space-y-2">
                {folders.map((f) => (
                  <label key={f.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={emailSettings.selectedFolders.includes(f.id)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...emailSettings.selectedFolders, f.id]
                          : emailSettings.selectedFolders.filter(
                              (id) => id !== f.id
                            );
                        setEmailSettings({
                          ...emailSettings,
                          selectedFolders: next,
                        });
                      }}
                      className="rounded border-gray-300 text-blue-600 mr-2"
                    />
                    {f.name}
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={updateEmailSettings}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Lưu Cài đặt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyEmail;
