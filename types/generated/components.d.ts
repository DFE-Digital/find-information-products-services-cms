import type { Schema, Struct } from '@strapi/strapi';

export interface SharedSynonym extends Struct.ComponentSchema {
  collectionName: 'components_shared_synonyms';
  info: {
    description: 'A single synonym term. Used consistently across multiple content types.';
    displayName: 'Synonym';
  };
  attributes: {
    term: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.synonym': SharedSynonym;
    }
  }
}
