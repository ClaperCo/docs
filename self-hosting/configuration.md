# Configuration

All configuration used by the app is stored in the `.env` file. You can find an example file in `.env.sample`, but you should copy it to `.env` and fill it with your own values (described below).

## Required configuration

### DATABASE_URL

**Default value**: `N/A`

**Example**: `postgres://[user]:[password]@[host]:[port]/[database]`

**Required**: `Yes`

Postgres connection string

### SECRET_KEY_BASE

**Default value**: `N/A`

**Required**: `Yes`

Generate it with `mix phx.gen.secret` or `openssl rand -base64 48`

### BASE_URL

**Default value**: `N/A`

**Example**: `https://claper.example.com`

**Required**: `Yes`

Base URL of the app

## Storage

### PRESENTATION_STORAGE

**Default value**: `local`

**Accepted values**: `local, s3`

**Required**: `No`

Define where the presentation files will be stored.

Each presentation has a unique hash that is generated in two steps, first with `:erlang.phash2("#{code}-#{name}")` and then `:erlang.phash2("#{hash}-#{System.system_time(:second)}")`.

#### Local storage

The local storage is the default storage option. It stores the presentations in the `priv/static/uploads/[hash]` folder.

The `uploads` folder will be created automatically if it doesn't exist.

#### S3 storage

When user upload a new presentation, the destination file is uploaded to S3 in your bucket in `presentations/[hash]` and the local file is deleted.

### PRESENTATION_STORAGE_DIR

**Default value**: `priv/static (/app/uploads for Docker)`

**Required**: `No`

If `local` storage is used, this is the directory where the presentation files will be stored

### AWS_ACCESS_KEY_ID

**Default value**: `N/A`

**Required**: `only for s3`

Your AWS Access Key ID

### AWS_SECRET_ACCESS_KEY

**Default value**: `N/A`

**Required**: `only for s3`

Your AWS Secret Access Key

### AWS_PRES_BUCKET

**Default value**: `N/A`

**Required**: `only for s3`

The name of the bucket where the presentation files will be stored

### AWS_REGION

**Default value**: `N/A`

**Required**: `only for s3`

The region where the bucket is located

## Mail

### MAIL_TRANSPORT

**Default value**: `local`

**Accepted values**: `local, smtp, postmark`

**Required**: `No`

Define how the emails will be sent

### MAIL_FROM

**Default value**: `noreply@claper.co`

**Required**: `No`

Email address used to send emails

### MAIL_FROM_NAME

**Default value**: `Claper`

**Required**: `No`

Name used to send emails

### SMTP_RELAY

**Default value**: `N/A`

**Required**: `only for smtp`

SMTP relay server

### SMTP_USERNAME

**Default value**: `N/A`

**Required**: `only for smtp`

SMTP username

### SMTP_PASSWORD

**Default value**: `N/A`

**Required**: `only for smtp`

SMTP password

### SMTP_PORT

**Default value**: `25`

**Required**: `No`

SMTP port

### ENABLE_MAILBOX_ROUTE

**Default value**: `false`

**Accepted values**: `true, false`

**Required**: `No`

Enable/disable route to local mailbox (`/dev/mailbox`)

### MAILBOX_USER

**Default value**: `N/A`

**Required**: `No`

Basic auth user for mailbox route

### MAILBOX_PASSWORD

**Default value**: `N/A`

**Required**: `No`

Basic auth password for mailbox route

### POSTMARK_API_KEY

**Default value**: `N/A`

**Required**: `only for Postmark`

Postmark API key

## Application

### PORT

**Default value**: `4000`

**Required**: `No`

Port the application will listen to

### ENABLE_ACCOUNT_CREATION

**Default value**: `true`

**Accepted values**: `true, false`

**Required**: `No`

Enable/disable user registration

### EMAIL_CONFIRMATION

**Default value**: `false`

**Accepted values**: `true, false`

**Required**: `No`

Enable/disable user email confirmation when they sign up

### MAX_FILE_SIZE_MB

**Default value**: `15`

**Required**: `No`

Max file size to upload in MB

### GS_JPG_RESOLUTION

**Default value**: `300x300`

**Required**: `No`

Resolution (DPI) of the JPG generated from PDF, higher resolution means bigger files but better quality

### SAME_SITE_COOKIE

**Default value**: `Lax`

**Values**: `Lax, None`

**Required**: `No`

SameSite attribute for cookies

### SECURE_COOKIE

**Default value**: `false`

**Values**: `true, false`

**Required**: `No`

Secure attribute for cookies

### ALLOW_UNLINK_EXTERNAL_PROVIDER

**Default value**: `false`

**Accepted values**: `true, false`

**Required**: `No`

If `true`, the user will be able to unlink their external provider and login with their email and password (only if you have set up [OIDC](#openid-connect) or [LTI](/integration/lti.md) integration)

## OpenID Connect

### OIDC_ISSUER

**Default value**: `https://accounts.google.com`

**Required**: `only for OIDC`

OIDC issuer URL

### OIDC_CLIENT_ID

**Default value**: `N/A`

**Required**: `only for OIDC`

OIDC client ID

### OIDC_CLIENT_SECRET

**Default value**: `N/A`

**Required**: `only for OIDC`

OIDC client secret

### OIDC_SCOPES

**Default value**: `openid email profile`

**Required**: `No`

Scopes to use

### OIDC_LOGO_URL

**Default value**: `N/A`

**Required**: `No`

Logo URL to use for the login page button

### OIDC_PROVIDER_NAME

**Default value**: `OpenID Connect`

**Required**: `No`

Name of the OIDC provider to use for the login page button

### OIDC_PROPERTY_MAPPINGS

**Default value**: `N/A`

**Example**: `roles:additional_infos.roles,organization:organization`

**Required**: `No`

Property mapping to map Claper user properties to OIDC user properties (mainly _organization_ and user _roles_). This is a key-value pair where the key is the Claper property and the value is the property name contained in the OIDC claims.

The example value provided is correct if your OIDC provider returns the following claims:

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

### OIDC_AUTO_REDIRECT_LOGIN

**Default value**: `false`

**Accepted values**: `true, false`

**Required**: `No`

If `true`, the user will be redirected automatically to the OIDC authentication process instead of the default login page.
