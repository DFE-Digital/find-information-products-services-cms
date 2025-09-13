import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  async find(ctx) {
    try {
      // Get products with full population
      const products = await strapi.entityService.findMany('api::product.product', {
        populate: {
          category_values: {
            populate: ['category_type']
          },
          product_contacts: true
        },
        sort: { createdAt: 'desc' }
      });

      return { data: products };
    } catch (error) {
      strapi.log.error('Error fetching products in admin:', error);
      return ctx.internalServerError('Failed to fetch products');
    }
  },

  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      
      const product = await strapi.entityService.findOne('api::product.product', id, {
        populate: {
          category_values: {
            populate: ['category_type']
          },
          product_contacts: true
        }
      });

      if (!product) {
        return ctx.notFound('Product not found');
      }

      return { data: product };
    } catch (error) {
      strapi.log.error('Error fetching product in admin:', error);
      return ctx.internalServerError('Failed to fetch product');
    }
  },

  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      
      if (!data) {
        return ctx.badRequest('Product data is required');
      }

      // Ensure product is created as draft
      const productData = {
        ...data,
        publishedAt: null // Keep as draft per user preference
      };

      const product = await strapi.entityService.create('api::product.product', {
        data: productData,
        populate: {
          category_values: {
            populate: ['category_type']
          },
          product_contacts: true
        }
      });

      return { data: product };
    } catch (error) {
      strapi.log.error('Error creating product in admin:', error);
      return ctx.internalServerError('Failed to create product');
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;
      
      if (!data) {
        return ctx.badRequest('Product data is required');
      }

      // Ensure product remains as draft unless explicitly published
      const productData = {
        ...data,
        publishedAt: data.publishedAt || null
      };

      const product = await strapi.entityService.update('api::product.product', id, {
        data: productData,
        populate: {
          category_values: {
            populate: ['category_type']
          },
          product_contacts: true
        }
      });

      if (!product) {
        return ctx.notFound('Product not found');
      }

      return { data: product };
    } catch (error) {
      strapi.log.error('Error updating product in admin:', error);
      return ctx.internalServerError('Failed to update product');
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;
      
      const product = await strapi.entityService.delete('api::product.product', id);
      
      if (!product) {
        return ctx.notFound('Product not found');
      }

      return { data: product };
    } catch (error) {
      strapi.log.error('Error deleting product in admin:', error);
      return ctx.internalServerError('Failed to delete product');
    }
  },

  async publish(ctx) {
    try {
      const { id } = ctx.params;
      
      const product = await strapi.entityService.update('api::product.product', id, {
        data: {
          publishedAt: new Date()
        }
      });

      if (!product) {
        return ctx.notFound('Product not found');
      }

      return { data: product };
    } catch (error) {
      strapi.log.error('Error publishing product in admin:', error);
      return ctx.internalServerError('Failed to publish product');
    }
  },

  async unpublish(ctx) {
    try {
      const { id } = ctx.params;
      
      const product = await strapi.entityService.update('api::product.product', id, {
        data: {
          publishedAt: null
        }
      });

      if (!product) {
        return ctx.notFound('Product not found');
      }

      return { data: product };
    } catch (error) {
      strapi.log.error('Error unpublishing product in admin:', error);
      return ctx.internalServerError('Failed to unpublish product');
    }
  }
}));
