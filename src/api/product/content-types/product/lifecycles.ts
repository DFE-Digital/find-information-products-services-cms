/**
 * product lifecycle hooks
 */

export default {
  async beforeCreate(event) {
    const { data } = event.params;
    
    // Only set fips_id if it's not already provided
    if (!data.fips_id) {
      // Get the highest existing fips_id
      const existingProducts = await strapi.entityService.findMany('api::product.product', {
        fields: ['fips_id'],
        sort: { fips_id: 'desc' },
        limit: 1,
      });

      // Calculate the next fips_id
      const nextFipsId = existingProducts.length > 0 
        ? (Number(existingProducts[0].fips_id) || 0) + 1 
        : 1;

      // Set the fips_id
      data.fips_id = nextFipsId;
    }
  },
};
