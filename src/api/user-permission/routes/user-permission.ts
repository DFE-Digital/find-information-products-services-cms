import { factories } from '@strapi/strapi';

export default {
  routes: [
    {
      method: 'GET',
      path: '/user-permission',
      handler: 'user-permission.find',
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
