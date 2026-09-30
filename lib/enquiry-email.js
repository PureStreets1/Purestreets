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

  const formId = process.env.FORMINIT_FORM_ID;
  const apiKey = process.env.FORMINIT_API_KEY;
  if (!formId) throw new Error('Forminit backup is not configured');

  const contactEmail = params.get('email');
  const response = await fetch(`https://forminit.com/f/${encodeURIComponent(formId)}`, {
    method: 'POST',
    signal: AbortSignal.timeout(6000),
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(apiKey ? { 'X-API-KEY': apiKey } : {}) },
    body: JSON.stringify({
      blocks: [
        ...(contactEmail ? [{ type: 'sender', properties: { email: contactEmail } }] : []),
        { type: 'text', name: 'subject', value: params.get('_subject') },
        { type: 'text', name: 'message', value: params.get('message') }
      ]
    })
  });
  const result = await response.json();
  if (!response.ok || result.success !== true || !result.submission?.hashId) throw new Error('Forminit did not accept the enquiry');
  return { ok: true, provider: 'forminit' };
}

module.exports = { sendEnquiryEmail };
