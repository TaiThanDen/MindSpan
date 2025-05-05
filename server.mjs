import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { Buffer } from 'node:buffer';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tai25062006z@gmail.com', // 👈 thay bằng email thật
    pass: 'loqd cydm xzeg gtyo', // 👈 App Password (tuyệt đối không dùng mật khẩu thường)
  },
});

app.post('/send-email', async (req, res) => {
  const { to, subject, text, attachment } = req.body;

  const mailOptions = {
    from: `"Daily Bot" <tai25062006z@gmail.com>`,
    to,
    subject,
    text,
  };

  if (attachment) {
    mailOptions.attachments = [
      {
        filename: attachment.filename,
        content: Buffer.from(attachment.data, 'base64'),
      },
    ];
  }

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error('Gửi mail thất bại:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Email API server đang chạy tại http://localhost:${PORT}`);
});
