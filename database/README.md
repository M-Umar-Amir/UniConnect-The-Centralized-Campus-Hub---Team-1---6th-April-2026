# Database

This folder contains database design assets for UniConnect.

## Suggested structure
- `schemas` - collection and schema definitions
- `migrations` - schema or data migration scripts
- `seeds` - sample and initial data
- `backups` - exported snapshots and backups

## Scope
- MongoDB collection design
- Relationships and indexing strategy
- Seed data for development and testing

## Local MongoDB

If MongoDB is not available on the machine, start a Docker container with:

```bash
docker run -d \
	--name uniconnect-mongo \
	-p 27017:27017 \
	mongo:7
```

Start an existing container with:

```bash
docker start uniconnect-mongo
```

Default connection string used by the app:

```bash
mongodb://localhost:27017/uniconnect
```
