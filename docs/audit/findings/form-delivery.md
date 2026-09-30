# Form delivery resilience

The user reported a FormSubmit 522 error on 30 September 2026. Both `api/group-enquiry.js` and `api/mosque-enquiry.js` depended on this same provider without timeouts. `script.js` redirected to the same provider after failure and marked that navigation as successful before receipt. The previous turn corrected permissive JSON handling.

Fix: use a configurable independent server email provider, bound outbound request times, and retain the form with manual recovery when automatic delivery fails. Verify using mocked provider failures without sending real messages.
