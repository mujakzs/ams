## Description

Monorepo powered by [NX](https://nx.dev/)

[Golang Getting Started](https://github.com/nx-go/nx-go)

✨ **Create a GO library** ✨

nx g @nx-go/nx-go:lib `<name>` --directory=library/go

```
To remove:
nx g rm <name>
```

✨ **Create a GO application** ✨

nx g @nx-go/nx-go:app `<name>` --directory=app

```
To remove:
nx g rm <name>
```

✨ **Create a Next application** ✨

nx g @nx/next:app `<name>` --directory=app

```
To remove:
nx g rm <name>
```

✨ **Create a Next Component** ✨

nx g @nx/next:library `<name>` --directory=library/next/components

```
To remove:
nx g rm <name>
```

✨ **Create a Node Library** ✨

nx g @nx/js:library `<name>` --directory=library/node/


✨ **Create a Node Application** ✨

nx g @nx/node:application `<name>` --directory=app

```
To remove:
nx g rm <name>
```

### Prerequisites
- Node v18.19.0 +
- Docker
- Docker-compose

### Npm global packages
- pnpm
- nx@18.2.3
- pm2

Make sure you have the softwares listed above installed.
Run the `compose` file.

```
docker-compose up -d
```

Next, we will run the migration for initial data in our database. (Make sure you have installed the packages by running: `pnpm install --frozen-lockfile`)

```
nx serve migrations
```

After successful running of the `compose` file and migrations go to: [cloudbeaver](http://localhost:8978/) local and configure database connection.


Lastly, we will run our applications in development.
```
./tools/scripts/serve.sh
```

