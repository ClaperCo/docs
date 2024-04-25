# Prerequisites

You can choose to run Claper directly in your server environment or use Docker to run it in a container. If you decide **not to use Docker**, you need to have the following prerequisites:

- Postgres >= 15
- Elixir >= 1.16.2
- Erlang >= 26
- NPM >= 10
- NodeJS >= 20
- Ghostscript >= 10 (for PDF support)
- Libreoffice >= 24 (for PPT/PPTX support)

If you want to use Docker, you just need to have the latest [Docker](https://docs.docker.com/engine/install/) version installed on your server.

:::info Recommendation
Docker is the most recommended and easy way to run Claper. You don't have to be a Docker expert to launch your own instance, but you should have a basic understanding of the command-line and networking to successfully set it up.
:::

## Hardware requirements

The hardware requirements depend on the number of attendees and the number of presentations you want to run simultaneously. You can smoothly host a presentation up to 300 attendees with **3 vCPU cores** and **4 GB of RAM**, it could be x86_64 or ARM64 architecture.

:::info
This is a non-exhaustive configuration and can vary depending on your network quality and how the attendees interact with the presentation.
:::
