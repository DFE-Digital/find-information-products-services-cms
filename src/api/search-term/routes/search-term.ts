/**
 * search-term router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/search-terms',
      handler: 'search-term.find',
      config: {
        auth: false, // Allow unauthenticated access for reading
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/search-terms/:id',
      handler: 'search-term.findOne',
      config: {
        auth: false, // Allow unauthenticated access for reading
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/search-terms',
      handler: 'search-term.create',
      config: {
        auth: false, // Allow unauthenticated access for logging
        policies: [],
        middlewares: [],
      },
    },
  ],
};
