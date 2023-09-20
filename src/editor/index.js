import { defineMessages } from 'react-intl'; // , defineMessages
import { makeInlineElementPlugin } from '@plone/volto-slate/elementEditor';
import { GlossarySchema } from './schema';
import { withGlossary } from './extensions';
import { GLOSSARY, GLOSSARYSVG } from './constants';
import { GlossaryElement } from './render';
// import SchemaProvider from './SchemaProvider';

const messages = defineMessages({
  edit: {
    id: 'Edit glossary',
    defaultMessage: 'Edit glossary',
  },
  delete: {
    id: 'Remove glossary',
    defaultMessage: 'Remove glossary',
  },
});

export default function install(config) {
  const opts = {
    pluginId: GLOSSARY,
    elementType: GLOSSARY,
    element: GlossaryElement, // DataEntityElement,
    isInlineElement: true,
    editSchema: GlossarySchema,
    // schemaProvider: SchemaProvider,
    extensions: [withGlossary],
    hasValue: (formData) => !!formData,
    toolbarButtonIcon: GLOSSARYSVG,
    title: 'Glossary',
    messages,
  };
  const [installGlossaryEditor] = makeInlineElementPlugin(opts);
  config = installGlossaryEditor(config);

  const { slate } = config.settings;

  slate.toolbarButtons = [...(slate.toolbarButtons || []), 'glossary'];
  slate.expandedToolbarButtons = [
    ...(slate.expandedToolbarButtons || []),
    'glossary',
  ];

  return config;
}
