const { sendEnquiryEmail } = require('../lib/enquiry-email');

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function readRequestBody(req) {
  if (req.body) {
    return Promise.resolve(typeof req.body === 'string' ? JSON.parse(req.body) : req.body);
  }

  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function cleanText(value) {
  return String(value || '').trim();
}

function normaliseSupport(value) {
  if (Array.isArray(value)) {
    return value.map(cleanText).filter(Boolean);
  }

  const single = cleanText(value);
  return single ? [single] : [];
}

function validatePayload(payload) {
  const mosqueName = cleanText(payload.mosqueName);
  const mosqueAddress = cleanText(payload.mosqueAddress);
  const contactName = cleanText(payload.contactName);
  const contactEmail = cleanText(payload.contactEmail);
  const phoneNumber = cleanText(payload.phoneNumber);
  const pickFrequency = cleanText(payload.pickFrequency);
  const additionalDetails = cleanText(payload.additionalDetails);
  const supportRequested = normaliseSupport(payload.supportRequested);
  const missingRequiredField = !mosqueName || !supportRequested.length || !pickFrequency || !contactName || !contactEmail || !phoneNumber;
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);
  const phoneIsValid = /^[+()0-9\s-]{7,20}$/.test(phoneNumber);

  return {
    isValid: Boolean(!missingRequiredField && emailIsValid && phoneIsValid),
    data: { mosqueName, mosqueAddress, contactName, contactEmail, phoneNumber, pickFrequency, additionalDetails, supportRequested },
    error: missingRequiredField ? 'Missing required fields.' : emailIsValid ? 'Invalid phone number.' : 'Invalid email address.'
  };
}

function buildMessage(data) {
  return [
    '\u{1F54C} New Mosque Enquiry',
    '',
    `Mosque: ${data.mosqueName}`,
    `Address: ${data.mosqueAddress || 'Not selected'}`,
    `Support requested: ${data.supportRequested.join(', ')}`,
    `Contact name: ${data.contactName || 'Not provided'}`,
    `Email: ${data.contactEmail || 'Not provided'}`,
    `Mobile: ${data.phoneNumber || 'Not provided'}`,
    `Long-term pick frequency: ${data.pickFrequency || 'Not provided'}`,
    `Additional details: ${data.additionalDetails || 'None provided'}`,
    '',
    'Submitted from: Mosque page'
  ].join('\n');
}

function getSlackWebhookDiagnostics(webhookUrl) {
  if (!webhookUrl) {
    return { exists: false };
  }

  try {
    const parsedUrl = new URL(webhookUrl);
    return {
      exists: true,
      host: parsedUrl.host,
      pathnameSegments: parsedUrl.pathname.split('/').filter(Boolean).length,
      length: webhookUrl.length
    };
  } catch (error) {
    return {
      exists: true,
      invalidUrl: true,
      length: webhookUrl.length
    };
  }
}

async function sendSlackNotification(text) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  const diagnostics = getSlackWebhookDiagnostics(webhookUrl);

  console.log('Mosque enquiry Slack env check:', diagnostics);

  if (!webhookUrl) {
    console.error('Mosque enquiry Slack notification skipped: SLACK_WEBHOOK_URL is not set.');
    return { ok: false, skipped: true };
  }

  const payload = { text };
  console.log('Mosque enquiry Slack fetch called:', {
    method: 'POST',
    contentType: 'application/json',
    payloadHasText: typeof payload.text === 'string' && payload.text.length > 0
  });

  const response = await fetch(webhookUrl, {
    signal: AbortSignal.timeout(6000),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const responseBody = await response.text().catch((error) => `Unable to read Slack response body: ${error?.message || error}`);

  console.log('Mosque enquiry Slack response status:', response.status);
  console.log('Mosque enquiry Slack response body:', responseBody);

  if (!response.ok) {
    throw new Error(`Slack webhook failed with ${response.status}: ${responseBody}`);
  }

  return { ok: true, status: response.status, body: responseBody };
}

async function sendEmailNotification(text, contactEmail) {
  const params = new URLSearchParams({
    _subject: 'New mosque support pack request',
    _template: 'table',
    _captcha: 'false',
    _url: 'https://purestreets.org/mosques.html',
    message: text
  });

  if (contactEmail) {
    params.set('email', contactEmail);
    params.set('_replyto', contactEmail);
    params.set('_cc', contactEmail);
  }

  return sendEnquiryEmail(params);
}

module.exports = async function mosqueEnquiry(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { ok: false, error: 'Method not allowed.' });
  }

  try {
    const payload = await readRequestBody(req);
    const { isValid, data, error } = validatePayload(payload);

    if (!isValid) {
      console.error('Mosque enquiry validation failed:', error);
      return sendJson(res, 400, { ok: false, error });
    }

    const message = buildMessage(data);
    const [slackResult, emailResult] = await Promise.allSettled([
      sendSlackNotification(message),
      sendEmailNotification(message, data.contactEmail)
    ]);

    if (slackResult.status === 'rejected') {
      console.error('Mosque enquiry Slack notification failed:', slackResult.reason);
    } else {
      console.log('Mosque enquiry Slack notification result:', slackResult.value);
    }

    if (emailResult.status === 'rejected') {
      console.error('Mosque enquiry email notification failed:', emailResult.reason);
    } else {
      console.log('Mosque enquiry email notification sent.');
    }

    const slackOk = slackResult.status === 'fulfilled' && slackResult.value?.ok === true;
    const emailOk = emailResult.status === 'fulfilled';

    if (!emailOk) {
      return sendJson(res, 502, {
        ok: false,
        error: 'Email notification failed.',
        slackOk,
        emailOk
      });
    }

    return sendJson(res, 200, {
      ok: true,
      slackOk,
      emailOk
    });
  } catch (error) {
    console.error('Mosque enquiry API error:', error);
    return sendJson(res, 500, { ok: false, error: 'Unable to process mosque enquiry.' });
  }
};
