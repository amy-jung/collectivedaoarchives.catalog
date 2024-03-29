# Collective DAO Catalog
The Collective DAO Catalog is an open source database that captures, indexes, and archives various discussions from existing DAOs. Indviduals can query across all DAOs, bringing qualitative information of DAO Events into one searchable, source of truth. By building the most reliable open source database where anyone can contribute, integrate and extend the data, we can use the power of collective intelligence to highlight patterns and improve the development of new and existing DAOs.

## Contributing
**Contribute Content:** If you're interested in contributing to the database, signal important DAO Events by submitting the link on our [Contribute page](https://www.daocatalog.xyz/contribute). More details on the Collective DAO Catalog can be found in [our Wiki.](https://github.com/amy-jung/daocollective.archives/wiki/) If you're having any issues, create a Github issue.

**Contribute Technical Issues or Suggest Features:** If you find a bug or if you're interested in extending the functionality and features of the platform, create a Github issue (link).

If you found the Collective DAO Catalog useful, consider donating to help cover our maintenance costs ♥️

ETH Mainnet: daocatalog.eth

OPTIMISM: 0xEb31303Be09e9279F2046e6019502901AB2B6437

---

## Development

The project is built using a monorepo structure:

**Backend** (packages/backend):
- Handles the connection to the database (Postgress v15) and provides an API.
- Built with NodeJS/ExpressJS.
- Deployed to Heroku: https://dao-catalog-api-5a6466df16c9.herokuapp.com/

**Frontend** (packages/frontend):
- Reads data from the backend API and shows it in a web interface.
- Built with NextJS.
- Deployed to Vercel: https://collectivedaoarchives-catalog.vercel.app/

### Set up local development environment

You'll need NodeJS v18+, Yarn and Docker installed.

**1. Clone the repo**
```bash
git clone https://github.com/amy-jung/collectivedaoarchives.catalog.git
cd collectivedaoarchives.catalog
```

**2. Install dependencies**
```bash
yarn install
```

**3. Spin up the Postgres database**
```bash
docker-compose up -d
# use «docker-compose down» to stop the database service on docker
```

**4. Set up environment variables**

For `packages/backend` copy the `.env.example` file to `.env`.
For `packages/frontend` copy the `.env.example` file to `.env.local`.

Defaults should work for local development.

**5. Create and seed the database**

Copy the `packages/backend/prisma/records.csv.sample` to `packages/backend/prisma/records.csv` or use the sample file as a template to create your own.

```bash
# Create the database schema (based on the migrations, generated from packages/backend/prisma/schema.prisma)
yarn migrate:dev
# Seed the database (packages/backend/prisma/seed.ts)
yarn db:seed
```

If you want to update the schema:
1. Tweak the `packages/backend/prisma/schema.prisma`
2. Run `yarn db:push`
3. Repeat 1 & 2 until the schema is ready, and then run `yarn migrate:dev --name <your_update_name>` to create the corresponding migration file.

You can also use `yarn db:reset` to regenerate the schema (you'll lose all the data in the database!).

Note: For PROD enviroments, use `yarn migrate:deploy` (instead of `yarn migrate:dev`) to apply the migrations to the database.
Eventually we could add the command in the `heroku-postbuild` script in `packages/backend/package.json` to run it automatically on Heroku, but for now we'll run it manually.

**6. Start the backend**
```bash
yarn backend
```

**7. Start the frontend**

In a new terminal window:

```bash
yarn frontend
```

The app should now be running on http://localhost:3000
