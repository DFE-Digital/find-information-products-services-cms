export default {
  // COMPLETELY DISABLED ALL LIFECYCLE HOOKS - EVEN beforeCreate IS CAUSING ISSUES
  // async beforeCreate(event) {
  //   const { data } = event.params;
  //   if (data) {
  //     (data as any).publishedAt = null;
  //   }
  // },

  // COMPLETELY DISABLED ALL OTHER LIFECYCLE HOOKS TO ISOLATE THE ISSUE
  // async afterCreate(event) {
  //   console.log('MINIMAL LIFECYCLE HOOK - afterCreate (doing nothing)');
  // },

  // async beforeUpdate(event) {
  //   console.log('MINIMAL LIFECYCLE HOOK - beforeUpdate (doing nothing)');
  // },

  // async afterUpdate(event) {
  //   console.log('MINIMAL LIFECYCLE HOOK - afterUpdate (doing nothing)');
  // },

  // async beforeDelete(event) {
  //   const { params } = event;
  //   if (params.auditData && params.auditData.action !== 'delete') {
  //     return;
  //   }
  //   try {
  //     const originalData = await strapi.entityService.findOne(event.model.uid, params.where.id, {
  //       populate: '*',
  //     });
  //     event.params.auditData = {
  //       action: 'delete',
  //       oldValues: originalData,
  //       newValues: null,
  //     };
  //   } catch (error) {
  //     strapi.log.warn('Could not fetch original data for audit logging:', error);
  //     event.params.auditData = {
  //       action: 'delete',
  //       oldValues: null,
  //       newValues: null,
  //     };
  //   }
  // },

  // async afterDelete(event) {
  //   try {
  //     const { params } = event;
  //     const auditData = params.auditData;
  //     if (auditData && strapi.service('api::audit-log.audit-log')) {
  //       const contentType = event.model.uid;
  //       const contentId = params.where?.id;
  //       if (!contentType || !contentId) {
  //         strapi.log.warn('Missing contentType or contentId for audit logging');
  //         return;
  //       }
  //       const userInfo = await strapi.service('api::audit-log.audit-log').getUserInfo(event);
  //       const requestInfo = await strapi.service('api::audit-log.audit-log').getRequestInfo(event);
  //       await strapi.service('api::audit-log.audit-log').logContentChange({
  //         action: auditData.action,
  //         contentType,
  //         contentId,
  //         userId: userInfo.userId,
  //         userEmail: userInfo.userEmail,
  //         oldValues: auditData.oldValues,
  //         newValues: auditData.newValues,
  //         changedFields: null,
  //         ipAddress: requestInfo.ipAddress,
  //         userAgent: requestInfo.userAgent,
  //       });
  //     }
  //   } catch (error) {
  //     strapi.log.error('Error in afterDelete lifecycle for audit logging:', error);
  //   }
  // },
};

