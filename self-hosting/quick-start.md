# Quick Start

To get started quickly, clone the [ClaperCo/Claper](https://github.com/ClaperCo/Claper) repository and follow the instructions below.

1. Clone the repo
   ```sh
   git clone https://github.com/ClaperCo/Claper.git
   ```
2. Go to the project directory
   ```sh
   cd Claper
   ```
3. Run Docker compose
   ```sh
   docker compose up
   ```

## Required configuration

In the downloaded repository, you will find a `.env.sample` file. You can copy this file to `.env` and edit it to match your configuration.

```sh
cp .env.sample .env
```

The required environment variables are `DATABASE_URL`, `SECRET_KEY_BASE`, and `BASE_URL`. Let's do as it asks and populate these required environment variables with our own values.

For the `SECRET_KEY_BASE` variable, you can generate a secret key with the following `openssl` command:

```sh
$ openssl rand -base64 48
oGBshkO1uLF4wjeFcoQjcRmHxX+YXL1XQKUaBcGVFa/i1mdmYyFWe4ISzTExj+5s
```

And then we decide on the `BASE_URL` where the instance would be accessible. Let's assume we choose http://claper.example.com

You `.env` file should look like this:

```sh
DATABASE_URL=postgresql://claper:claper@db:5432/claper
SECRET_KEY_BASE=oGBshkO1uLF4wjeFcoQjcRmHxX+YXL1XQKUaBcGVFa/i1mdmYyFWe4ISzTExj+5s
BASE_URL=http://claper.example.com
```

We can start our instance now but the requests would be served over HTTP. To serve the requests over HTTPS, we need a reverse proxy like Traefik or Nginx. We will use Traefik in this example.

## SSL with Traefik

Before setting up SSL, you need to configure your DNS to point to the server where Claper is running.

Once your DNS is configured, add the Traefik service to the `docker-compose.yml` file:

```yml
services:
  traefik:
    image: traefik
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=youremail@example.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    volumes:
      - "./letsencrypt:/letsencrypt"
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
    ports:
      - "80:80"
      - "443:443"
    networks:
      - claper-net
```

Make sure to replace `youremail@example.com` with your email address. This is important for SSL certificate generation.

Then, add the `traefik` label to the `app` service:

```yml
services:
  app:
    ...
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`claper.example.com`)"
      - "traefik.http.routers.app.tls.certresolver=myresolver"
      - "traefik.http.routers.app.entrypoints=websecure"
      - "traefik.http.services.app.loadbalancer.server.port=4000"
```

If Docker containers are already running, remove all the containers and start them again:

```sh
docker compose down
docker compose up -d
```

:::warning Update your `BASE_URL`
Don't forget to update the `BASE_URL` in your `.env` file to `https://claper.example.com`.
:::

Now, you can access your Claper instance at https://claper.example.com.

## Default user

To access Claper for the first time, the default admin user is:

- Email: `admin@claper.co`
- Password: `claper`