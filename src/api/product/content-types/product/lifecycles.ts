export default {
  async beforeCreate(event) {
    const { data } = event.params;

    if (data) {
      // 🔒 Always force draft
      (data as any).publishedAt = null;

      if (!data.fips_id) {
        const [latest] = await strapi.db.query('api::product.product').findMany({
          select: ['fips_id'],
          orderBy: { fips_id: 'desc' },
          limit: 1,
        });

        data.fips_id = latest ? (Number(latest.fips_id) || 0) + 1 : 1;
      }

      event.params.auditData = {
        action: 'create',
        oldValues: null,
        newValues: data,
      };
    }
  },

  async afterCreate(event) {
    try {
      const { result, params } = event;
      const auditData = params.auditData;
      if (auditData && strapi.service('api::audit-log.audit-log')) {
        const contentType = event.model.uid;
        const contentId = result?.id;
        if (!contentType || !contentId) {
          strapi.log.warn('Missing contentType or contentId for audit logging');
          return;
        }
        const userInfo = await strapi.service('api::audit-log.audit-log').getUserInfo(event);
        const requestInfo = await strapi.service('api::audit-log.audit-log').getRequestInfo(event);
        await strapi.service('api::audit-log.audit-log').logContentChange({
          action: auditData.action,
          contentType,
          contentId,
          userId: userInfo.userId,
          userEmail: userInfo.userEmail,
          oldValues: auditData.oldValues,
          newValues: auditData.newValues,
          changedFields: null,
          ipAddress: requestInfo.ipAddress,
          userAgent: requestInfo.userAgent,
        });
      }
    } catch (error) {
      strapi.log.error('Error in afterCreate lifecycle for audit logging:', error);
    }
  },

  async beforeUpdate(event) {
    const { params } = event;

    if (params?.data) {
      // 🔒 Always force draft
      (params.data as any).publishedAt = null;
    }

    try {
      const originalData = await strapi.entityService.findOne(
        event.model.uid,
        params.where.id,
        { populate: '*' }
      );

      event.params.auditData = {
        action: 'update',
        oldValues: originalData,
        newValues: params.data,
      };
    } catch (error) {
      strapi.log.warn('Could not fetch original data for audit logging:', error);
      event.params.auditData = {
        action: 'update',
        oldValues: null,
        newValues: params.data,
      };
    }
  },

  async afterUpdate(event) {
    try {
      const { result, params } = event;
      const auditData = params.auditData;
      if (auditData && strapi.service('api::audit-log.audit-log')) {
        const contentType = event.model.uid;
        const contentId = result?.id;
        if (!contentType || !contentId) {
          strapi.log.warn('Missing contentType or contentId for audit logging');
          return;
        }
        const userInfo = await strapi.service('api::audit-log.audit-log').getUserInfo(event);
        const requestInfo = await strapi.service('api::audit-log.audit-log').getRequestInfo(event);
        const changedFields = strapi.service('api::audit-log.audit-log').getChangedFields(
          auditData.oldValues,
          auditData.newValues
        );
        await strapi.service('api::audit-log.audit-log').logContentChange({
          action: auditData.action,
          contentType,
          contentId,
          userId: userInfo.userId,
          userEmail: userInfo.userEmail,
          oldValues: auditData.oldValues,
          newValues: auditData.newValues,
          changedFields,
          ipAddress: requestInfo.ipAddress,
          userAgent: requestInfo.userAgent,
        });
      }
    } catch (error) {
      strapi.log.error('Error in afterUpdate lifecycle for audit logging:', error);
    }
  },

  async beforeDelete(event) {
    const { params } = event;
    
    // Don't overwrite existing audit data from other operations
    if (params.auditData && params.auditData.action !== 'delete') {
      return; // Skip if audit data already exists for a different action
    }
    
    // Get the original data for audit logging
    try {
      const originalData = await strapi.entityService.findOne(event.model.uid, params.where.id, {
        populate: '*',
      });
      
      // Store original data for audit logging
      event.params.auditData = {
        action: 'delete',
        oldValues: originalData,
        newValues: null,
      };
    } catch (error) {
      strapi.log.warn('Could not fetch original data for audit logging:', error);
      event.params.auditData = {
        action: 'delete',
        oldValues: null,
        newValues: null,
      };
    }
  },

  async afterDelete(event) {
    try {
      const { params } = event;
      const auditData = params.auditData;
      
      if (auditData && strapi.service('api::audit-log.audit-log')) {
        const contentType = event.model.uid;
        const contentId = params.where?.id;
        
        if (!contentType || !contentId) {
          strapi.log.warn('Missing contentType or contentId for audit logging');
          return;
        }
        
        // Get user info from global context set by middleware
        const userInfo = await strapi.service('api::audit-log.audit-log').getUserInfo(event);
        const requestInfo = await strapi.service('api::audit-log.audit-log').getRequestInfo(event);
        
        await strapi.service('api::audit-log.audit-log').logContentChange({
          action: auditData.action,
          contentType,
          contentId,
          userId: userInfo.userId,
          userEmail: userInfo.userEmail,
          oldValues: auditData.oldValues,
          newValues: auditData.newValues,
          changedFields: null,
          ipAddress: requestInfo.ipAddress,
          userAgent: requestInfo.userAgent,
        });
      }
    } catch (error) {
      strapi.log.error('Error in afterDelete lifecycle for audit logging:', error);
      // Don't throw the error to avoid breaking the main operation
    }
  },

};
