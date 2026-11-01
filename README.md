<div>
    <div>
        <img src="https://raw.githubusercontent.com/reclaimprotocol/.github/main/assets/banners/Docs.png"  />
    </div>
</div>

## Prerequisites
```bash copy
npm install -g pnpm
```

## Install the packages
```bash copy
pnpm i
```

### Troubleshooting sharp installation

If a globally installed libvips causes `sharp` to build from source and fail with `Please add node-addon-api to your dependencies`, use its prebuilt binaries:

```bash copy
SHARP_IGNORE_GLOBAL_LIBVIPS=1 pnpm i
```

For npm, run `SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install`. See the [sharp installation documentation](https://sharp.pixelplumbing.com/install/#building-from-source) for details.

## Run the project
```bash copy
pnpm run dev
```

## GitHub verification demo

The homepage's **Try Now!** button verifies the message and author date of the signed-in user's latest authored commit returned by GitHub search. GitHub's search index determines which commits are available, including repositories the user can access; unpushed commits are not included.

The server needs `RECLAIM_ORG_SECRET` in the ignored `.env.local` file. Reclaim MCP's `issue_org_token` can write it directly; `.env.example` lists the configuration variables. The organization and pinned provider version are configured in `lib/reclaim/config.ts`. Credentials are used only by the backend.

The public request recipe is kept in `reclaim/github-latest-commit.request.json`. Its title selector identifies the first commit result, and its date selector takes the first `author_date` in the embedded search payload. Keep the date anchored to the embedded-data script without a JSONPath: the portal's named-capture regex heuristic selects the full `<script>` element, which cannot be parsed as JSON. The attestor's matcher checks alone do not exercise this portal-specific extraction step. Provider versions are immutable, so testing a revised version requires a new session.

The published navigation script is kept in `reclaim/github-latest-commit.js`. It uses `%61uthor` in the displayed GitHub search URL because the portal's generic login detector treats `auth` anywhere in a URL as a login indicator, including `author`. GitHub receives the same decoded query. The script fetches the unchanged canonical URL for proof matching and explicitly reports the confirmed login. The regression tests cover this distinction.

For local development, start the app and run Reclaim MCP's `proxy_callback_events` with the app's port and path `/api/reclaim/callback`. It forwards verification results while the MCP server is running. The app verifies the signed result, session, organization, provider recipe, and proofs before displaying the two requested fields. `npm run test:reclaim` runs the backend tests (Node.js 22.6+).

Session records are private JSON files under the ignored `.data/reclaim` directory, so they survive local server restarts. `RECLAIM_STORAGE_DIR` can select another directory. This MVP uses a single Node.js server; deployment across instances or on serverless hosting needs a shared durable store. For deployment, register the public `/api/reclaim/callback` URL using `create_org_callback_subscription` for `verification_success`, `verification_rejected`, `verification_error`, `verification_cancelled`, and `session_expired`. A deployment cannot use the local callback listener.

## Contributing to Our Project

We're excited that you're interested in contributing to our project! Before you get started, please take a moment to review the following guidelines.

## Code of Conduct

Please read and follow our [Code of Conduct](https://github.com/reclaimprotocol/.github/blob/main/Code-of-Conduct.md) to ensure a positive and inclusive environment for all contributors.

## Security

If you discover any security-related issues, please refer to our [Security Policy](https://github.com/reclaimprotocol/.github/blob/main/SECURITY.md) for information on how to responsibly disclose vulnerabilities.

## Contributor License Agreement

Before contributing to this project, please read and sign our [Contributor License Agreement (CLA)](https://github.com/reclaimprotocol/.github/blob/main/CLA.md).

## Indie Hackers

For Indie Hackers: [Check out our guidelines and potential grant opportunities](https://github.com/reclaimprotocol/.github/blob/main/Indie-Hackers.md)

## License

This project is licensed under a [custom license](https://github.com/reclaimprotocol/.github/blob/main/LICENSE). By contributing to this project, you agree that your contributions will be licensed under its terms.

Thank you for your contributions!
