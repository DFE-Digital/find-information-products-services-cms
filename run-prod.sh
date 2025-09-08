#!/bin/bash
# Script to run Strapi with PostgreSQL (production)

export DATABASE_CLIENT=postgres
export DATABASE_HOST=dev-fips.postgres.database.azure.com
export DATABASE_PORT=5432
export DATABASE_NAME=strapi
export DATABASE_USERNAME=Ugd27cgf2iyffi27yfgeujfgeu2geufieflkwf
export DATABASE_PASSWORD='Yrcg28fcgu4geceh2g7$%£Freugv£&vju73'
export DATABASE_SSL=true
export HOST=0.0.0.0
export PORT=1337
export APP_KEYS="toBeModified1,toBeModified2"
export API_TOKEN_SALT=tobemodified
export ADMIN_JWT_SECRET=tobemodified
export TRANSFER_TOKEN_SALT=tobemodified
export JWT_SECRET=tobemodified
export PUBLIC_URL=https://your-domain.com

echo "Starting Strapi with PostgreSQL database..."
npm run develop
