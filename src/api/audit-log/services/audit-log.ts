export default ({ strapi }) => ({
  async createAuditLog(data) {
    try {
      const auditLog = await strapi.entityService.create('api::audit-log.audit-log', {
        data: {
          ...data,
          timestamp: new Date(),
        },
      });
      return auditLog;
    } catch (error) {
      strapi.log.error('Failed to create audit log:', error);
      // Don't throw error to avoid breaking the main operation
      return null;
    }
  },

  async logContentChange({
    action,
    contentType,
    contentId,
    userId,
    userEmail,
    oldValues = null,
    newValues = null,
    changedFields = null,
    ipAddress = null,
    userAgent = null,
  }) {
    try {
      // Only log if there are actual changes
      if (action === 'update' && (!changedFields || changedFields.length === 0)) {
        return;
      }

      // Ensure we have required parameters
      if (!contentType || !contentId) {
        strapi.log.warn('Missing required parameters for audit logging:', { contentType, contentId });
        return;
      }

      return this.createAuditLog({
        action,
        content_type: contentType,
        content_id: contentId,
        user_id: userId,
        user_email: userEmail,
        old_values: oldValues,
        new_values: newValues,
        changed_fields: changedFields,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
    } catch (error) {
      strapi.log.error('Failed to log content change:', error);
      return null;
    }
  },

  getChangedFields(oldValues, newValues) {
    if (!oldValues || !newValues) return null;
    
    const changedFields = [];
    const allKeys = new Set([...Object.keys(oldValues), ...Object.keys(newValues)]);
    
    for (const key of allKeys) {
      const oldValue = oldValues[key];
      const newValue = newValues[key];
      
      // Deep comparison for objects
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changedFields.push(key);
      }
    }
    
    return changedFields;
  },

  async getUserInfo(event) {
    try {
      // Since lifecycle hooks don't have access to user context in Strapi v5,
      // we'll get the most recent user context from the middleware
      let userInfo = { userId: null, userEmail: null };
      
      if (strapi.auditContextMap && strapi.auditContextMap.size > 0) {
        // Get the most recent user context
        const contexts = Array.from(strapi.auditContextMap.values()) as Array<{
          userId: number;
          userEmail: string;
          ipAddress: string | null;
          userAgent: string | null;
          timestamp: number;
        }>;
        const mostRecent = contexts.sort((a, b) => b.timestamp - a.timestamp)[0];
        
        if (mostRecent) {
          userInfo = {
            userId: mostRecent.userId,
            userEmail: mostRecent.userEmail
          };
        }
      }
      
      // Debug logging
      console.log('=== AUDIT SERVICE DEBUG ===');
      console.log('Context map size:', strapi.auditContextMap?.size || 0);
      console.log('User ID:', userInfo.userId);
      console.log('User Email:', userInfo.userEmail);
      console.log('===========================');
      
      return userInfo;
    } catch (error) {
      strapi.log.warn('Could not get user info for audit logging:', error);
      return { userId: null, userEmail: null };
    }
  },

  async getRequestInfo(event) {
    try {
      // Get request info from the most recent context
      let requestInfo = { ipAddress: null, userAgent: null };
      
      if (strapi.auditContextMap && strapi.auditContextMap.size > 0) {
        const contexts = Array.from(strapi.auditContextMap.values()) as Array<{
          userId: number;
          userEmail: string;
          ipAddress: string | null;
          userAgent: string | null;
          timestamp: number;
        }>;
        const mostRecent = contexts.sort((a, b) => b.timestamp - a.timestamp)[0];
        
        if (mostRecent) {
          requestInfo = {
            ipAddress: mostRecent.ipAddress,
            userAgent: mostRecent.userAgent
          };
        }
      }
      
      return requestInfo;
    } catch (error) {
      strapi.log.warn('Could not get request info for audit logging:', error);
      return { ipAddress: null, userAgent: null };
    }
  },
});
