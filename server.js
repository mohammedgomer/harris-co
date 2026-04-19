import express from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

// ============================================
// CONFIGURATION
// ============================================
const SOLICITOR_EMAIL = 'mg.omer@outlook.com';
const FIRM_NAME = 'Harris & Co Solicitors';
const FIRM_PHONE = '0161 537 3777';

// Gmail SMTP - configure your credentials
const EMAIL_USER = 'mgmussa1@gmail.com';
const EMAIL_PASS = 'ulja htjm gute qole';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL_USER, pass: EMAIL_PASS }
});

transporter.verify((err) => {
  if (err) {
    console.log('\n❌ EMAIL CONNECTION FAILED:', err.message);
    console.log('  Fix: Set your Gmail + App Password in server.js\n');
  } else {
    console.log('✅ Email connection verified\n');
  }
});

// ============================================
// BOOKINGS DATABASE (JSON file)
// ============================================
const DB_FILE = path.join(__dirname, 'bookings.json');

function loadBookings() {
  try {
    if (fs.existsSync(DB_FILE)) return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) { console.log('DB read error:', e.message); }
  return { bookings: [] };
}

function saveBookings(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ============================================
// GOOGLE CALENDAR INTEGRATION (optional)
// ============================================
// To enable Google Calendar sync:
// 1. Go to console.cloud.google.com
// 2. Create a project → Enable Google Calendar API
// 3. Create OAuth2 credentials (Web application)
// 4. Set redirect URI to http://localhost:3001/auth/google/callback
// 5. Fill in the values below
// 6. Visit http://localhost:3001/auth/google to authorize

const GOOGLE_CLIENT_ID = '';     // Leave empty to skip Google Calendar
const GOOGLE_CLIENT_SECRET = '';
const GOOGLE_REDIRECT_URI = 'http://localhost:3001/auth/google/callback';
let googleTokens = null;
const GOOGLE_TOKENS_FILE = path.join(__dirname, 'google-tokens.json');

try {
  if (fs.existsSync(GOOGLE_TOKENS_FILE)) {
    googleTokens = JSON.parse(fs.readFileSync(GOOGLE_TOKENS_FILE, 'utf8'));
  }
} catch (e) {}

function isGoogleEnabled() {
  return GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && googleTokens;
}

async function googleApiRequest(method, url, body = null) {
  if (!googleTokens) return null;
  // Refresh token if expired
  if (googleTokens.expiry_date && Date.now() > googleTokens.expiry_date - 60000) {
    try {
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          refresh_token: googleTokens.refresh_token,
          grant_type: 'refresh_token'
        })
      });
      const data = await res.json();
      googleTokens.access_token = data.access_token;
      googleTokens.expiry_date = Date.now() + (data.expires_in * 1000);
      fs.writeFileSync(GOOGLE_TOKENS_FILE, JSON.stringify(googleTokens, null, 2));
    } catch (e) { console.log('Token refresh error:', e.message); }
  }
  const opts = {
    method,
    headers: {
      'Authorization': 'Bearer ' + googleTokens.access_token,
      'Content-Type': 'application/json'
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  return res.json();
}

async function createCalendarEvent(booking) {
  if (!isGoogleEnabled()) return null;
  const startDate = new Date(booking.date + ' ' + booking.time);
  const endDate = new Date(startDate.getTime() + 30 * 60000);
  const event = {
    summary: `${booking.parentCategory}/${booking.subcategory} — ${booking.clientName}`,
    description: `Ref: ${booking.ref}\nClient: ${booking.clientName}\nPhone: ${booking.clientPhone}\nEmail: ${booking.clientEmail}\nType: ${booking.consultationType}\nCase: ${booking.parentCategory} > ${booking.subcategory}\n\n${booking.description || ''}`,
    start: { dateTime: startDate.toISOString(), timeZone: 'Europe/London' },
    end: { dateTime: endDate.toISOString(), timeZone: 'Europe/London' },
    reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 30 }] }
  };
  try {
    const result = await googleApiRequest('POST', 'https://www.googleapis.com/calendar/v3/calendars/primary/events', event);
    return result?.id || null;
  } catch (e) { console.log('Calendar event error:', e.message); return null; }
}

