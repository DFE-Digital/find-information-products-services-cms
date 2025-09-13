module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Skip auth for public endpoints
    if (ctx.request.url.includes('/api/user-permissions') && ctx.request.method === 'GET') {
      return await next();
    }

    // Check if user is authenticated
    const { user } = ctx.state;
    
    if (!user) {
      return ctx.unauthorized('You must be authenticated to access this resource');
    }

    // For admin endpoints, check if user has admin permissions
    if (ctx.request.url.includes('/admin/')) {
      // Check if user exists in user.permissions.user collection
      const userPermission = await strapi.entityService.findMany('api::user-permission.user-permission', {
        filters: { 
          email: user.email,
          is_active: true 
        }
      });

      if (!userPermission || userPermission.length === 0) {
        return ctx.forbidden('You do not have permission to access admin functionality');
      }
    }

    await next();
  };
};
