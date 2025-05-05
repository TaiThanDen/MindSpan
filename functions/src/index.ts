import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass
  }
});

interface EmailSettings {
  userId: string;
  sendTime: string;
  frequency: number;
  selectedFolders: string[];
  lastSent: admin.firestore.Timestamp | null;
}

interface UploadedFile {
  id: string;
  name: string;
  content: string;
  folderId: string;
  userId: string;
  createdAt: admin.firestore.Timestamp;
  lastReviewed: admin.firestore.Timestamp | null;
}

export const sendDailyEmail = functions.pubsub
  .schedule('every 1 hours')
  .timeZone('Asia/Ho_Chi_Minh')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();

    // Get all email settings
    const settingsSnapshot = await admin.firestore()
      .collection('emailSettings')
      .get();

    for (const doc of settingsSnapshot.docs) {
      const settings = doc.data() as EmailSettings;
      const [hour, minute] = settings.sendTime.split(':').map(Number);

      // Check if it's time to send email
      if (currentHour === hour && currentMinute >= minute) {
        // Check frequency
        if (settings.lastSent) {
          const daysSinceLastSent = (now.seconds - settings.lastSent.seconds) / (24 * 60 * 60);
          if (daysSinceLastSent < settings.frequency) continue;
        }

        // Get random file from selected folders
        const filesQuery = await admin.firestore()
          .collection('files')
          .where('userId', '==', settings.userId)
          .where('folderId', 'in', settings.selectedFolders)
          .get();

        if (!filesQuery.empty) {
          const files = filesQuery.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as UploadedFile[];

          const randomFile = files[Math.floor(Math.random() * files.length)];

          // Get user email
          const userDoc = await admin.firestore()
            .collection('users')
            .doc(settings.userId)
            .get();

          if (userDoc.exists) {
            const userEmail = userDoc.data()?.email;

            // Send email
            await transporter.sendMail({
              from: functions.config().email.user,
              to: userEmail,
              subject: `Daily Review: ${randomFile.name}`,
              html: `
                <h2>Your Daily Review</h2>
                <p style="white-space: pre-wrap;">${randomFile.content}</p>
              `
            });

            // Update last sent time
            await doc.ref.update({
              lastSent: now
            });

            // Update file's last reviewed time
            await admin.firestore()
              .collection('files')
              .doc(randomFile.id)
              .update({
                lastReviewed: now
              });
          }
        }
      }
    }
  });