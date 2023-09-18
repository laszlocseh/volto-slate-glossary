import installGlossary from './editor';
import { GLOSSARY } from './editor/constants';
import SelectAutoComplete from './components/Widgets/SelectAutoComplete';

const applyConfig = (config) => {
  config.settings.glossary = [...(config.settings.glossary || []), GLOSSARY];
  config.widgets.widget.autocompleteglossary = SelectAutoComplete;

  return installGlossary(config);
};

export default applyConfig;