async function deleteCalendarEvent(eventId) {
  if (!isGoogleEnabled() || !eventId) return;
  try {
    await googleApiRequest('DELETE', `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`);
  } catch (e) { console.log('Calendar delete error:', e.message); }
}

// Google OAuth routes
app.get('/auth/google', (req, res) => {
  if (!GOOGLE_CLIENT_ID) return res.send('<h2>Google Calendar not configured</h2><p>Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to server.js</p>');
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent('https://www.googleapis.com/auth/calendar')}&access_type=offline&prompt=consent`;
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: req.query.code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });
    googleTokens = await tokenRes.json();
    googleTokens.expiry_date = Date.now() + (googleTokens.expires_in * 1000);
    fs.writeFileSync(GOOGLE_TOKENS_FILE, JSON.stringify(googleTokens, null, 2));
    res.send('<h2 style="color:green">✅ Google Calendar connected!</h2><p>Bookings will now sync to your calendar. You can close this tab.</p>');
  } catch (e) {
    res.send('<h2 style="color:red">❌ Failed</h2><pre>' + e.message + '</pre>');
  }
});

// ============================================
// API: GET AVAILABLE SLOTS
// ============================================
app.get('/api/availability', (req, res) => {
  const { solicitorId, date } = req.query;
  if (!solicitorId || !date) return res.status(400).json({ error: 'solicitorId and date required' });

  const db = loadBookings();
  const TIME_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'];

  // Find all active bookings for this solicitor on this date
  const booked = db.bookings
    .filter(b => b.solicitorId === parseInt(solicitorId) && b.dateKey === date && b.status === 'active')
    .map(b => b.time);

  const available = TIME_SLOTS.filter(slot => !booked.includes(slot));
  res.json({ date, solicitorId, available, booked });
});

// ============================================
// API: CREATE BOOKING
// ============================================
app.post('/api/bookings', upload.array('files', 20), async (req, res) => {
  try {
    const data = JSON.parse(req.body.bookingData);
    const db = loadBookings();

    // Check slot is still available (prevent double booking)
    const existing = db.bookings.find(b =>
      b.solicitorId === data.solicitorId &&
      b.dateKey === data.dateKey &&
      b.time === data.time &&
      b.status === 'active'
    );
    if (existing) {
      return res.status(409).json({ success: false, error: 'This time slot has just been booked. Please choose another.' });
    }

    // Save booking
    const booking = {
      ref: data.ref,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      parentCategory: data.parentCategory,
      subcategory: data.subcategory,
      consultationType: data.consultationType,
      date: data.date,
      dateKey: data.dateKey,
      time: data.time,
      solicitor: data.solicitor,
      solicitorId: data.solicitorId,
      deposit: data.deposit,
      vat: data.vat,
      total: data.total,
      description: data.description,
      fileCount: (req.files || []).length,
      status: 'active',
      createdAt: new Date().toISOString(),
      calendarEventId: null
    };

    db.bookings.push(booking);
    saveBookings(db);
    console.log(`✅ Booking saved: ${booking.ref} — ${booking.solicitor} — ${booking.date} ${booking.time}`);

    // Create Google Calendar event
    const eventId = await createCalendarEvent(booking);
    if (eventId) {
      booking.calendarEventId = eventId;
      saveBookings(db);
      console.log('📅 Google Calendar event created');
    }

    // Send emails
    const attachments = (req.files || []).map(f => ({
      filename: f.originalname, content: f.buffer, contentType: f.mimetype
    }));

    // Client confirmation email
    try {
      const clientHtml = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0d6c2; border-radius: 12px; overflow: hidden;">
          <div style="background: #1a1a1a; padding: 28px; text-align: center; border-bottom: 3px solid #f9e2a8;">
            <h1 style="color: #f9e2a8; font-size: 24px; margin: 0; font-weight: 400;">${FIRM_NAME}</h1>
            <p style="color: #ccc; font-size: 13px; margin: 6px 0 0;">Booking Confirmation</p>
          </div>
          <div style="padding: 32px;">
            <p style="font-size: 16px; color: #2c2c2c;">Dear ${data.clientName},</p>
            <p style="font-size: 15px; color: #2c2c2c; line-height: 1.7;">Thank you for booking a consultation with ${FIRM_NAME}. Your appointment details are confirmed below.</p>
            <div style="background: #fdf6e3; border: 1px solid #f9e2a8; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h2 style="font-size: 16px; color: #1a1a1a; margin: 0 0 16px; border-bottom: 1px solid #e0d6c2; padding-bottom: 10px;">Appointment Details</h2>
              <table style="width: 100%; font-size: 14px; color: #2c2c2c;">
                <tr><td style="padding: 6px 0; color: #6b6b6b; width: 140px;">Reference</td><td style="padding: 6px 0; font-weight: 600; font-family: monospace; letter-spacing: 1px;">${data.ref}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b6b6b;">Case Type</td><td style="padding: 6px 0; font-weight: 600;">${data.parentCategory} — ${data.subcategory}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b6b6b;">Consultation</td><td style="padding: 6px 0; font-weight: 600;">${data.consultationType === 'walk-in' ? 'Walk-in (Office Visit)' : 'Phone Consultation'}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b6b6b;">Date</td><td style="padding: 6px 0; font-weight: 600;">${data.date}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b6b6b;">Time</td><td style="padding: 6px 0; font-weight: 600;">${data.time} (30 minutes)</td></tr>
                <tr><td style="padding: 6px 0; color: #6b6b6b;">Solicitor</td><td style="padding: 6px 0; font-weight: 600;">${data.solicitor}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b6b6b;">Deposit Paid</td><td style="padding: 6px 0; font-weight: 600;">£${data.total} (inc. VAT)</td></tr>
              </table>
            </div>
            <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 14px; color: #6b6b6b;">
              ${data.consultationType === 'walk-in'
                ? '📍 Please arrive 5 minutes before your appointment. Bring a valid photo ID.'
                : '📞 Your solicitor will call you on ' + data.clientPhone + ' at the scheduled time.'}
            </div>
            <p style="font-size: 14px; color: #6b6b6b; line-height: 1.6;">To reschedule or cancel, visit our booking portal or call <strong>${FIRM_PHONE}</strong>.</p>
          </div>
          <div style="background: #1a1a1a; padding: 20px; text-align: center;">
            <p style="color: #f9e2a8; font-size: 14px; margin: 0 0 4px;">${FIRM_NAME}</p>
            <p style="color: #999; font-size: 12px; margin: 0;">☎ ${FIRM_PHONE}</p>
          </div>
        </div>`;
      await transporter.sendMail({
        from: `"${FIRM_NAME}" <${EMAIL_USER}>`,
        to: data.clientEmail,
        subject: `Booking Confirmed — ${data.ref} | ${FIRM_NAME}`,
        html: clientHtml
      });
      console.log('✅ Client email sent to:', data.clientEmail);
    } catch (e) { console.log('⚠️ Client email failed:', e.message); }

    // Solicitor briefing with attachments
    try {
      const summary = data.aiSummary;
      let text = `NEW BOOKING: ${data.ref}\n${'='.repeat(50)}\n\n`;
      text += `CLIENT: ${data.clientName}\nEmail: ${data.clientEmail}\nPhone: ${data.clientPhone}\n\n`;
      text += `CASE: ${data.parentCategory} > ${data.subcategory}\nType: ${data.consultationType}\nDate: ${data.date}\nTime: ${data.time}\nSolicitor: ${data.solicitor}\nPaid: £${data.total}\nFiles: ${attachments.length}\n\n`;
      text += `Description:\n${data.description || 'Not provided'}\n\n`;
      if (summary) {
        text += `${'='.repeat(50)}\nAI CASE ANALYSIS\n${'='.repeat(50)}\n\n`;
        text += `SUMMARY: ${summary.summary}\nURGENCY: ${summary.urgency}\nRISK: ${summary.riskLevel}\n\n`;
        text += `--- LEGAL SOLUTIONS ---\n`;
        summary.solutions.forEach((s, i) => { text += `${i+1}. ${s.title}: ${s.detail}\n\n`; });
        text += `--- UK LEGISLATION ---\n`;
        summary.legislation.forEach(l => { text += `• ${l.act} | ${l.relevance}\n`; });
        text += `\n--- IMMEDIATE ACTIONS ---\n`;
        summary.immediateActions.forEach(a => { text += `• ${a}\n`; });
        text += `\n--- NEXT STEPS ---\n${summary.nextSteps}\n`;
      }
      await transporter.sendMail({
        from: `"${FIRM_NAME}" <${EMAIL_USER}>`,
        to: SOLICITOR_EMAIL,
        subject: `📋 New Booking ${data.ref} — ${data.parentCategory}/${data.subcategory} — ${data.clientName}`,
        text,
        attachments
      });
      console.log('✅ Solicitor email sent with', attachments.length, 'attachments');
    } catch (e) { console.log('⚠️ Solicitor email failed:', e.message); }

    res.json({ success: true, ref: booking.ref });

  } catch (error) {
    console.error('❌ Booking error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// API: CANCEL BOOKING
// ============================================
app.post('/api/bookings/cancel', async (req, res) => {
  const { ref, name } = req.body;
  const db = loadBookings();
  const refClean = (ref || '').trim().toUpperCase();
  const nameClean = (name || '').trim().toLowerCase();
  
  // Match by ref first, then verify name loosely (contains match)
  const booking = db.bookings.find(b => {
    if (b.ref !== refClean || b.status !== 'active') return false;
    if (!nameClean) return true;
    const bName = b.clientName.toLowerCase();
    return bName === nameClean || bName.includes(nameClean) || nameClean.includes(bName);
  });
  if (!booking) return res.status(404).json({ success: false, error: 'Booking not found. Check your reference number and name match exactly.' });

  booking.status = 'cancelled';
  booking.cancelledAt = new Date().toISOString();
  saveBookings(db);

  await deleteCalendarEvent(booking.calendarEventId);

  // Send cancellation email to client
  try {
    await transporter.sendMail({
      from: `"${FIRM_NAME}" <${EMAIL_USER}>`,
      to: booking.clientEmail,
      subject: `Booking Cancelled — ${booking.ref} | ${FIRM_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0d6c2; border-radius: 12px; overflow: hidden;">
          <div style="background: #1a1a1a; padding: 24px; text-align: center; border-bottom: 3px solid #f9e2a8;">
            <h1 style="color: #f9e2a8; font-size: 22px; margin: 0;">${FIRM_NAME}</h1>
          </div>
          <div style="padding: 28px;">
            <p style="font-size: 16px;">Dear ${booking.clientName},</p>
            <p>Your booking <strong style="font-family: monospace;">${booking.ref}</strong> has been <strong style="color: #b33a3a;">cancelled</strong>.</p>
            <div style="background: #fceaea; border: 1px solid #f5c6c6; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 4px 0;"><strong>Case:</strong> ${booking.parentCategory} — ${booking.subcategory}</p>
              <p style="margin: 4px 0;"><strong>Date:</strong> ${booking.date}</p>
              <p style="margin: 4px 0;"><strong>Time:</strong> ${booking.time}</p>
              <p style="margin: 4px 0;"><strong>Solicitor:</strong> ${booking.solicitor}</p>
            </div>
            <p style="color: #b33a3a; font-size: 14px;">Please note your deposit is non-refundable.</p>
            <p style="font-size: 14px; color: #666;">To rebook, visit our booking portal or call <strong>${FIRM_PHONE}</strong>.</p>
          </div>
          <div style="background: #1a1a1a; padding: 16px; text-align: center;">
            <p style="color: #f9e2a8; font-size: 13px; margin: 0;">${FIRM_NAME} | ☎ ${FIRM_PHONE}</p>
          </div>
        </div>`
    });
    console.log('✅ Cancellation email sent to client:', booking.clientEmail);
  } catch (e) { console.log('⚠️ Cancellation client email failed:', e.message); }

  // Notify solicitor
  try {
    await transporter.sendMail({
      from: `"${FIRM_NAME}" <${EMAIL_USER}>`,
      to: SOLICITOR_EMAIL,
      subject: `❌ Booking Cancelled — ${booking.ref} — ${booking.clientName}`,
      text: `CANCELLATION\n\nRef: ${booking.ref}\nClient: ${booking.clientName}\nCase: ${booking.parentCategory} > ${booking.subcategory}\nOriginal Date: ${booking.date}\nOriginal Time: ${booking.time}\nSolicitor: ${booking.solicitor}\n\nThe slot ${booking.date} ${booking.time} is now free for new bookings.`
    });
    console.log('✅ Cancellation email sent to solicitor');
  } catch (e) { console.log('⚠️ Cancellation solicitor email failed:', e.message); }

  console.log(`🗑️ Booking cancelled: ${refClean} — slot ${booking.date} ${booking.time} now free`);
  res.json({ success: true, message: 'Booking cancelled. Slot is now available for others.' });
});

// ============================================
// API: RESCHEDULE BOOKING
// ============================================
app.post('/api/bookings/reschedule', async (req, res) => {
  const { ref, name, newDateKey, newDate, newTime } = req.body;
  const db = loadBookings();
  const refClean = (ref || '').trim().toUpperCase();
  const nameClean = (name || '').trim().toLowerCase();

  const booking = db.bookings.find(b => {
    if (b.ref !== refClean || b.status !== 'active') return false;
    if (!nameClean) return true;
    const bName = b.clientName.toLowerCase();
    return bName === nameClean || bName.includes(nameClean) || nameClean.includes(bName);
  });
  if (!booking) return res.status(404).json({ success: false, error: 'Booking not found. Check your reference number and name match exactly.' });

  // Check new slot is available
  const clash = db.bookings.find(b =>
    b.solicitorId === booking.solicitorId &&
    b.dateKey === newDateKey &&
    b.time === newTime &&
    b.status === 'active'
  );
  if (clash) return res.status(409).json({ success: false, error: 'New time slot is not available' });

  await deleteCalendarEvent(booking.calendarEventId);

  const oldDate = booking.date;
  const oldTime = booking.time;
  booking.date = newDate;
  booking.dateKey = newDateKey;
  booking.time = newTime;
  booking.rescheduledAt = new Date().toISOString();
  saveBookings(db);

  const eventId = await createCalendarEvent(booking);
  if (eventId) {
    booking.calendarEventId = eventId;
    saveBookings(db);
  }

  // Send reschedule confirmation to client
  try {
    await transporter.sendMail({
      from: `"${FIRM_NAME}" <${EMAIL_USER}>`,
      to: booking.clientEmail,
      subject: `Appointment Rescheduled — ${booking.ref} | ${FIRM_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0d6c2; border-radius: 12px; overflow: hidden;">
          <div style="background: #1a1a1a; padding: 24px; text-align: center; border-bottom: 3px solid #f9e2a8;">
            <h1 style="color: #f9e2a8; font-size: 22px; margin: 0;">${FIRM_NAME}</h1>
          </div>
          <div style="padding: 28px;">
            <p style="font-size: 16px;">Dear ${booking.clientName},</p>
            <p>Your appointment <strong style="font-family: monospace;">${booking.ref}</strong> has been <strong style="color: #2e7d52;">rescheduled</strong>.</p>
            <div style="background: #fceaea; border-radius: 8px; padding: 14px; margin: 16px 0; text-decoration: line-through; color: #999;">
              <p style="margin: 4px 0;"><strong>Previous:</strong> ${oldDate} at ${oldTime}</p>
            </div>
            <div style="background: #e8f5ee; border: 1px solid #c3e6cb; border-radius: 8px; padding: 14px; margin: 16px 0;">
              <p style="margin: 4px 0; font-size: 16px;"><strong>New Date:</strong> ${newDate}</p>
              <p style="margin: 4px 0; font-size: 16px;"><strong>New Time:</strong> ${newTime} (30 minutes)</p>
              <p style="margin: 4px 0;"><strong>Solicitor:</strong> ${booking.solicitor}</p>
              <p style="margin: 4px 0;"><strong>Case:</strong> ${booking.parentCategory} — ${booking.subcategory}</p>
            </div>
            <p style="font-size: 14px; color: #666;">${booking.consultationType === 'walk-in'
              ? 'Please arrive 5 minutes before your new appointment time. Bring photo ID.'
              : 'Your solicitor will call you on ' + booking.clientPhone + ' at the new scheduled time.'}</p>
            <p style="font-size: 14px; color: #666;">If you need further changes, visit our booking portal or call <strong>${FIRM_PHONE}</strong>.</p>
          </div>
          <div style="background: #1a1a1a; padding: 16px; text-align: center;">
            <p style="color: #f9e2a8; font-size: 13px; margin: 0;">${FIRM_NAME} | ☎ ${FIRM_PHONE}</p>
          </div>
        </div>`
    });
    console.log('✅ Reschedule email sent to client:', booking.clientEmail);
  } catch (e) { console.log('⚠️ Reschedule client email failed:', e.message); }

  // Notify solicitor of reschedule
  try {
    await transporter.sendMail({
      from: `"${FIRM_NAME}" <${EMAIL_USER}>`,
      to: SOLICITOR_EMAIL,
      subject: `📅 Appointment Rescheduled — ${booking.ref} — ${booking.clientName}`,
      text: `RESCHEDULE NOTIFICATION\n\nRef: ${booking.ref}\nClient: ${booking.clientName}\nPhone: ${booking.clientPhone}\nEmail: ${booking.clientEmail}\nCase: ${booking.parentCategory} > ${booking.subcategory}\nSolicitor: ${booking.solicitor}\n\nPrevious: ${oldDate} at ${oldTime}\nNew: ${newDate} at ${newTime}\n\nThe old slot (${oldDate} ${oldTime}) is now free for new bookings.`
    });
    console.log('✅ Reschedule email sent to solicitor');
  } catch (e) { console.log('⚠️ Reschedule solicitor email failed:', e.message); }

  console.log(`📅 Rescheduled: ${refClean} — ${oldDate} ${oldTime} → ${newDate} ${newTime}`);
  res.json({ success: true, message: 'Booking rescheduled', oldDate, oldTime, newDate: booking.date, newTime: booking.time });
});

// ============================================
// API: GET ALL BOOKINGS (Staff Dashboard)
// ============================================
app.get('/api/bookings', (req, res) => {
  const db = loadBookings();
  const { status, solicitorId, date } = req.query;
  let results = db.bookings;
  if (status) results = results.filter(b => b.status === status);
  if (solicitorId) results = results.filter(b => b.solicitorId === parseInt(solicitorId));
  if (date) results = results.filter(b => b.dateKey === date);
  res.json({ bookings: results });
});

// ============================================
// API: GET SINGLE BOOKING
// ============================================
app.get('/api/bookings/:ref', (req, res) => {
  const db = loadBookings();
  const booking = db.bookings.find(b => b.ref === req.params.ref);
  if (!booking) return res.status(404).json({ error: 'Not found' });
  res.json(booking);
});

// ============================================
// API: EXISTING CASE ENQUIRY
// ============================================
app.post('/api/enquiry', async (req, res) => {
  const { name, ref, message } = req.body;
  if (!name || !ref || !message) return res.status(400).json({ success: false, error: 'All fields required' });

  try {
    await transporter.sendMail({
      from: `"${FIRM_NAME}" <${EMAIL_USER}>`,
      to: SOLICITOR_EMAIL,
      subject: `📨 Existing Case Enquiry — ${ref} — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0d6c2; border-radius: 12px; overflow: hidden;">
          <div style="background: #1a1a1a; padding: 24px; text-align: center; border-bottom: 3px solid #f9e2a8;">
            <h1 style="color: #f9e2a8; font-size: 22px; margin: 0;">${FIRM_NAME}</h1>
            <p style="color: #ccc; font-size: 13px; margin: 6px 0 0;">Existing Case Enquiry</p>
          </div>
          <div style="padding: 28px;">
            <div style="background: #fdf6e3; border: 1px solid #f9e2a8; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <table style="width: 100%; font-size: 14px;">
                <tr><td style="padding: 6px 0; color: #999; width: 120px;">Client Name</td><td style="padding: 6px 0; font-weight: 600;">${name}</td></tr>
                <tr><td style="padding: 6px 0; color: #999;">Case Reference</td><td style="padding: 6px 0; font-weight: 600; font-family: monospace; letter-spacing: 1px;">${ref}</td></tr>
                <tr><td style="padding: 6px 0; color: #999;">Submitted</td><td style="padding: 6px 0;">${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</td></tr>
              </table>
            </div>
            <h3 style="font-size: 15px; color: #1a1a1a; margin-bottom: 8px;">Client Message:</h3>
            <div style="background: #f5f5f5; border: 1px solid #e0d6c2; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.7; color: #2c2c2c; white-space: pre-wrap;">${message}</div>
            <p style="font-size: 13px; color: #999; margin-top: 16px;">Please respond within one working day.</p>
          </div>
          <div style="background: #1a1a1a; padding: 16px; text-align: center;">
            <p style="color: #f9e2a8; font-size: 13px; margin: 0;">${FIRM_NAME} | ☎ ${FIRM_PHONE}</p>
          </div>
        </div>`
    });
    console.log('✅ Existing case enquiry emailed — Ref:', ref, '— From:', name);
    res.json({ success: true });
  } catch (e) {
    console.log('⚠️ Enquiry email failed:', e.message);
    res.status(500).json({ success: false, error: e.message });
  }
});

// Test email endpoint
app.get('/test-email', async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"${FIRM_NAME}" <${EMAIL_USER}>`,
      to: SOLICITOR_EMAIL,
      subject: 'TEST — Harris & Co Booking System',
      text: 'Email is working! Bookings will send the AI case analysis + client documents to this address.'
    });
    res.send('<h2 style="color:green">✅ Test email sent to ' + SOLICITOR_EMAIL + '</h2>');
  } catch (err) {
    res.send('<h2 style="color:red">❌ Failed</h2><pre>' + err.message + '</pre>');
  }
});

// Status endpoint
app.get('/api/status', (req, res) => {
  const db = loadBookings();
  res.json({
    totalBookings: db.bookings.length,
    activeBookings: db.bookings.filter(b => b.status === 'active').length,
    cancelledBookings: db.bookings.filter(b => b.status === 'cancelled').length,
    googleCalendar: isGoogleEnabled() ? 'connected' : 'not configured',
    email: EMAIL_USER !== 'YOUR_GMAIL@gmail.com' ? 'configured' : 'not configured'
  });
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🏛️  ${FIRM_NAME} — Booking Server`);
  console.log(`📧 http://localhost:${PORT}`);
  console.log(`📬 Solicitor emails → ${SOLICITOR_EMAIL}`);
  console.log(`📅 Google Calendar: ${GOOGLE_CLIENT_ID ? 'configured — visit /auth/google to connect' : 'not configured (optional)'}`);
  console.log(`📊 Staff dashboard: http://localhost:5173/staff\n`);
});
