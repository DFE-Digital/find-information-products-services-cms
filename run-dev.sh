#!/bin/bash
# Script to run Strapi with SQLite (development)

export DATABASE_CLIENT=sqlite
export DATABASE_FILENAME=.tmp/data.db
export HOST=0.0.0.0
export PORT=1337
export APP_KEYS="toBeModified1,toBeModified2"
export API_TOKEN_SALT=tobemodified
export ADMIN_JWT_SECRET=tobemodified
export TRANSFER_TOKEN_SALT=tobemodified
export JWT_SECRET=tobemodified
export PUBLIC_URL=http://localhost:1337

echo "Starting Strapi with SQLite database..."
npm run develop
