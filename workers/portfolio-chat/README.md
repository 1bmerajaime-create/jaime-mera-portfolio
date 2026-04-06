# Portfolio chat (Cloudflare Worker + Anthropic)

Proxies chat to the Anthropic Messages API with lightweight retrieval from bundled portfolio chunks (no vector DB).

## Setup

1. `cd workers/portfolio-chat && npm install`
2. `npx wrangler login`
3. `npx wrangler secret put ANTHROPIC_API_KEY` — paste your [Anthropic API key](https://console.anthropic.com/).
4. In `wrangler.toml`, set `ALLOWED_ORIGINS` to a comma-separated list of **exact** origins that may call the Worker (e.g. `https://yourdomain.com,http://127.0.0.1:8765`). No trailing slashes.
5. Optional: change `ANTHROPIC_MODEL` in `wrangler.toml` or in the Cloudflare dashboard (e.g. `claude-sonnet-4-20250514` if your key supports it).
6. `npm run deploy`

The chat endpoint is:

`https://<worker-name>.<your-subdomain>.workers.dev/chat`

Use the full URL including `/chat` in the site config.

## Connect the static site

Either set a global before `search.js`:

```html
<script>
  window.PORTFOLIO_CHAT_API_URL = "https://YOUR_WORKER.workers.dev/chat";
</script>
```

Or add a meta tag:

```html
<meta
  name="portfolio-chat-api"
  content="https://YOUR_WORKER.workers.dev/chat"
/>
```

If neither is set, the site keeps using the built-in rule-based chat only.

## Updating facts the model may use

Edit `src/corpus.ts` so chunks stay aligned with `search-data.js` on the site, then redeploy.

## Privacy

End-user messages are sent to Anthropic under their [terms](https://www.anthropic.com/legal). Add a short note on your site if you need a privacy disclaimer.
