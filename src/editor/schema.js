export const GlossarySchema = {
  title: 'Glossary',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['glossary_term', 'popup_position'],
    },
  ],
  properties: {
    glossary_term: {
      title: 'Glossary term',
      widget: 'autocompleteglossary',
      vocabulary: { '@id': 'eea.api.glossary.GlossaryTerms' },
    },
    popup_position: {
      title: 'Popup position',
      description: 'Position of the popup window',
      // type: 'string',
      factory: 'Choice',
      choices: [
        ['top center', 'top center'],
        ['top left', 'top left'],
        ['top right', 'top right'],
        ['bottom center', 'bottom center'],
        ['bottom left', 'bottom left'],
        ['bottom right', 'bottom right'],
        ['right center', 'right center'],
        ['left center', 'left center'],
      ],
    },
  },
  required: [],
};
