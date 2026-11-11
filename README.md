# Élégance frontend

React 19, TypeScript, Vite and Microsoft Entra ID (MSAL). The app includes a public catalog, client reservations, an administrator dashboard, Kafka-based statistics and event monitoring.

```sh
npm ci
cp .env.example .env
npm run dev
```

Vite uses HTTPS locally and proxies `/api/v1` to the seven backend services on ports 8081–8087. Configure Entra's SPA redirect URI to match the browser origin. The local development certificate must be trusted through your normal development environment setup.

Configuration is public client configuration; never put secrets or client passwords in `VITE_*` variables:

- `VITE_API_URL`: `/api/v1` for the bundled proxy and production Caddy deployment.
- `VITE_AZURE_CLIENT_ID`, `VITE_AZURE_AUTHORITY`: SPA application and tenant.
- `VITE_API_SCOPE`: delegated API scope, default `api://304d54f7-d485-478a-a1ea-0c2f874b0c1f/access_as_user`.
- `VITE_REDIRECT_URI`: optional explicit redirect origin.
- `VITE_KAFKA_UI_URL`, `VITE_RABBITMQ_UI_URL`: dashboard URLs, normally reached through an SSH tunnel.
- `VITE_KAFKA_REPLICATION_FACTOR`: use 3 with the evaluation cluster.

MSAL obtains an API access token silently for each request. The `Admin` app role enables the administrator interface; the backend independently validates permissions and ownership. An email address never grants administration. Login through Microsoft Graph scopes alone does not authorize this API.

Statistics come from the analytics service and refresh every ten seconds. Financial values represent completed services rather than collected payments. Failed API operations show an error and do not invent persisted records. Demo catalog data is controlled by the backend's explicit `demo` profile.

```sh
npm run lint
npm run build
```

Production builds are uploaded to `/opt/elegance/public` on the streaming EC2 and served by Caddy with HTTPS and same-origin API routes. The workflow validates pull requests and requires explicit workflow dispatch for deployment. It uses `EC2_HOST`, `EC2_SSH_KEY`, `EC2_KNOWN_HOSTS`, optional `EC2_USER`, and the public `VITE_*` repository variables. It does not terminate EC2 instances or run Terraform.
