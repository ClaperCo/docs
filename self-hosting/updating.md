# Updating

Each new release contains information about the changes in the release (check [releases](https://github.com/ClaperCo/Claper/releases) and [changelog](https://github.com/ClaperCo/Claper/blob/main/CHANGELOG.md)). This section outlines the general steps and explains the versioning.

## Version management

Claper follows semantic versioning: MAJOR.MINOR.PATCH

You can find available Claper versions in the [releases](https://github.com/ClaperCo/Claper/releases) page. The default latest tag refers to the latest stable release tag. All the Docker image tags are available on the [Github](https://github.com/ClaperCo/Claper/pkgs/container/claper).

You can also pin your version:

`ghcr.io/claperco/claper:2` pins the major version to 2 but allows minor and patch version upgrades.

`ghcr.io/claperco/claper:2.0` pins the minor version to 2.0 but allows only patch upgrades.

None of the functionality is backported to older versions. If you wish to get the latest bug fixes and security updates you need to upgrade to a newer version.

New versions are published on the releases page and their changes are documented in our [Changelog](https://github.com/ClaperCo/Claper/blob/main/CHANGELOG.md). Please note that database schema changes require running migrations when you're upgrading. However, we consider the schema as an internal API and therefore schema changes aren't considered a breaking change.

We recommend to pin the major version instead of using latest. Either way the general flow for upgrading between minor version would look like this:

1. **Stop and remove the current container**

```sh
docker compose down
```

2. **Pull the new version**

```sh
docker compose pull
```

3. **Start the new version**

```sh
docker compose up -d
```
