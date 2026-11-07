# Acharya Deepak

This repository contains the React, TypeScript, and Vite website. GitHub Actions deploys the static site to GitHub Pages when changes are pushed to `main`; the gallery is published at `/gallery/`.

## Booking email

The booking form sends submissions through a Cloudflare Worker and Gmail SMTP over STARTTLS. SMTP credentials are stored as Cloudflare Worker secrets and are not included in the site bundle.

1. Revoke and change any mailbox password that has been shared in chat, logs, or source code. Do not reuse it for this integration. For Gmail SMTP, create a Google App Password (requires 2-Step Verification); a normal account password will not work.
2. Log in to Cloudflare and set the SMTP username and App Password as Worker secrets (Wrangler prompts for each value):

   ```powershell
   npx wrangler secret put SMTP_USER --config worker/wrangler.jsonc
   npx wrangler secret put SMTP_PASSWORD --config worker/wrangler.jsonc
   ```

   Use `aacharyaadeepak@gmail.com` for `SMTP_USER` and the newly generated App Password for `SMTP_PASSWORD`. Never put either credential in source control or the GitHub Pages build.
3. `worker/wrangler.jsonc` configures Gmail SMTP at `smtp.gmail.com:587`. To use another SMTP service, change `SMTP_HOST`/`SMTP_PORT` and provide that service's SMTP username and password as secrets.
4. Set `ALLOWED_ORIGIN` in `worker/wrangler.jsonc` to the exact origin serving the site, then deploy the Worker:

   ```powershell
   npx wrangler deploy --config worker/wrangler.jsonc
   ```

   CORS is not an abuse-prevention mechanism; before publishing, add a Cloudflare rate-limit rule for the Worker endpoint.
5. In GitHub repository **Settings → Secrets and variables → Actions → Variables**, add `BOOKING_API_URL` with the deployed Worker URL. The Pages workflow passes it to Vite as `VITE_BOOKING_API_URL`; rerun the workflow to publish the configured form.

The Worker sends to `aacharyaadeepak@gmail.com` and CCs `uniyaldeepak831@gmail.com`. It uses the authenticated SMTP address as the sender with the display name “Deepak Uniyal (Aacharya Deepak)”. Gmail does not permit an arbitrary no-reply sender address; a true no-reply address must be configured as an authorized Gmail alias or use an authenticated domain mail provider.
