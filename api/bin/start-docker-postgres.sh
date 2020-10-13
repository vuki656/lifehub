#!/usr/bin/env bash
containerName=$1

# Catch DB variables from extract-postgres-options.ts
postgresConnection=$(node ./bin/extract-postgres-options.ts)
postgresConnectionArray=(${postgresConnection})

postgresPort=${postgresConnectionArray[0]}
postgresDatabaseName=${postgresConnectionArray[1]}
postgresUser=${postgresConnectionArray[2]}
postgresPassword=${postgresConnectionArray[3]}

isContainerRunning=$(docker ps | grep -c ${containerName})
isContainerBuilt=$(docker ps -a | grep -c ${containerName})

if (( ${isContainerRunning} >= 1 ));
then
    echo 'Killing running docker container:'
    docker kill ${containerName}
fi

if (( ${isContainerBuilt} >= 1 ));
then
    echo 'Destroying built docker container:'
    docker container rm ${containerName}
fi

echo 'Starting a new docker container:' ${containerName}
docker run \
  --name ${containerName} -e \
  POSTGRES_USER=${postgresUser} -e \
  POSTGRES_PASSWORD=${postgresPassword} -e \
  POSTGRES_DB=${postgresDatabaseName} -p 0.0.0.0:${postgresPort}:5432/tcp -d postgres:10.7-alpine postgres -N 200
