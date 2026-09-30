# Three-layer enquiry delivery

All three forms (ISoc, mosque and organisation) use this order:

1. **FormSubmit**: try for up to six seconds; require an explicit success response.
2. **Forminit**: try for up to six seconds if FormSubmit fails; require a successful submission receipt.
3. **Direct email**: show purestreets0@gmail.com, a prefilled email link and selectable enquiry details. Keep the form populated. Opening the email app does not count as sending.

Resend has been replaced by Forminit. Existing Slack notifications remain independent operational copies, not a condition for form success.

The server handles the first two layers when available. If it reports both failed, the browser goes straight to direct email without repeating them. If the API itself is unreachable, the browser can run the same provider order using a public Forminit form ID. An unknown timeout can still cause duplicates; there is no durable queue or automatic background retry.

## Activate Forminit (required)

No Forminit account or form ID was supplied, so layer two is prepared but inactive.

1. Create an account and form at https://forminit.com/ . One form can receive all three enquiry types; the submitted subject and message identify the type.
2. In that form's **Settings → Actions**, enable **Email notifications** and set the recipient to **purestreets0@gmail.com**. Keep the subject and message blocks visible in the notification. Set Reply-to to the sender email using the variable picker.
3. Copy the form ID from `https://forminit.com/f/FORM_ID`.
4. For the server routes, set `FORMINIT_FORM_ID` in the hosting dashboard. For a protected form, also set the secret `FORMINIT_API_KEY` there. Never put API keys in HTML or browser JavaScript.
5. To support static hosting or an unavailable API, use a public form and fill `data-forminit-id=""` on the form in `isocs.html`, `mosques.html` and `organisation.html` with that same ID. Public form IDs are not secret. Protected forms cannot be submitted directly from this browser fallback.
6. Redeploy, submit a labelled test and verify both the Forminit dashboard entry and the notification in the team inbox. Do not assume the email action is enabled merely because Forminit accepted the submission.

Official setup: https://forminit.com/docs/html/
API contract: https://forminit.com/docs/submit-form-api/
Notifications: https://forminit.com/docs/email-notifications/

FormSubmit retains its existing visitor CC. Forminit visitor receipts require a separately configured autoresponder, currently documented as a Business-plan feature: https://forminit.com/docs/autoresponder/ . The site no longer promises that a visitor copy has already been emailed.

## Hosting and verification

Server routes require Node 20+ and a function timeout of at least 15 seconds. Static hosting alone cannot execute the `/api` files; configure the public browser form ID for that case. The optional `SLACK_WEBHOOK_URL` remains server-only. Resend credentials are no longer used.

Run `node tests/enquiry-email.test.js` and `node tests/enquiry-browser.test.js` for mocked provider-order and recovery checks. No real messages are sent by these tests.

In staging, test normal success, FormSubmit failure with Forminit success, both providers failing, and unavailable API routes. Verify recovery preserves details and does not show success. Check actual inbox receipt for all three form types after configuration.

Provider acceptance does not prove inbox delivery. Monitor provider notifications and API errors; monitor Slack when configured. During an outage, use the direct email option. A durable database/outbox, background worker, deduplication and retention policy are future work, not installed by this change.

## Rollback

Revert this change to restore the prior Resend integration. Clearing `FORMINIT_FORM_ID` and the public form IDs disables layer two; layers one and three still operate.