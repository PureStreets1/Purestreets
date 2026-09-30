// Server-only: never expose provider credentials in browser code.
async function sendEnquiryEmail(params) {
  try {
    const response = await fetch('https://formsubmit.co/ajax/purestreets0@gmail.com', {
      method: 'POST',
      signal: AbortSignal.timeout(6000),
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    const result = await response.json();
    if (!response.ok || (result.success !== true && result.success !== 'true')) {
      throw new Error('FormSubmit rejected the request');
    }
    return { ok: true, provider: 'formsubmit' };
  } catch (error) {
    console.error('FormSubmit unavailable; attempting backup email.');
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_EMAIL_FROM;
  if (!apiKey || !from) throw new Error('Backup email is not configured');

  const contactEmail = params.get('email');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    signal: AbortSignal.timeout(6000),
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: ['purestreets0@gmail.com'],
      ...(contactEmail ? { reply_to: contactEmail, cc: [contactEmail] } : {}),
      subject: params.get('_subject'),
      text: params.get('message')
    })
  });
  const result = await response.json();
  if (!response.ok || !result.id) throw new Error('Backup email was not accepted');
  return { ok: true, provider: 'resend' };
}

module.exports = { sendEnquiryEmail };
