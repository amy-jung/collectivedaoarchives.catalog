# Collective DAO Archive Catalog
The Collective DAO Archive Catalog is a comprehensive, living open source resource that captures, indexes, and archives various challenges and events from existing DAOs. Together, as an open source database that anyone can contribute to, we can use the power of collective intelligence to highlight patterns and improve the development of new and existing DAOs.

## Who It's For

### Users
1. 👷🏻‍♀️ **DAO Builders**: The Catalog is intended for contributors or leaders of DAOs who are looking for insights into commonly used practices and roadmaps for building DAOs/orgs.
2. 🛠 **DAO Tooling / Service Providers**: The Catalog can also be used by tooling and service providers who need to contextualize the challenges across many DAOs and shed light on unmet needs and opportunities for improvement.

### Contributors
1. ⌨️ **Technical Maintainers and Contributor**: The Technical Maintainer(s) is a key role for the longterm success of this project. Their roles would be the technical maintenance and hosting as well as the qualitative assessment for PRs being merged. Additionally, contributors who would like to extend the functionality and features of the platform can submit PRs.
2. 📚 **Content Creators**:  The Catalog will engage content creators who are interested in contributing to or expanding on topics related to DAOs, helping to build a comprehensive knowledge base.


## Contributing
Check the [Wiki for how to contribute.](https://github.com/amy-jung/daocollective.archives/wiki/Contributing)

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
git clone https://github.com/amy-jung/collectivedaoarchives.catalog.git`
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
