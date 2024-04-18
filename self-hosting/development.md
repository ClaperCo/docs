# Development Environment

If you want to contribute to Claper, you can set up a development environment on your machine.

## Setting up a development environment

To set up a development environment, you need to have the [pre-requisites](/self-hosting/prerequisites) installed on your machine.

1. **Clone the repo**

```sh
git clone https://github.com/ClaperCo/Claper.git
```

2. **Go to the project directory**

```sh
cd Claper
```

3. **Configure your environment variables**

```sh
cp .env.sample .env
```

Edit the `.env` file to match your configuration.

4. **Install dependencies**

```sh
mix deps.get
```

5. **Migrate your database**

```sh
mix ecto.migrate
```

6. **Install JS dependencies**

```sh
cd assets && npm i
```

7. **Allow execution of startup file**

```sh
chmod +x ./start.sh
```

8. **Start Phoenix endpoint with**

```sh
./start.sh
```

:::info Database
You need a PostgreSQL database running on your machine. You can run it with a Docker container: `docker run -p 5432:5432 -e POSTGRES_PASSWORD=claper -e POSTGRES_USER=claper -e POSTGRES_DB=claper --name claper-db -d postgres:15`.
:::

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

If you have configured `MAIL` environment variable to `local`, you can access to the mailbox at [`localhost:4000/dev/mailbox`](http://localhost:4000/dev/mailbox).
