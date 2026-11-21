# Vercel deployment freeze and source-only merge

**Repository:** `Vaydelux/Full-Stack-Academy`  
**Linked Vercel project:** `fullstack-academy`  
**Purpose:** Keep this GitHub source-only curriculum merge from deploying the application.

## Controls

1. The linked Vercel project's **Ignored Build Step** is set to `exit 0` (the zero exit code means skip the build). This setting was requested before the source merge; no deployment was requested.
2. Root `vercel.json` explicitly configures `git.deploymentEnabled: false`. This is the platform-documented way to disable Git-triggered Vercel deployments without relying only on the project's build command.
3. `.github/workflows/academy-quality.yml` now runs only via `workflow_dispatch`, not a push or pull-request event. No hosted CI is run automatically on merge.
4. `npm run test:vercel-freeze` verifies these source boundaries. `npm run verify:offline` runs the check as part of the local release gate.

**Scope:** These controls affect automatic Git builds for this repository. They do not protect against someone explicitly calling Vercel's CLI, API, deployment hook, or integrations. No project was paused or deleted; existing successful deployments, if any, are not deleted by source configuration.

## Source-only merge is not lesson publication

Both forms modules remain candidates; main's counted lessons stay **338/889**. Do not modify `src/content/lessons/09.02.*` or `09.03.*` and their published registries until real Node24, Next, Chromium, and human screen-reader/keyboard/zoom acceptance has succeeded. The guarded release scripts are not invoked by merging this PR.

## Resume deployments intentionally

To resume Git auto-deployment, the owner must explicitly:

1. Review the then-current code and pass the genuine local release gates.
2. Remove or switch the `git.deploymentEnabled: false` freeze in `vercel.json`, and restore the linked project's Ignored Build Step from `exit 0` to its intended configuration.
3. Restore automatic GitHub Actions triggers separately **only if desired**. When changing the deployment freeze, update/remove its `test:vercel-freeze` enforcement in the same reviewed change.
4. Choose the correct production branch/environment and deliberately allow a new deployment.

Never treat a successful merge as an application deployment or as evidence that P1 topics are ready to publish.
