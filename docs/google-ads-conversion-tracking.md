# Google Ads conversion tracking for DosCode landing

The landing page has Google Ads tracking hooks, but they stay disabled until these Vite env vars are present at build time:

```env
VITE_GOOGLE_ADS_ID=AW-XXXXXXXXXX
VITE_GOOGLE_ADS_TELEGRAM_CLICK_LABEL=conversion_label_for_telegram_click
```

What it tracks:

- Loads the Google tag (`gtag.js`) when `VITE_GOOGLE_ADS_ID` exists.
- Sends a Google Ads `conversion` event when a visitor clicks any link to `https://t.me/doscode_bot`.

Recommended Google Ads conversion actions:

1. `DosCode - Telegram CTA click`
   - Source: Website
   - Category: Lead
   - Count: One
   - Used for landing page optimization

2. `DosCode - Bot lead submitted`
   - Source: Import / server-side or webhook later
   - Category: Qualified lead
   - Count: One
   - Triggered by the Telegram bot when a lead submits the brief

Important:

- The landing conversion measures intent to contact.
- The bot conversion measures actual brief submission.
- The bot-side conversion is best-effort until proper Google Ads API/offline conversion credentials are added.
