# OpenID Connect

By default, Claper authenticate users with email and password. With OpenID Connect, you can use an external provider like Google or a custom identity provider supporting OpenID Connect.

Refers to the [configuration](/self-hosting/configuration.md) section to see how to set up OpenID Connect on your own instance.

## Prerequisites

To make your identity provider compatible with Claper, you need to check the following:

- **User emails**: All your users should have an email, so the scope `email` should be defined in the `OIDC_SCOPES` configuration.

- **Authentication method**: Claper only supports the two authentication methods `client_secret_basic` and `client_secret_post`.

## Callback URL

The callback URL is the link that the external provider will redirect to after the user has authenticated.

For Claper, it is `https://<your-claper-instance>/users/oidc/callback`.

Do not forget to add the callback URL to the list of allowed redirect URLs in the external provider.

## Require OIDC login

Set `DISABLE_PASSWORD_LOGIN=true` to require OIDC for sign-in. This hides the local login form and its password-reset and registration links, and blocks password login and local account creation on the server.

Before enabling it, prepare an administrator account that can sign in through OIDC:

1. Configure your OIDC provider and verify that you can sign in through it with the account that should become your administrator.
2. Sign in with an existing local administrator, such as the seeded `admin@claper.co` account, and promote the OIDC account to administrator in the administration panel.
3. Confirm that the OIDC account can access the administration panel.
4. Set `DISABLE_PASSWORD_LOGIN=true` and restart or redeploy Claper.

The seeded administrator's password login is also disabled by this setting. Both `OIDC_CLIENT_ID` and `OIDC_CLIENT_SECRET` must be non-blank; otherwise Claper ignores the flag, logs a startup warning, and leaves password login enabled.

You can also set `OIDC_AUTO_REDIRECT_LOGIN=true` to send users straight to the identity provider when they open the login page. Automatic redirection alone does not block password login.
