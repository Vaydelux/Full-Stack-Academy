# Standalone App Router example (source fixture)

This directory contains illustrative Next.js 16 App Router files, not a separate installable Next.js package.
Copy `app/` into a fresh local Next.js 16 project with a valid `package-lock.json` to run the framework build.
The academy's offline Node test checks the canonical product model; it does not compile this folder as a separate app, run a server, verify HTTP codes, or execute streaming boundaries.
Use `npm ci && npm run build` in the dedicated sample project, then request `/products/starter-kit` and `/products/invalid` locally and confirm valid metadata, accessible navigation, and 404.
No external API, credentials or hosted deployment is required.
