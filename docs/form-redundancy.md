# Enquiry delivery and recovery

Applies to ISoc, mosque and organisation enquiries.

## Implemented routes

1. The server tries FormSubmit for up to six seconds, and checks its JSON acceptance response.
2. If that fails, it tries Resend for up to six seconds, when configured. The enquiry goes to purestreets0@gmail.com with the existing visitor CC and Reply-To behaviour.
3. The existing Slack notification runs independently with a six-second limit. It is an operational backup copy, not proof that email was delivered.
4. If the website API fails, the browser tries FormSubmit directly for up to eight seconds. This handles unavailable server functions; it does not provide independence from a FormSubmit outage.
5. If automatic sending fails, the visitor stays on the page with their form intact, a prefilled email link and a selectable copy of the enquiry. Opening the email app does not count as sending. No enquiry is stored in browser persistent storage.

Provider acceptance is not proof of inbox delivery. A timed-out request might still have been accepted, so failover or manual retry can produce duplicates. This implementation has no durable queue or automatic background retries.

## Enable the independent email backup

Use a host that runs the existing CommonJS `/api/group-enquiry` and `/api/mosque-enquiry` server functions with Node 20+ and a function timeout of at least 15 seconds. Static hosting alone cannot run these functions.

Configure these secrets in the hosting dashboard, never in HTML or browser JavaScript:

- `RESEND_API_KEY`: a Resend sending API key.
- `ENQUIRY_EMAIL_FROM`: a sender address on a domain verified in Resend.
- `SLACK_WEBHOOK_URL`: the existing optional channel webhook, if a monitored Slack copy is wanted.

Redeploy after setting the variables. Resend setup: https://resend.com/docs/api-reference/emails/send-email

## Verification and outage procedure

- Run `node tests/enquiry-email.test.js` for mocked failover checks; these do not send messages.
- In staging, submit one clearly labelled test from each form, using an inbox you control. Confirm the team email and visitor copy actually arrive.
- Simulate FormSubmit failure in staging and verify Resend acceptance and inbox receipt. Also simulate both providers failing and confirm the form remains populated and the manual email/copy options appear.
- Monitor HTTP 502 responses from both API routes and provider delivery/bounce logs. Monitoring infrastructure is not installed by this change.
- During an outage, monitor the configured Slack channel, reconcile enquiries against received emails, and use direct email for urgent enquiries. Do not assume a failed request was queued.
- If longer outages must be handled without visitor intervention, the next step is a durable database/outbox with submission IDs, background retries, deduplication and an agreed retention period. This requires a provisioned database and worker; it is not enabled here.

## Rollback

Remove the Resend environment variables to disable the independent provider. Browser recovery remains available. Revert the code changes to restore the previous submission flow.
