# OpenID Connect

By default, Claper authenticate users with email and password. With OpenID Connect, you can use an external provider like Google or a custom identity provider supporting OpenID Connect.

Refers to the [configuration](/self-hosting/configuration.md) section to see how to set up OpenID Connect on your own instance.

## Callback URL

The callback URL is the link that the external provider will redirect to after the user has authenticated.

For Claper, it is `https://<your-claper-instance>/users/oidc/callback`.

Do not forget to add the callback URL to the list of allowed redirect URLs in the external provider.
