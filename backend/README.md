# GraphQL backend for Timebook

## Build the docker image

```
docker build --tag timebook-graphql .
docker run -p 4000:4000 timebook-graphql
```

## run all in docker-compose

```
docker-compose up
```

you can ignore seeding error messages because of unique constraint violations for the moment

## run db in docker and graphql in dev mode

```
docker-compose -f docker-compose.dev.yml up
```

plus

```
npm i
npm run dev
```
