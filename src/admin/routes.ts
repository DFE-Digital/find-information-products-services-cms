import { Route } from '@strapi/strapi/admin';

const adminRoutes: Route[] = [
  {
    Component: () => import('./app'),
    to: '/admin/products',
    exact: true,
  },
];

export default adminRoutes;
