---
outline: [2, 4]
---

# Configuration

When the application boots up, configuration values are gathered in the following manner:

1. Values are read from the file system at `<CONFIG_DIR>/<VARIABLE_NAME>`.
2. If no file is found at the appropriate location, the existence of a system environment variable is checked next.
3. If neither strategy produces a value, the application fails when a value is required, uses a default or ignores it when optional.

| Variable     | Description                                    | Required | Default        |
| ------------ | ---------------------------------------------- | -------- | -------------- |
| `CONFIG_DIR` | Absolute path from which to load config values | No       | `/run/secrets` |

For example, if a file exists at `/run/secrets/DATABASE_URL`, its contents is used as the value for that configuration parameter. If it doesn't, the application code will check for a system variable named `DATABASE_URL`. If none is found, the application will raise an exception, as an explicit value for this variable is required.

The loading of `.env` files as system variables is made more convenient with the use of the [`with_env.sh`](https://github.com/ClaperCo/Claper/blob/main/with_env.sh) script:

```shell
./with_env.sh mix phx.server # will load config values from `.env`
./with_env.sh --env .env.test mix test # will load config values from `.env.test`
```

An example of such a file is found in [`.env.sample`](https://github.com/ClaperCo/Claper/blob/main/.env.sample).

## Application

### Database

| Variable       | Description                                                          | Required | Default |
| -------------- | -------------------------------------------------------------------- | -------- | ------- |
| `DATABASE_URL` | Postgres connection string, e.g. `postgres://user:pass@host:port/db` | ❗Yes    | -       |
| `DB_SSL`       | Whether to use SSL/TLS to connect to the database, `true` or `false` | No       | `false` |
| `POOL_SIZE`    | Size of the pool used by the database connection module              | No       | `10`    |
| `QUEUE_TARGET` | Target wait-time used by the database connection module              | No       | `5_000` |

More information about the `DATABASE_URL` variable can be found in the [`Ecto.Repo` docs](https://hexdocs.pm/ecto/3.13.5/Ecto.Repo.html#module-urls). The `DB_SSL` config maps to the [`:ssl` Postgrex option](https://hexdocs.pm/postgrex/0.22.0/Postgrex.html#start_link/1-options). The variables `POOL_SIZE` and `QUEUE_TARGET` affect the behaviour of the underlying [database connection module](https://hexdocs.pm/db_connection/2.9.0/DBConnection.html#start_link/2-queue-config).

### Server

| Variable            | Description                                                                      | Required | Default                                                |
| ------------------- | -------------------------------------------------------------------------------- | -------- | ------------------------------------------------------ |
| `SECRET_KEY_BASE`   | Secret key base, generate with `mix phx.gen.secret` or `openssl rand -base64 48` | ❗Yes    | -                                                      |
| `BASE_URL`          | Server's base URL, e.g. `https://claper.example.com`                             | ❗Yes    | -                                                      |
| `PORT`              | Server's port                                                                    | No       | `4000`                                                 |
| `LISTEN_IP`         | IP to bind the server to, as a string                                            | No       | `0.0.0.0`                                              |
| `SAME_SITE_COOKIE`  | `SameSite` attribute for cookies, `Lax` or `None`                                | No       | `Lax`                                                  |
| `SECURE_COOKIE`     | `Secure` attribute for cookies, `true` or `false`                                | No       | `false`                                                |
| `REMOTE_IP_PROXIES` | Comma-separated trusted proxy IP addresses or CIDR ranges                       | No       | -                                                      |
| `REMOTE_IP_HEADERS` | Comma-separated forwarding headers used to determine the client IP              | No       | `forwarded,x-forwarded-for,x-client-ip,x-real-ip`      |

#### Keep `SECRET_KEY_BASE` stable

Generate `SECRET_KEY_BASE` once when installing Claper, then keep the exact same value for the lifetime of the instance. Store it in persistent secret storage provided by your deployment platform, and supply the same value to every application replica. Do not regenerate it when restarting containers, redeploying, or updating Claper.

Claper uses `SECRET_KEY_BASE` to sign sessions and encrypt sensitive settings stored in the database, including the Mistral API key. Changing it invalidates existing sessions and prevents Claper from decrypting previously stored settings. The encrypted values still exist in the database, but the administration interface may report that the Mistral API key is not configured.

If this happens, restore the previous `SECRET_KEY_BASE` and redeploy. If the previous value is unavailable, keep a newly generated value stable and enter the affected secrets again in the administration interface.

When both a secret file and an environment variable are configured, the file at `<CONFIG_DIR>/SECRET_KEY_BASE` takes precedence. Ensure that this file is also persistent and is not recreated with a different value during deployment.

The `LISTEN_IP` variable corresponds with the [`:ip` option for `Plug.Cowboy`](https://hexdocs.pm/plug_cowboy/Plug.Cowboy.html#module-options).

When Claper runs behind a reverse proxy or load balancer, set `REMOTE_IP_PROXIES` to the addresses or CIDR ranges of the proxies whose forwarding headers should be trusted. Do not include untrusted networks. `REMOTE_IP_HEADERS` replaces the default list of headers inspected to determine the original client IP.

### Features

| Variable                  | Description                                                  | Required | Default          |
| ------------------------- | ------------------------------------------------------------ | -------- | ---------------- |
| `ENABLE_ACCOUNT_CREATION` | Enable/disable user registration, `true` or `false`          | No       | `true`           |
| `EMAIL_CONFIRMATION`      | Enable/disable sign-up confirmation email, `true` or `false` | No       | `false`          |
| `LOGOUT_REDIRECT_URL`     | URL to redirect the user to after logout                     | No       | `/`              |
| `LANGUAGES`               | List of languages users will be able to choose from          | No       | `en,fr,es,it,de` |
| `TERMS_URL`               | URL of the terms of service shown on the registration page   | No       | -                |
| `PRIVACY_URL`             | URL of the privacy policy shown on the registration page     | No       | -                |

Languages are specified as a comma-separated list of [ISO 639 language codes](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes). The current [list of supported languages](https://github.com/ClaperCo/Claper/tree/dev/priv/gettext)&mdash;thanks to our generous contributors&mdash;is German (`de`), English (`en`), Spanish (`es`), French (`fr`), Hungarian (`hu`), Italian (`it`), Latvian (`lv`) and Dutch (`nl`). Translation of Claper is a community effort. If you find some translation lacking, feel free to [contribute](https://github.com/ClaperCo/Claper?tab=readme-ov-file#contributing).

The registration page displays the legal notice only when both `TERMS_URL` and `PRIVACY_URL` are configured. Each value must be an absolute URL beginning with `http` or `https`.

## Presentation storage

When a user creates and event and adds a presentation to it, a unique hash is created from the file using the following two steps:

```elixir
hash = :erlang.phash2("#{code}-#{name}")
final_hash = :erlang.phash2("#{hash}-#{System.system_time(:second)}")
```

Each page of the input file is transformed into a JPG image and stored, together with the presentation file, in a folder named after this computed hash. These files can be stored on the file system of the server running the application or on S3-compatible object storage.

| Variable               | Description                                 | Required | Default   |
| ---------------------- | ------------------------------------------- | -------- | --------- |
| `PRESENTATION_STORAGE` | Select storage type to use: `local` or `s3` | No       | `local`   |
| `MAX_FILE_SIZE_MB`     | Max size allowed for uploads in MB          | No       | `15`      |
| `GS_JPG_RESOLUTION`    | DPI of generated JPG presentation slides    | No       | `300x300` |

### Using the file system

When `PRESENTATION_STORAGE=local`, the following variable can be used to customise the path where presentation files are stored. With the default value, each presentation will have its files stored under `priv/static/uploads/<hash>`. The `uploads` folder will be created automatically if it doesn't exist.

| Variable                   | Description               | Required | Default                                   |
| -------------------------- | ------------------------- | -------- | ----------------------------------------- |
| `PRESENTATION_STORAGE_DIR` | Relative file system path | No       | `priv/static` (`/app/uploads` for Docker) |

### Using S3

When `PRESENTATION_STORAGE=s3`, the following variables are required. When a user uploads a new presentation, the destination file is uploaded to the specified S3 bucket under `presentations/<hash>`.

| Variable               | Description                        | Required           | Default |
| ---------------------- | ---------------------------------- | ------------------ | ------- |
| `S3_ACCESS_KEY_ID`     | S3 service access key ID           | ❓Yes, if using S3 | -       |
| `S3_SECRET_ACCESS_KEY` | S3 service secret access key       | ❓Yes, if using S3 | -       |
| `S3_REGION`            | Region where the bucket is located | ❓Yes, if using S3 | -       |
| `S3_BUCKET`            | Bucket name                        | ❓Yes, if using S3 | -       |

When using an S3-compatible service as an alternative to AWS, these additional variables can be used to define a [custom S3 endpoint](https://hexdocs.pm/ex_aws_s3/ExAws.S3.html#module-configuration):

| Variable    | Description                                   | Required                        | Default |
| ----------- | --------------------------------------------- | ------------------------------- | ------- |
| `S3_SCHEME` | URI scheme, typically `https://` or `http://` | ❓Yes, if using AWS alternative | -       |
| `S3_HOST`   | Host name                                     | ❓Yes, if using AWS alternative | -       |
| `S3_PORT`   | Port                                          | No                              | -       |

If the S3-compatible service uses different URLs for writes and public reads (like [Cloudflare R2 development URLs](https://developers.cloudflare.com/r2/buckets/public-buckets/#public-development-url), for example), the following variable can be used to define that:

| Variable        | Description        | Required | Default |
| --------------- | ------------------ | -------- | ------- |
| `S3_PUBLIC_URL` | S3 public read URL | No       | -       |

## Email delivery

The following are some configuration parameters common to all email setups:

| Variable         | Description                                           | Required | Default             |
| ---------------- | ----------------------------------------------------- | -------- | ------------------- |
| `MAIL_TRANSPORT` | How to send emails, `local`, `smtp` or `postmark`     | No       | `local`             |
| `MAIL_FROM`      | Email address for the `From` field in outbound emails | No       | `noreply@claper.co` |
| `MAIL_FROM_NAME` | Name for the `From` field in outbound emails          | No       | `Claper`            |

The value of `local` for `MAIL_TRANSPORT` is typically only useful during development used in conjunction with the [web-based mailbox feature](#mailbox). The `smtp` and `postmark` options are explained below.

### Using SMTP

When `MAIL_TRANSPORT=smtp`, the following configuration parameters exist:

| Variable             | Description                                                            | Required             | Default |
| -------------------- | ---------------------------------------------------------------------- | -------------------- | ------- |
| `SMTP_RELAY`         | Host name of SMTP relay, e.g. `smtp.example.com`                       | ❓Yes, if using SMTP | -       |
| `SMTP_PORT`          | Port of SMTP relay                                                     | No                   | `465`   |
| `SMTP_RETRIES`       | Retries upon server connection failure                                 | No                   | `1`     |
| `SMTP_NO_MX_LOOKUPS` | Whether to perform an MX lookup on the relay domain, `true` or `false` | No                   | `true`  |

These options are provided to [Swoosh](https://hexdocs.pm/swoosh/Swoosh.Adapters.SMTP.html), which itself then forwards them to [`gen_smtp`](https://hexdocs.pm/gen_smtp/readme.html#options). `gen_smtp` by default checks the domain given in `SMTP_RELAY` for MX records and attempts delivery using those servers rather than the host given, if any are found.

Authentication for the SMTP relay server is configured with the following variables:

| Variable        | Description                                                      | Required                           | Default  |
| --------------- | ---------------------------------------------------------------- | ---------------------------------- | -------- |
| `SMTP_AUTH`     | Whether to use authentication, `always`, `if_available`, `never` | No                                 | `always` |
| `SMTP_USERNAME` | SMTP username                                                    | ❓Yes, if using authenticated SMTP | -        |
| `SMTP_PASSWORD` | SMTP password                                                    | ❓Yes, if using authenticated SMTP | -        |

The connection to the SMTP relay server can be configured with the following variables:

| Variable          | Description                                                   | Required | Default               |
| ----------------- | ------------------------------------------------------------- | -------- | --------------------- |
| `SMTP_SSL`        | Enable SSL over 465, `true` or `false`                        | No       | `true`                |
| `SMTP_TLS`        | Enable usage of StartTLS, `always`, `if_available` or `never` | No       | `if_available`        |
| `SMTP_SSL_DEPTH`  | Max depth allowed for certificate chain                       | No       | `2`                   |
| `SMTP_SSL_SERVER` | `ReferenceID`, i.e. hostname, to check on the SSL certificate | No       | Value of `SMTP_RELAY` |

Possibly due to historical reasons, the connection security can be a bit tricky or confusing to set up. According to the [SMTP adapter documentation](https://hexdocs.pm/swoosh/Swoosh.Adapters.SMTP.html#module-note), if the client should connect to the server using StartTLS, the `SMTP_SSL` option should be set to `false`. The following are some configuration [examples](https://github.com/ClaperCo/Claper/pull/197) that we tested.

Using [Resend](https://resend.com/docs/send-with-smtp):

```dotenv
SMTP_RELAY=smtp.resend.com
SMTP_PORT=465
# SMTP_RETRIES=1
# SMTP_NO_MX_LOOKUPS=false

# SMTP_AUTH=always
SMTP_USERNAME=xxx
SMTP_PASSWORD=xxx

# SMTP_SSL=true
# SMTP_TLS=if_available
# SMTP_SSL_DEPTH=2
SMTP_SSL_SERVER=*.resend.com
```

Using Postmark ([over SMTP](https://postmarkapp.com/developer/user-guide/send-email-with-smtp)):

```dotenv
SMTP_RELAY=smtp.postmarkapp.com
SMTP_PORT=587
# SMTP_RETRIES=1
# SMTP_NO_MX_LOOKUPS=false

# SMTP_AUTH=always
SMTP_USERNAME=xxx
SMTP_PASSWORD=xxx

SMTP_SSL=false
SMTP_TLS=always
# SMTP_SSL_DEPTH=2
SMTP_SSL_SERVER=postmarkapp.com
```

Locally, with not connection security, with [Mailpit](https://github.com/axllent/mailpit):

```dotenv
SMTP_RELAY=localhost
SMTP_PORT=1025
# SMTP_RETRIES=1
SMTP_NO_MX_LOOKUPS=true

SMTP_AUTH=never
# SMTP_USERNAME=xxx
# SMTP_PASSWORD=xxx

SMTP_SSL=false
SMTP_TLS=never
# SMTP_SSL_DEPTH=2
# SMTP_SSL_SERVER=*.example.com
```

### Using Postmark

When `MAIL_TRANSPORT=postmark`, the application will use the [Postmark HTTP API](https://postmarkapp.com/developer/user-guide/send-email-with-api) for email delivery. An API key is required:

| Variable           | Description        | Required                 | Default |
| ------------------ | ------------------ | ------------------------ | ------- |
| `POSTMARK_API_KEY` | Postmark's API key | ❓Yes, if using Postmark | -       |

### Web-based mailbox {#mailbox}

When in development environment ([`MIX_ENV=dev`](https://hexdocs.pm/mix/Mix.html#module-environments)), the server provides a web-based mailbox displaying emails that would have normally be sent in production. This mailbox is accessible on the `/dev/mailbox` route and can be disabled and protected with [Basic HTTP authentication](https://hexdocs.pm/plug/Plug.BasicAuth.html).

| Variable               | Description                                   | Required | Default |
| ---------------------- | --------------------------------------------- | -------- | ------- |
| `ENABLE_MAILBOX_ROUTE` | Enable local mailbox route, `true` or `false` | No       | `false` |
| `MAILBOX_USER`         | Basic auth mailbox route user name            | No       | -       |
| `MAILBOX_PASSWORD`     | Basic auth mailbox route password             | No       | -       |

## OpenID Connect

This section details the configuration values available when using the [OIDC](#openid-connect) or [LTI](/integration/lti.md) integrations.

| Variable             | Description        | Required             | Default                       |
| -------------------- | ------------------ | -------------------- | ----------------------------- |
| `OIDC_ISSUER`        | OIDC issuer URL    | ❓Yes, if using OIDC | `https://accounts.google.com` |
| `OIDC_CLIENT_ID`     | OIDC client ID     | ❓Yes, if using OIDC | -                             |
| `OIDC_CLIENT_SECRET` | OIDC client secret | ❓Yes, if using OIDC | -                             |

The name and logo can be customised on the OIDC login page:

| Variable             | Description                                                | Required | Default          |
| -------------------- | ---------------------------------------------------------- | -------- | ---------------- |
| `OIDC_LOGO_URL`      | Logo URL to use for the login page button                  | No       | -                |
| `OIDC_PROVIDER_NAME` | Name of the OIDC provider to use for the login page button | No       | `OpenID Connect` |

The following aspects of the integration can be controlled too:

| Variable                         | Description                                                                                           | Required | Default                |
| -------------------------------- | ----------------------------------------------------------------------------------------------------- | -------- | ---------------------- |
| `OIDC_SCOPES`                    | Scopes to use                                                                                         | No       | `openid email profile` |
| `OIDC_PROPERTY_MAPPINGS`         | Mapping of Claper user properties to OIDC user properties                                             | No       | -                      |
| `OIDC_AUTO_REDIRECT_LOGIN`       | Redirect user to the OIDC authentication process instead of the default login page, `true` or `false` | No       | `false`                |
| `DISABLE_PASSWORD_LOGIN`        | Disable email/password login and local registration when OIDC is configured, `true` or `false`      | No       | `false`                |
| `ALLOW_UNLINK_EXTERNAL_PROVIDER` | Allow unlinking of external provider from email/password credentials, `true` or `false`               | No       | `false`                |

`DISABLE_PASSWORD_LOGIN=true` hides the email/password form, **Forgot your password?** link, and **Create account** link. It also blocks password login and local registration on the server, including direct requests, regardless of `ENABLE_ACCOUNT_CREATION`. Password login requests are redirected to `/users/oidc`.

The setting only takes effect when both `OIDC_CLIENT_ID` and `OIDC_CLIENT_SECRET` contain non-blank values. If either is missing, empty, or whitespace-only, Claper logs a startup warning and keeps password login enabled.

Before enabling it, [prepare an OIDC administrator account](/integration/oidc.md#require-oidc-login). `OIDC_AUTO_REDIRECT_LOGIN` controls automatic redirection from the login page; it does not itself disable password authentication.

The `OIDC_PROPERTY_MAPPINGS` defines the mapping of Claper user properties to OIDC user properties (mainly organisation and user roles). A key-value pair where the key is the Claper property and the value is the property name contained in the OIDC claims. For example:

```
roles:additional_infos.roles,organization:organization
```

Given this example, a working setup would have the OIDC provider returning the following claims:

```json
{
  "acr": "goauthentik.io/providers/oauth2/default",
  "aud": "kGPN2rhtUO2PC3GAZOsnRmsGUjEdV4MMj7EO8vMu",
  "email": "user@example.com",
  "email_verified": true,
  "exp": 1722352313,
  "given_name": "John Doe",
  "groups": ["user"],
  "iat": 1722352013,
  "iss": "https://myprovider.com/application/o/claper/",
  "name": "John Doe",
  "nickname": "johndoe",
  "organization": "acme",
  "preferred_username": "johndoe",
  "additional_infos": {
    "roles": "1, 2, 3"
  },
  "sub": "e038a2dce4819247f6d0d3aacdde4a9ad2988daa66bf6372713a13babfa61aa4"
}
```

## Realtime transcription

Configure transcription in **Administration → Settings → Transcription Settings**. These settings are stored in the database and are not environment variables in `.env.sample`.

| Setting | Description | Default |
| ------- | ----------- | ------- |
| **Enable transcription feature globally** | Make transcription available in the event manager | Disabled |
| **Mistral API Key** | API key used by the server to connect to Mistral's realtime transcription service | Not configured |
| **Default Language** | Default language value for transcription sessions; events can store their own language selection | Auto-detect |

Enable the feature, enter a Mistral API key, and click **Save settings**. The key is encrypted in the database using a key derived from `SECRET_KEY_BASE`, so [keep that value stable](#keep-secret-key-base-stable). Leaving the API key field blank when saving preserves the existing key; **Clear** removes it.

The browser capturing audio needs microphone permission and a secure context (HTTPS, or localhost for development). Reverse proxies must support WebSocket connections, including `/audio/websocket`, and the Claper server needs outbound access to `wss://api.mistral.ai/v1/audio/transcriptions/realtime` on port 443.

See [Realtime transcription](/usage/transcription.md) for event setup, language behavior, subtitle display, and transcript exports.
