// Run with: node tests/enquiry-email.test.js (no dependencies, no real emails).
async function runTests(source) {
  let passed = 0;
  const cases = [
    { name: 'primary accepted', primary: { success: true }, calls: 1, ok: true },
    { name: 'primary string success accepted', primary: { success: 'true' }, calls: 1, ok: true },
    { name: '522 uses backup', status: 522, primary: {}, calls: 2, ok: true },
    { name: 'HTTP 200 rejection uses backup', primary: { success: false }, calls: 2, ok: true },
    { name: 'invalid JSON uses backup', invalidJson: true, calls: 2, ok: true },
    { name: 'network timeout uses backup', timeout: true, calls: 2, ok: true },
    { name: 'missing credentials fails honestly', primary: {}, unconfigured: true, calls: 1, ok: false },
    { name: 'backup rejection fails honestly', primary: {}, backupStatus: 401, calls: 2, ok: false },
    { name: 'backup without receipt fails honestly', primary: {}, backupBody: {}, calls: 2, ok: false }
  ];
  function check(value, message) { if (!value) throw new Error(message); }
  for (const test of cases) {
    const calls = [];
    const fakeFetch = async (url, options) => {
      calls.push({ url, options });
      check(options.signal === 6000, `${test.name}: missing timeout`);
      if (calls.length === 1) {
        if (test.timeout) throw new Error('timeout');
        return {
          ok: !test.status,
          json: async () => {
            if (test.invalidJson) throw new Error('invalid JSON');
            return test.primary;
          }
        };
      }
      check(url === 'https://api.resend.com/emails', 'Wrong backup endpoint');
      const body = JSON.parse(options.body);
      check(body.to[0] === 'purestreets0@gmail.com', 'Recipient changed');
      check(body.reply_to === 'visitor@example.com' && body.cc[0] === 'visitor@example.com', 'Missing reply/copy');
      check(body.text === 'Test enquiry' && body.subject === 'Test subject', 'Lost enquiry content');
      return { ok: !test.backupStatus, json: async () => test.backupBody || { id: 'test-receipt' } };
    };
    const mod = { exports: {} };
    new Function('fetch', 'process', 'AbortSignal', 'module', 'console', source)(
      fakeFetch,
      { env: test.unconfigured ? {} : { RESEND_API_KEY: 'test-key', ENQUIRY_EMAIL_FROM: 'test@example.com' } },
      { timeout: (ms) => ms }, mod, { error() {} }
    );
    let ok = false;
    try {
      const result = await mod.exports.sendEnquiryEmail(new URLSearchParams({
        _subject: 'Test subject', message: 'Test enquiry', email: 'visitor@example.com'
      }));
      ok = result.ok;
    } catch (error) { /* Expected when both routes fail. */ }
    check(ok === test.ok && calls.length === test.calls, `${test.name} failed`);
    passed++;
  }
  return `${passed} email failover tests passed`;
}

module.exports = runTests;
if (require.main === module) {
  runTests(require('node:fs').readFileSync(require('node:path').join(__dirname, '../lib/enquiry-email.js'), 'utf8'))
    .then(console.log).catch((error) => { console.error(error); process.exitCode = 1; });
}
