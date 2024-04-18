# Configuration

All configuration used by the app is stored in the `.env` file. You can find an example file in `.env.sample`, but you should copy it to `.env` and fill it with your own values (described below).

## Required configuration

### DATABASE_URL

**Default value**: `N/A`

**Values**: `N/A`

**Required**: `Yes`

Postgres connection string

### SECRET_KEY_BASE

**Default value**: `N/A`

**Values**: `N/A`

**Required**: `Yes`

Generate it with `mix phx.gen.secret` or `openssl rand -base64 48`

### BASE_URL

**Default value**: `N/A`

**Values**: `N/A`

**Required**: `Yes`

Base URL of the app (e.g. `https://claper.example.com`)

## Storage

### PRESENTATION_STORAGE

**Default value**: `local`

**Values**: `local, s3`

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

**Values**: `N/A`

**Required**: `No`

If `local` storage is used, this is the directory where the presentation files will be stored

### AWS_ACCESS_KEY_ID

**Default value**: `N/A`

**Values**: `N/A`

**Required**: `only for s3`

Your AWS Access Key ID

### AWS_SECRET_ACCESS_KEY

**Default value**: `N/A`

**Values**: `N/A`

**Required**: `only for s3`

Your AWS Secret Access Key

### AWS_PRES_BUCKET

**Default value**: `N/A`

**Values**: `N/A`

**Required**: `only for s3`

The name of the bucket where the presentation files will be stored

### AWS_REGION

**Default value**: `N/A`

**Values**: `N/A`

**Required**: `only for s3`

The region where the bucket is located

## Mail

### MAIL_TRANSPORT

**Default value**: `local`

**Values**: `local, smtp, postmark`

**Required**: `No`

Define how the emails will be sent

### MAIL_FROM

**Default value**: `Claper`

**Values**: `N/A`

**Required**: `No`

Email address used to send emails

### MAIL_FROM_NAME

**Default value**: `noreply@claper.co`

**Values**: `N/A`

**Required**: `No`

Name used to send emails

### SMTP_RELAY

**Default value**: `N/A`

**Values**: `N/A`

**Required**: `only for smtp`

SMTP relay server

### SMTP_USERNAME

**Default value**: `N/A`

**Values**: `N/A`

**Required**: `only for smtp`

SMTP username

### SMTP_PASSWORD

**Default value**: `N/A`

**Values**: `N/A`

**Required**: `only for smtp`

SMTP password

### SMTP_PORT

**Default value**: `25`

**Values**: `N/A`

**Required**: `No`

SMTP port

### SMTP_TLS

**Default value**: `always`

**Values**: `always, never, if_available`

**Required**: `No`

SMTP TLS

### SMTP_AUTH

**Default value**: `always`

**Values**: `always, never, if_available`

**Required**: `No`

SMTP Auth

### SMTP_SSL

**Default value**: `true`

**Values**: `true, false`

**Required**: `No`

SMTP SSL

### ENABLE_MAILBOX_ROUTE

**Default value**: `false`

**Values**: `true, false`

**Required**: `No`

Enable/disable route to local mailbox (`/dev/mailbox`)

### MAILBOX_USER

**Default value**: `N/A`

**Values**: `N/A`

**Required**: `No`

Basic auth user for mailbox route

### MAILBOX_PASSWORD

**Default value**: `N/A`

**Values**: `N/A`

**Required**: `No`

Basic auth password for mailbox route

### POSTMARK_API_KEY

**Default value**: `N/A`

**Values**: `N/A`

**Required**: `only for postmark`

Postmark API key

## Application

### PORT

**Default value**: `4000`

**Values**: `N/A`

**Required**: `No`

Port the application will listen to

### ENABLE_ACCOUNT_CREATION

**Default value**: `true`

**Values**: `true, false`

**Required**: `No`

Enable/disable user registration

### MAX_FILE_SIZE_MB

**Default value**: `15`

**Values**: `N/A`

**Required**: `No`

Max file size to upload in MB

### GS_JPG_RESOLUTION

**Default value**: `300x300`

**Values**: `N/A`

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
