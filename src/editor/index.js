import { defineMessages } from 'react-intl'; // , defineMessages
import { makeInlineElementPlugin } from '@plone/volto-slate/elementEditor';
import { GlossarySchema } from './schema';
import { withGlossary } from './extensions';
import { GLOSSARY } from './constants';
import { GlossaryElement } from './render';
// import SchemaProvider from './SchemaProvider';
import blogSVG from '@plone/volto/icons/blog.svg';

// import './styles.less';

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
    toolbarButtonIcon: blogSVG,
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
