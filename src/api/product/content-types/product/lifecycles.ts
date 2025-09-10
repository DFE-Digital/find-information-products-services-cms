export default {
  async beforeCreate(event) {
    const { data } = event.params;

    if (!data.fips_id) {
      const [latest] = await strapi.db.query('api::product.product').findMany({
        select: ['fips_id'],
        orderBy: { fips_id: 'desc' },
        limit: 1,
      });

      data.fips_id = latest ? (Number(latest.fips_id) || 0) + 1 : 1;
    }
  },
};
