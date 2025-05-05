import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { Buffer } from 'node:buffer';
import { createClient } from '@supabase/supabase-js';

// ⚠️ Khởi tạo Supabase client với URL & Service Role Key từ biến môi trường
const supabase = createClient(
  process.env.SB_URL,
  process.env.SB_SERVICE_ROLE_KEY
);


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
async function sendEmailWithAttachment(to, subject, content, attachment) {
  const mailOptions = {
    from: '"Daily Bot" <tai25062006z@gmail.com>',
    to,
    subject,
    text: content,
  };

  if (attachment) {
    mailOptions.attachments = [
      {
        filename: attachment.filename,
        content: Buffer.from(attachment.data).toString('base64'),
        encoding: 'base64',
      },
    ];
  }

  await transporter.sendMail(mailOptions);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tai25062006z@gmail.com', // 👈 thay bằng email thật
    pass: 'loqd cydm xzeg gtyo', // 👈 App Password (tuyệt đối không dùng mật khẩu thường)
  },
});

app.post('/send-email', async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    // Lấy setting người dùng
    const { data: setting, error: settingErr } = await supabase
      .from('email_settings')
      .select('*')
      .eq('user_id', user_id)
      .single();
    if (settingErr || !setting) throw new Error('Email setting not found');

    // Lấy các files từ các folders đã chọn
    const { data: files, error: filesErr } = await supabase
      .from('files')
      .select('*')
      .in('folder_id', setting.selected_folders)
      .eq('user_id', user_id);
    if (filesErr || !files?.length) throw new Error('No files available');

    // Chọn file ngẫu nhiên
    const randomFile = files[Math.floor(Math.random() * files.length)];

    // Lấy tên folder
    const { data: folder } = await supabase
      .from('folders')
      .select('name')
      .eq('id', randomFile.folder_id)
      .single();

    // Lấy email từ auth
    const { data: userData } = await supabase.auth.admin.getUserById(user_id);
    const userEmail = userData?.user?.email;
    if (!userEmail) throw new Error('User email not found');

    // Chuẩn bị nội dung
    let attachment;
    let emailText = randomFile.content || '[No text content]';

    if (randomFile.storage_path) {
      const { data: fileBin, error } = await supabase.storage
        .from('mindspandb')
        .download(randomFile.storage_path);
      if (error) throw error;

      const arrayBuffer = await fileBin.arrayBuffer();
      attachment = {
        filename: randomFile.name,
        data: new Uint8Array(arrayBuffer),
      };
    }

    // Gửi mail
    await sendEmailWithAttachment(
      userEmail,
      `Daily Review: ${folder?.name || 'Folder'} - ${randomFile.name}`,
      emailText,
      attachment
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Lỗi gửi email:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Email API server đang chạy tại http://localhost:${PORT}`);
});
