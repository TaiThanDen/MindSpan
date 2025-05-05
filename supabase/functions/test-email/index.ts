import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { SMTPClient } from 'npm:emailjs@4.0.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailTest {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: {
    filename: string;
    content: string | Uint8Array;
    contentType?: string;
  }[];
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // Khởi tạo SMTP client với thông tin tài khoản Gmail
    const smtp = new SMTPClient({
      user: 'tai25062006z@gmail.com',
      password: 'bmap sdhh lzwj yify',
      host: 'smtp.gmail.com',
      ssl: true,
    });

    // Test case 1: Email văn bản đơn giản
    const simpleEmail: EmailTest = {
      to: 'tai25062006z@gmail.com',
      subject: 'Test Email Đơn Giản',
      text: 'Xin chào,\n\nĐây là email test đơn giản để kiểm tra hệ thống gửi email.\n\nTrân trọng,\nHệ thống MindSpan',
    };

    // Test case 2: Email với định dạng HTML
    const htmlEmail: EmailTest = {
      to: 'tai25062006z@gmail.com',
      subject: 'Test Email HTML',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2B6CB0;">MindSpan - Test Email HTML</h1>
          <p style="color: #4A5568; line-height: 1.6;">
            Xin chào,<br><br>
            Đây là email test với định dạng HTML để kiểm tra khả năng gửi email có style.
          </p>
          <div style="background-color: #EBF8FF; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2C5282; margin-top: 0;">Các tính năng được test:</h3>
            <ul style="color: #4A5568;">
              <li>Định dạng HTML</li>
              <li>CSS Styling</li>
              <li>Unicode tiếng Việt</li>
            </ul>
          </div>
          <p style="color: #718096; font-size: 14px;">
            Trân trọng,<br>
            Hệ thống MindSpan
          </p>
        </div>
      `,
    };

    // Test case 3: Email có file đính kèm
    const attachmentEmail: EmailTest = {
      to: 'tai25062006z@gmail.com',
      subject: 'Test Email với File Đính Kèm',
      text: 'Đây là email test có file đính kèm để kiểm tra khả năng gửi file.',
      attachments: [
        {
          filename: 'test.txt',
          content: 'Đây là nội dung file test.txt để kiểm tra tính năng đính kèm file.',
          contentType: 'text/plain'
        },
        {
          filename: 'test.html',
          content: '<h1>Test HTML</h1><p>Đây là file HTML test</p>',
          contentType: 'text/html'
        }
      ]
    };

    // Test case 4: Email nhiều người nhận
    const multiRecipientEmail: EmailTest = {
      to: 'tai25062006z@gmail.com',
      subject: 'Test Email Nhiều Người Nhận',
      text: 'Đây là email test gửi cho nhiều người nhận, bao gồm CC và BCC.',
      cc: ['tai25062006z@gmail.com'],
      bcc: ['tai25062006z@gmail.com']
    };

    // Thực hiện gửi các email test
    const testResults = [];
    const testCases = [simpleEmail, htmlEmail, attachmentEmail, multiRecipientEmail];

    for (const testCase of testCases) {
      const startTime = Date.now();
      try {
        await smtp.send({
          from: 'tai25062006z@gmail.com',
          ...testCase
        });

        testResults.push({
          subject: testCase.subject,
          success: true,
          timeTaken: Date.now() - startTime,
          error: null
        });
      } catch (error) {
        testResults.push({
          subject: testCase.subject,
          success: false,
          timeTaken: Date.now() - startTime,
          error: error.message
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      results: testResults,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});