#!/bin/sh
set -e

until (/usr/bin/mc alias set local "$S3_ENDPOINT" "$S3_ACCESS_KEY" "$S3_SECRET_KEY"); do
  echo "Waiting for MinIO..."
  sleep 2
done

/usr/bin/mc mb --ignore-existing "local/$S3_BUCKET"
/usr/bin/mc anonymous set download "local/$S3_BUCKET"
