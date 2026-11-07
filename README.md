# Acharya Deepak

This repository contains the React, TypeScript, and Vite website. GitHub Actions deploys the static site to GitHub Pages when changes are pushed to `main`; the gallery is published at `/gallery/`.

## Booking email

The booking form sends requests to a Google Apps Script web app. Apps Script sends the email using Google's mail service; it does not connect to Gmail SMTP directly. This avoids Cloudflare and keeps email credentials out of the public website.

1. Sign in to Google as `aacharyaadeepak@gmail.com` and open [Google Apps Script](https://script.google.com/).
2. Create a project and copy the contents of [`apps-script/Code.gs`](./apps-script/Code.gs) into its script editor. Save the project.
3. Select **Deploy → New deployment → Web app**. Set **Execute as** to **Me** and **Who has access** to **Anyone**, then deploy and authorize the requested Gmail permission. Copy the web app URL ending in `/exec`.
4. In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables** and set the repository variable `BOOKING_API_URL` to that `/exec` URL. Do not use the GitHub Pages URL or add `/.workers.dev`.
5. Push the workflow changes or manually rerun the GitHub Pages workflow to build and publish the site with the Apps Script endpoint.

Apps Script sends from the account that owns the deployment to `aacharyaadeepak@gmail.com`, CCs `uniyaldeepak831@gmail.com`, and sets Reply-To to the submitter's email. The browser cannot read Apps Script's cross-origin response, so the form can report that it submitted the request but cannot confirm mail delivery.
