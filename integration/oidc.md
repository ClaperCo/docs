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
