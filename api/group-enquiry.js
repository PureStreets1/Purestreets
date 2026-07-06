const EMAIL_ENDPOINT = 'https://formsubmit.co/ajax/purestreets0@gmail.com';

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

function normaliseList(value) {
  if (Array.isArray(value)) {
    return value.map(cleanText).filter(Boolean);
  }

  const single = cleanText(value);
  return single ? [single] : [];
}

function validatePayload(payload) {
  const groupType = cleanText(payload.groupType);
  const organisationName = cleanText(payload.organisationName);
  const location = cleanText(payload.location);
  const contactName = cleanText(payload.contactName);
  const phoneNumber = cleanText(payload.phoneNumber);
  const pickFrequency = cleanText(payload.pickFrequency);
  const additionalDetails = cleanText(payload.additionalDetails);
  const supportRequested = normaliseList(payload.supportRequested);
  const primaryName = organisationName || location;
  const phoneIsValid = /^[+()0-9\s-]{7,20}$/.test(phoneNumber);
  const missingRequiredField = !groupType || !primaryName || !supportRequested.length || !pickFrequency || !contactName || !phoneNumber;

  return {
    isValid: Boolean(!missingRequiredField && phoneIsValid),
    data: {
      groupType,
      organisationName,
      location,
      contactName,
      phoneNumber,
      pickFrequency,
      additionalDetails,
      supportRequested,
      submittedFrom: cleanText(payload.submittedFrom) || `${groupType} page`
    },
    error: missingRequiredField ? 'Missing required fields.' : 'Invalid phone number.'
  };
}

function buildMessage(data) {
  return [
    `New ${data.groupType} Enquiry`,
    '',
    `Type: ${data.groupType}`,
    `Organisation/name: ${data.organisationName || 'Not provided'}`,
    `Location: ${data.location || 'Not provided'}`,
    `Support requested: ${data.supportRequested.join(', ')}`,
    `Frequency/timeline: ${data.pickFrequency || 'Not provided'}`,
    `Additional details: ${data.additionalDetails || 'None provided'}`,
    `Contact name: ${data.contactName || 'Not provided'}`,
    `Mobile: ${data.phoneNumber || 'Not provided'}`,
    '',
    `Submitted from: ${data.submittedFrom}`
  ].join('\n');
}

async function sendSlackNotification(text) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('Group enquiry Slack notification skipped: SLACK_WEBHOOK_URL is not set.');
    return { ok: false, skipped: true };
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const body = await response.text().catch(() => '');

  if (!response.ok) {
    throw new Error(`Slack webhook failed with ${response.status}: ${body}`);
  }

  return { ok: true, status: response.status };
}

async function sendEmailNotification(text, groupType) {
  const params = new URLSearchParams({
    _subject: `New ${groupType} enquiry`,
    _template: 'table',
    _captcha: 'false',
    message: text
  });

  const response = await fetch(EMAIL_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Email notification failed with ${response.status}: ${detail}`);
  }

  return { ok: true };
}

module.exports = async function groupEnquiry(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { ok: false, error: 'Method not allowed.' });
  }

  try {
    const payload = await readRequestBody(req);
    const { isValid, data, error } = validatePayload(payload);

    if (!isValid) {
      console.error('Group enquiry validation failed:', error);
      return sendJson(res, 400, { ok: false, error });
    }

    const message = buildMessage(data);
    const [slackResult, emailResult] = await Promise.allSettled([
      sendSlackNotification(message),
      sendEmailNotification(message, data.groupType)
    ]);

    if (slackResult.status === 'rejected') {
      console.error('Group enquiry Slack notification failed:', slackResult.reason);
    } else {
      console.log('Group enquiry Slack notification result:', slackResult.value);
    }

    if (emailResult.status === 'rejected') {
      console.error('Group enquiry email notification failed:', emailResult.reason);
    } else {
      console.log('Group enquiry email notification sent.');
    }

    return sendJson(res, 200, {
      ok: true,
      slackOk: slackResult.status === 'fulfilled' && slackResult.value?.ok === true,
      emailOk: emailResult.status === 'fulfilled'
    });
  } catch (error) {
    console.error('Group enquiry API error:', error);
    return sendJson(res, 500, { ok: false, error: 'Unable to process group enquiry.' });
  }
};
