#!/usr/bin/env bash

# setup production environment

DB_NAME='todo-s'

docker run --rm --name postgres -e POSTGRES_PASSWORD=test -p 5432:5432 -v $(pwd)/data/postgres2:/var/lib/postgresql/data -d postgres
sleep 5
docker exec --user postgres -it postgres psql -c "create database \"$DB_NAME\""
