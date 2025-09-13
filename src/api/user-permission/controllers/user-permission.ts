import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::user-permission.user-permission', ({ strapi }) => ({
  async find(ctx) {
    try {
      const { email } = ctx.query;
      
      if (!email) {
        return ctx.badRequest('Email parameter is required');
      }

      // Find user by email in user-permission collection
      const user = await strapi.entityService.findMany('api::user-permission.user-permission', {
        filters: { email }
      });

      return { data: user };
    } catch (error) {
      strapi.log.error('Error in user-permissions controller:', error);
      return ctx.internalServerError('Internal server error');
    }
  },

  async me(ctx) {
    try {
      const { user } = ctx.state;
      
      if (!user) {
        return ctx.unauthorized('You must be authenticated');
      }

      // Get full user data with role
      const fullUser = await strapi.entityService.findOne('plugin::users-permissions.user', user.id, {
        populate: ['role']
      });

      return fullUser;
    } catch (error) {
      strapi.log.error('Error getting current user:', error);
      return ctx.internalServerError('Internal server error');
    }
  }
}));
