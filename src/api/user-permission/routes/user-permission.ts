import { factories } from '@strapi/strapi';

export default {
  routes: [
    {
      method: 'GET',
      path: '/user-permissions',
      handler: 'user-permission.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/user-permissions/:id',
      handler: 'user-permission.findOne',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/user-permissions',
      handler: 'user-permission.create',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/user-permissions/:id',
      handler: 'user-permission.update',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/user-permissions/:id',
      handler: 'user-permission.delete',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/user-permission/me',
      handler: 'user-permission.me',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
