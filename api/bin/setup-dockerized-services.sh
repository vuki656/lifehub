#!/usr/bin/env bash

# Get the bin folder base directory
BASEDIR=$(dirname "$0")

# Start postgres docker image
${BASEDIR}/start-docker-postgres.sh lifehub
