# PostgreSQL Production Setup Guide

## Overview
This Strapi CMS is configured to use SQLite for local development and PostgreSQL for production deployment.

## Local Development
- Uses SQLite database (`.tmp/data.db`)
- Configured via `DATABASE_CLIENT=sqlite` in `.env`
- Database file is automatically created and ignored by Git

## Production Deployment

### 1. Environment Variables
Set the following environment variables in your production environment:

```bash
# Database Configuration
DATABASE_CLIENT=postgres
DATABASE_HOST=your-postgres-host
DATABASE_PORT=5432
DATABASE_NAME=your-database-name
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
DATABASE_SSL=true

# Server Configuration
HOST=0.0.0.0
PORT=1337
APP_KEYS="your-app-key-1,your-app-key-2"
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret
PUBLIC_URL=https://your-domain.com
```

### 2. Alternative: Connection String
Instead of individual parameters, you can use a single connection string:

```bash
DATABASE_URL=postgresql://username:password@host:port/database_name
```

### 3. Database Setup
1. Create a PostgreSQL database for your Strapi application
2. Ensure the database user has appropriate permissions
3. Run database migrations: `npm run strapi migrate`

### 4. SSL Configuration
For production, SSL is recommended. The configuration supports:
- `DATABASE_SSL=true` for basic SSL
- Additional SSL certificates if required:
  - `DATABASE_SSL_KEY`
  - `DATABASE_SSL_CERT`
  - `DATABASE_SSL_CA`

### 5. Connection Pooling
Configure connection pooling for better performance:
```bash
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_CONNECTION_TIMEOUT=60000
```

## Migration from SQLite to PostgreSQL

When deploying to production:

1. **Schema Migration**: Strapi will automatically create the necessary tables
2. **Data Migration**: You'll need to export data from SQLite and import to PostgreSQL
3. **Content Types**: Ensure all content types are properly configured
4. **Media Files**: Upload media files to your production environment

## Dependencies
- `pg`: PostgreSQL client for Node.js
- `@types/pg`: TypeScript definitions for PostgreSQL client

## Security Notes
- Never commit database credentials to version control
- Use environment variables for all sensitive configuration
- Enable SSL for production database connections
- Use strong, unique secrets for JWT and API tokens
