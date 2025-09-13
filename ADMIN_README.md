# Admin Product Management Interface

This document describes the admin functionality for managing product information in the Strapi CMS.

## Overview

The admin interface provides a comprehensive product management system that allows authenticated users with proper permissions to:

- View all products in the system
- Create new products
- Edit existing products
- Delete products
- Manage product states (New, Active, Rejected, Removed)
- Keep products as drafts (publishedAt = null)

## Authentication & Authorization

### User Authentication
- Users must be signed in to the Strapi admin interface
- User information is retrieved from the current session

### Permission Checking
The system checks user permissions by:
1. Getting the signed-in user's email address
2. Checking if the user exists in the `user.permissions.user` collection
3. Only users with entries in this collection can access admin functionality

### API Key Usage
- All admin operations use the write API key (`CmsApi:WriteApiKey`) for CMS operations
- This ensures proper authorization for create, update, and delete operations

## Admin Interface Components

### Product Management Component
Location: `src/admin/components/ProductManagement.tsx`

Features:
- **Product List**: Displays all products in a table format
- **Add Product**: Modal form for creating new products
- **Edit Product**: Modal form for editing existing products
- **Delete Product**: Confirmation dialog for product deletion
- **State Management**: Visual badges showing product states
- **Draft Status**: Visual indicators for published vs draft products

### Admin API Endpoints
Location: `src/api/admin/`

Endpoints:
- `GET /api/admin/products` - List all products
- `GET /api/admin/products/:id` - Get single product
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/products/:id/publish` - Publish product
- `POST /api/admin/products/:id/unpublish` - Unpublish product

### User Permissions API
Location: `src/api/user-permission/`

Endpoints:
- `GET /api/user-permission` - Check user permissions by email
- `GET /api/user-permission/me` - Get current user info

## Configuration

### Middleware
The `global::admin-auth` middleware is configured in `config/middlewares.ts` to:
- Check user authentication
- Verify user permissions for admin endpoints
- Allow public access to user permission checking endpoints

### Admin Routes
Admin routes are registered in `src/admin/app.tsx` with:
- Menu link in the admin sidebar
- Proper component registration
- Permission-based access control

## Product Data Structure

Products include the following fields:
- `fips_id`: Optional FIPS identifier
- `title`: Required product title
- `cmdb_sys_id`: Optional CMDB system identifier
- `short_description`: Required short description
- `long_description`: Optional detailed description
- `product_url`: Optional product URL
- `category_values`: Many-to-many relationship with category values
- `product_contacts`: One-to-many relationship with product contacts
- `cmdb_last_sync`: Last synchronization timestamp
- `state`: Product state (New, Active, Rejected, Removed)
- `publishedAt`: Publication date (null for drafts)

## Usage

### Accessing the Admin Interface
1. Sign in to the Strapi admin interface
2. Ensure your user account exists in the `user.permissions.user` collection
3. Navigate to the "Product Management" menu item
4. Use the interface to manage products

### Creating Products
1. Click "Add Product" button
2. Fill in required fields (title, short_description)
3. Optionally fill in other fields
4. Select product state
5. Click "Create Product" (product will be saved as draft)

### Editing Products
1. Click the edit icon next to any product
2. Modify the desired fields
3. Click "Update Product"

### Deleting Products
1. Click the delete icon next to any product
2. Confirm the deletion in the dialog

## Security Considerations

- All admin operations require proper authentication
- User permissions are checked against a dedicated collection
- Write API key is used for all modifications
- Products are created as drafts by default (publishedAt = null)
- All API endpoints include proper error handling

## Development Notes

- The admin interface uses Strapi's design system components
- All operations respect the user preference for keeping products as drafts
- The interface includes proper loading states and error handling
- Responsive design ensures usability across different screen sizes
