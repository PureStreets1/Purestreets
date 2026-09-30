# Form delivery decision

Use FormSubmit first and an optional Resend backup (`lib/enquiry-email.js`), preserving recipient and visitor copy behaviour. Keep existing Slack notifications independent. Use same-page browser submission and a manual email/copy recovery panel (`script.js`).

Repeating a redirect to FormSubmit cannot cover its outage. A durable outbox provides stronger guarantees but needs a database, worker and retention policy absent from this repository. The chosen approach provides immediate manual recovery without new runtime dependencies, and automatic independent email once credentials are configured.

Configuration, verification, limitations and rollback are documented in `docs/form-redundancy.md`.

## Three-layer update
At the user's request, replace the Resend backup with Forminit and preserve the order FormSubmit, Forminit, direct email. Use explicit server exhaustion responses to avoid retrying both providers after known failures. Add the same order for static-host browser delivery. Forminit account setup is still required; see docs/form-redundancy.md.
