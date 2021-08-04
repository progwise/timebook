# GraphQL backend for Timebook

## Build the docker image

```
docker build --tag timebook-graphql .
docker run -p 4000:4000 timebook-graphql
```

## run docker-compose

```
docker-compose up
```

you can ignore seeding error messages because of unique constraint violations for the moment
