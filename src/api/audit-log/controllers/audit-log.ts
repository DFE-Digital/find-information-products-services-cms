export default ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;
    
    try {
      const auditLogs = await strapi.entityService.findMany('api::audit-log.audit-log', {
        ...query,
        populate: '*',
        sort: { timestamp: 'desc' },
      });
      
      return auditLogs;
    } catch (error) {
      return ctx.badRequest('Failed to fetch audit logs', { error: error.message });
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    
    try {
      const auditLog = await strapi.entityService.findOne('api::audit-log.audit-log', id, {
        populate: '*',
      });
      
      if (!auditLog) {
        return ctx.notFound('Audit log not found');
      }
      
      return auditLog;
    } catch (error) {
      return ctx.badRequest('Failed to fetch audit log', { error: error.message });
    }
  },

  async findByContentType(ctx) {
    const { contentType } = ctx.params;
    const { query } = ctx;
    
    try {
      const auditLogs = await strapi.entityService.findMany('api::audit-log.audit-log', {
        ...query,
        filters: {
          content_type: contentType,
        },
        populate: '*',
        sort: { timestamp: 'desc' },
      });
      
      return auditLogs;
    } catch (error) {
      return ctx.badRequest('Failed to fetch audit logs for content type', { error: error.message });
    }
  },

  async findByContentId(ctx) {
    const { contentType, contentId } = ctx.params;
    const { query } = ctx;
    
    try {
      const auditLogs = await strapi.entityService.findMany('api::audit-log.audit-log', {
        ...query,
        filters: {
          content_type: contentType,
          content_id: contentId,
        },
        populate: '*',
        sort: { timestamp: 'desc' },
      });
      
      return auditLogs;
    } catch (error) {
      return ctx.badRequest('Failed to fetch audit logs for content', { error: error.message });
    }
  },
});
