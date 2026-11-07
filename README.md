# Acharya Deepak

This repository contains the React, TypeScript, and Vite website. GitHub Actions deploys the static site to GitHub Pages when changes are pushed to `main`; the gallery is published at `/gallery/`.

## Booking email

The booking form sends requests to a Google Apps Script web app. Apps Script sends the email using Google's mail service; it does not connect to Gmail SMTP directly. This avoids Cloudflare and keeps email credentials out of the public website.

1. Sign in to Google as `aacharyaadeepak@gmail.com` and open [Google Apps Script](https://script.google.com/).
2. Create a project and copy the contents of [`apps-script/Code.gs`](./apps-script/Code.gs) into its script editor. Save the project.
3. Select **Deploy → New deployment → Web app**. Set **Execute as** to **Me** and **Who has access** to **Anyone**, then deploy and authorize the requested Gmail permission. Copy the web app URL ending in `/exec`.
4. In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables** and set the repository variable `BOOKING_API_URL` to that `/exec` URL. Do not use the GitHub Pages URL or add `/.workers.dev`.
5. Push the workflow changes or manually rerun the GitHub Pages workflow to build and publish the site with the Apps Script endpoint.

Apps Script sends from `aacharyaadeepak@gmail.com` to `uniyaldeepak831@gmail.com` and `rkmrs.08@gmail.com`. Deploy the web app while signed in as `aacharyaadeepak@gmail.com`; the script checks the effective deployment account before sending. The form does not ask for an email address. After updating `Code.gs`, publish a new Apps Script version (**Deploy → Manage deployments → Edit → New version → Deploy**) and redeploy the GitHub Pages site. The browser cannot read Apps Script's cross-origin response, so it can report submission but cannot confirm mail delivery.
