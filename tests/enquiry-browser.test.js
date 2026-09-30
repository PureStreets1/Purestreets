// Run with: node tests/enquiry-browser.test.js. All requests and DOM nodes are mocked.
async function runTests(source) {
  const helpers = source.slice(source.indexOf('async function submitEnquiryDelivery('), source.indexOf('function initGroupCarouselForms()'));
  function element(tag) {
    return { tag, dataset: {}, children: [], setAttribute() {}, append(...nodes) { this.children.push(...nodes); } };
  }
  const cases = [
    { name: 'server success stops', api: { ok: true, emailOk: true }, calls: 1, sent: true },
    { name: 'server backup explains missing receipt', api: { ok: true, emailOk: true, provider: 'forminit' }, calls: 1, sent: true, receiptNotice: true },
    { name: 'known exhaustion goes directly to email', api: { deliveryAttempted: true }, status: 502, calls: 1 },
    { name: 'primary browser success stops', primary: true, calls: 2, sent: true },
    { name: 'browser backup succeeds', backup: true, calls: 3, sent: true },
    { name: 'both fail shows direct email', calls: 3 },
    { name: 'timeout reaches backup', timeout: true, backup: true, calls: 3, sent: true },
    { name: 'unconfigured backup shows direct email', unconfigured: true, calls: 2 },
    { name: 'invalid API JSON reaches browser', invalidApi: true, backup: true, calls: 3, sent: true }
  ];
  for (const test of cases) {
    const calls = [];
    const form = element('form');
    form.action = '/api/group-enquiry';
    form.dataset = { emailFallback: 'https://formsubmit.co/ajax/test', forminitId: test.unconfigured ? '' : 'test-form' };
    const confirmation = element('p');
    confirmation.textContent = 'Original confirmation';
    form.querySelector = (selector) => selector.includes('data-mosque-success') ? confirmation : null;
    const fakeFetch = async (url, options) => {
      calls.push(url);
      if (calls.length === 1) return {
        ok: !test.status, status: test.status || 200,
        json: async () => { if (test.invalidApi) throw new Error('invalid JSON'); return test.api || {}; }
      };
      if (calls.length === 2) {
        if (url !== form.dataset.emailFallback) throw new Error('Primary order incorrect');
        if (test.timeout) throw new Error('timeout');
        return { ok: true, json: async () => ({ success: !!test.primary }) };
      }
      if (url !== 'https://forminit.com/f/test-form') throw new Error('Backup order incorrect');
      const blocks = JSON.parse(options.body).blocks;
      if (blocks[2].value !== 'Test details') throw new Error('Lost enquiry');
      return { ok: true, json: async () => ({ success: !!test.backup, submission: { hashId: 'receipt' } }) };
    };
    const submit = new Function('fetch', 'AbortSignal', 'document', 'window', `${helpers}; return submitEnquiryDelivery;`)(
      fakeFetch, { timeout: () => null }, { createElement: element },
      { location: { origin: 'https://purestreets.org', pathname: '/organisation.html' } }
    );
    const data = new URLSearchParams({ email: 'test@example.com', _subject: 'Test', message: 'Test details' });
    const sent = await submit(form, {}, data);
    if (sent !== !!test.sent || calls.length !== test.calls) throw new Error(`${test.name} failed`);
    if (sent && (test.backup || test.receiptNotice)) {
      if (!confirmation.textContent.includes('will not receive an email receipt') || !confirmation.textContent.includes('within 3 days') || confirmation.children[0]?.href !== 'mailto:purestreets0@gmail.com') {
        throw new Error(`${test.name}: backup receipt message missing`);
      }
    } else if (confirmation.textContent !== 'Original confirmation') throw new Error('Primary confirmation changed');
    if (!sent) {
      const panel = form.children[0];
      if (!panel || !panel.children[1].href.startsWith('mailto:purestreets0@gmail.com?') || panel.children[2].children[0].value !== 'Test details') {
        throw new Error(`${test.name}: recovery missing`);
      }
    } else if (form.children.length) throw new Error('Recovery displayed after success');
  }
  return `${cases.length} browser delivery tests passed`;
}
module.exports = runTests;
if (require.main === module) {
  runTests(require('node:fs').readFileSync(require('node:path').join(__dirname, '../script.js'), 'utf8'))
    .then(console.log).catch((error) => { console.error(error); process.exitCode = 1; });
}
