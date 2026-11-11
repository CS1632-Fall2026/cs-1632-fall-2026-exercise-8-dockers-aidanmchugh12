#!/bin/sh

set -e

until curl --fail --silent --output /dev/null http://localhost:8080/; do
  >&2 echo "Web service is unavailable - sleeping"
  sleep 1
done

>&2 echo "Web service is up - continuing"
