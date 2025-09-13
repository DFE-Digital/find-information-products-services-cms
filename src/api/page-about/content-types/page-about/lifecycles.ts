export default {
  async beforeCreate(event) {
    // Store original data for audit logging
    event.params.auditData = {
      action: 'create',
      oldValues: null,
      newValues: event.params.data,
    };
  },

  async afterCreate(event) {
    const { result, params } = event;
    const auditData = params.auditData;
    
    if (auditData && strapi.service('api::audit-log.audit-log')) {
      const contentType = event.model.uid;
      const contentId = result.id;
      
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
  },

  async beforeUpdate(event) {
    const { params } = event;
    
    // Get the original data for comparison
    try {
      const originalData = await strapi.entityService.findOne(event.model.uid, params.where.id, {
        populate: '*',
      });
      
      // Store original data for audit logging
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
    const { result, params } = event;
    const auditData = params.auditData;
    
    if (auditData && strapi.service('api::audit-log.audit-log')) {
      const contentType = event.model.uid;
      const contentId = result.id;
      
        // Get user info from global context set by middleware
        const userInfo = await strapi.service('api::audit-log.audit-log').getUserInfo(event);
        const requestInfo = await strapi.service('api::audit-log.audit-log').getRequestInfo(event);
      
      // Calculate changed fields
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
    const { params } = event;
    const auditData = params.auditData;
    
    if (auditData && strapi.service('api::audit-log.audit-log')) {
      const contentType = event.model.uid;
      const contentId = params.where.id;
      
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
  },

};