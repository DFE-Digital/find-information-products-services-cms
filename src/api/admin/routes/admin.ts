export default {
  routes: [
    {
      method: 'GET',
      path: '/admin/products',
      handler: 'admin.find',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/admin/products/:id',
      handler: 'admin.findOne',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/admin/products',
      handler: 'admin.create',
      config: {
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/admin/products/:id',
      handler: 'admin.update',
      config: {
        auth: false,
      },
    },
    {
      method: 'DELETE',
      path: '/admin/products/:id',
      handler: 'admin.delete',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/admin/products/:id/publish',
      handler: 'admin.publish',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/admin/products/:id/unpublish',
      handler: 'admin.unpublish',
      config: {
        auth: false,
      },
    },
  ],
};
