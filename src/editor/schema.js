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
      //   widget: 'object_by_path',
      type: 'string',
    },
    popup_position: {
      title: 'Popup position',
      description: 'Position of the popup window',
      type: 'string',
      factory: 'Choice',
      choices: [
        ['pointing', 'Up'],
        ['right pointing', 'Right'],
        ['left pointing', 'Left'],
        ['pointing below', 'Down'],
      ],
    },
  },
  required: [],
};
