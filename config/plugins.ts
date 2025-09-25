export default ({ env }) => ({
  'schema-visualizer': {
    enabled: true,
  },

  upload: {
    config: {
      provider: '@strapi/provider-upload-azure-storage',
      providerOptions: {
        account: env('AZURE_STORAGE_ACCOUNT'),
        accountKey: env('AZURE_STORAGE_ACCOUNT_KEY'),
        serviceBaseURL: env('AZURE_STORAGE_URL'),
        containerName: env('AZURE_STORAGE_CONTAINER_NAME'),
        defaultPath: 'uploads',
        cdnBaseURL: env('AZURE_CDN_URL'), 
      },
    },
  },
});
