import installGlossary from './editor';
import { GLOSSARY } from './editor/constants';

const applyConfig = (config) => {
  config.settings.glossary = [...(config.settings.glossary || []), GLOSSARY];
  return installGlossary(config);
};

export default applyConfig;
