export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Debug: Log every request to see if middleware is running
    console.log('=== MIDDLEWARE RUNNING ===');
    console.log('URL:', ctx.request.url);
    console.log('Method:', ctx.request.method);
    console.log('Has state:', !!ctx.state);
    console.log('Has user:', !!ctx.state?.user);
    console.log('State keys:', ctx.state ? Object.keys(ctx.state) : 'no state');
    console.log('State object:', JSON.stringify(ctx.state, null, 2));
    console.log('========================');
    
    // Store user context in a global Map keyed by request ID
    const requestId = ctx.request.headers['x-request-id'] || 
                     ctx.request.headers['x-correlation-id'] || 
                     Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    if (ctx.state && ctx.state.user) {
      // Store user info in a global Map
      if (!strapi.auditContextMap) {
        strapi.auditContextMap = new Map();
      }
      
      strapi.auditContextMap.set(requestId, {
        userId: ctx.state.user.id,
        userEmail: ctx.state.user.email,
        ipAddress: ctx.request.ip || ctx.request.socket?.remoteAddress || null,
        userAgent: ctx.request.headers?.['user-agent'] || null,
        timestamp: Date.now()
      });
      
      console.log('=== MIDDLEWARE DEBUG ===');
      console.log('Request ID:', requestId);
      console.log('User ID:', ctx.state.user.id);
      console.log('User Email:', ctx.state.user.email);
      console.log('IP Address:', ctx.request.ip);
      console.log('========================');
    }

    await next();
    
    // Clean up after request (with delay to allow lifecycle hooks to access)
    setTimeout(() => {
      if (strapi.auditContextMap) {
        strapi.auditContextMap.delete(requestId);
      }
    }, 5000); // 5 second delay
  };
};
