// ✅ send-daily-email Supabase Edge Function with attachment support
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { SmtpClient } from 'https://deno.land/x/smtp/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

async function sendEmailWithAttachment(
  to: string,
  subject: string,
  content: string,
  attachment?: { filename: string; data: Uint8Array }
) {
  const client = new SmtpClient();
  await client.connectTLS({
    hostname: 'smtp.gmail.com',
    port: 465,
    username: Deno.env.get('SMTP_USER')!,
    password: Deno.env.get('SMTP_PASSWORD')!,
  });

  await client.send({
    from: Deno.env.get('SMTP_USER')!,
    to,
    subject,
    content,
    attachments: attachment
      ? [
          {
            content: attachment.data,
            filename: attachment.filename,
          },
        ]
      : [],
  });
  await client.close();
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    const { user_id } = await req.json();
    if (!user_id) throw new Error('Missing user_id');

    const vietnamTime = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
    );

    const { data: setting } = await supabaseClient
      .from('email_settings')
      .select('*')
      .eq('user_id', user_id)
      .single();
    if (!setting) throw new Error('Email setting not found');

    const { data: files } = await supabaseClient
      .from('files')
      .select('*')
      .in('folder_id', setting.selected_folders)
      .eq('user_id', setting.user_id);
    if (!files?.length) throw new Error('No files available');

    const randomFile = files[Math.floor(Math.random() * files.length)];

    const { data: folder } = await supabaseClient
      .from('folders')
      .select('name')
      .eq('id', randomFile.folder_id)
      .single();

    const { data: user } = await supabaseClient.auth.admin.getUserById(user_id);
    if (!user?.user?.email) throw new Error('User email not found');

    let attachment;
    let emailText = randomFile.content || '[No text content]';

    if (randomFile.storage_path) {
      const { data: fileBin, error } = await supabaseClient.storage
        .from('mindspandb')
        .download(randomFile.storage_path);

      if (error) throw error;
      const arrayBuffer = await fileBin.arrayBuffer();
      attachment = {
        filename: randomFile.name,
        data: new Uint8Array(arrayBuffer),
      };
    }

    await sendEmailWithAttachment(
      user.user.email,
      `Daily Review: ${folder?.name || 'Folder'} - ${randomFile.name}`,
      emailText,
      attachment
    );

    await supabaseClient
      .from('email_settings')
      .update({ last_sent: new Date().toISOString() })
      .eq('id', setting.id);

    await supabaseClient
      .from('files')
      .update({ last_reviewed: new Date().toISOString() })
      .eq('id', randomFile.id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
