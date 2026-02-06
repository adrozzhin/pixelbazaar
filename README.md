# Pixelbazaar (Portfolio Demo)

Pixelbazaar is a portfolio/demo storefront UI built with Next.js.

## Important: not a real store

- This project is **not** intended to sell anything.
- Checkout is enabled, but it uses **Stripe test mode (sandbox)**.
- The UI, cart, and pricing are for demonstration only.

## Run locally

```bash
npm install
npm run dev
```

## Environment variables

App base URL:

- `NEXT_PUBLIC_BASE_URL` (e.g. `http://localhost:3000`)

## Safety guard

This demo blocks live Stripe keys (`sk_live_...`) at runtime to avoid accidental real charges.

## Notes

If you deploy this, keep the demo disclaimer visible and avoid using live Stripe keys.
