import { GLOSSARY } from './constants';

export const withGLOSSARY = (editor) => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return element.type === GLOSSARY ? true : isInline(element);
  };

  return editor;
};
