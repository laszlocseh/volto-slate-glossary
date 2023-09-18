/**
 * SelectAutoComplete component.
 * @module components/manage/Widgets/SelectAutoComplete
 */

import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import { Icon } from '@plone/volto/components';
import {
  normalizeValue,
  normalizeChoices,
  convertValueToVocabQuery,
} from '@plone/volto/components/manage/Widgets/SelectUtils';

import {
  getVocabFromHint,
  getVocabFromField,
  getVocabFromItems,
} from '@plone/volto/helpers';
import { getVocabulary, getVocabularyTokenTitle } from '@plone/volto/actions';

import {
  //   Option,
  ClearIndicator,
  DropdownIndicator,
  // MultiValueContainer,
  selectTheme,
  customSelectStyles,
  MenuList,
} from '@plone/volto/components/manage/Widgets/SelectStyling';

import { FormFieldWrapper } from '@plone/volto/components';

import { GlossaryPopupValue } from '../../editor/render';

import checkSVG from '@plone/volto/icons/check.svg';
import checkBlankSVG from '@plone/volto/icons/check-blank.svg';

const messages = defineMessages({
  select: {
    id: 'Select…',
    defaultMessage: 'Select…',
  },
  no_options: {
    id: 'No options',
    defaultMessage: 'No options',
  },
  type_text: {
    id: 'Type text...',
    defaultMessage: 'Type text...',
  },
});

const MultiValueContainer = injectLazyLibs('reactSelect')((props) => {
  const { MultiValueContainer } = props.reactSelect.components;
  const glossaryTerm = props.data.label;
  const glossaryTermJSON =
    glossaryTerm !== undefined ? JSON.parse(glossaryTerm) : '';

  return (
    <Popup
      content={<GlossaryPopupValue glossaryTerm={glossaryTerm} />}
      trigger={
        <div {...props.innerProps}>
          <MultiValueContainer {...props}>
            {glossaryTermJSON?.term}
          </MultiValueContainer>
        </div>
      }
    />
  );
});

const Option = injectLazyLibs('reactSelect')((props) => {
  const { Option } = props.reactSelect.components;
  const color = props.isFocused && !props.isSelected ? '#b8c6c8' : '#007bc1';
  const svgIcon =
    props.isFocused || props.isSelected ? checkSVG : checkBlankSVG;

  return (
    <Option {...props}>
      <div>
        {/* {props.label} */}
        <GlossaryPopupValue glossaryTerm={props.label} />
      </div>
      <Icon name={svgIcon} size="20px" color={color} />
    </Option>
  );
});

/**
 * SelectAutoComplete component class.
 * @class SelectAutoComplete
 * @extends Component
 */
class SelectAutoComplete extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    required: PropTypes.bool,
    error: PropTypes.arrayOf(PropTypes.string),
    getVocabulary: PropTypes.func.isRequired,
    choices: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    ),
    items: PropTypes.shape({
      vocabulary: PropTypes.object,
    }),
    widgetOptions: PropTypes.shape({
      vocabulary: PropTypes.object,
    }),
    value: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    ),
    onChange: PropTypes.func.isRequired,
    wrapped: PropTypes.bool,
    isDisabled: PropTypes.bool,
    placeholder: PropTypes.string,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    description: null,
    required: false,
    items: {
      vocabulary: null,
    },
    widgetOptions: {
      vocabulary: null,
    },
    error: [],
    choices: [],
    value: null,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Actions
   */
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      searchLength: 0,
      termsPairsCache: [],
    };
  }

  componentDidMount() {
    const { id, lang, value, choices } = this.props;
    if (value && value?.length > 0) {
      const tokensQuery = convertValueToVocabQuery(
        normalizeValue(choices, value, this.props.intl),
      );

      this.props.getVocabularyTokenTitle({
        vocabNameOrURL: this.props.vocabBaseUrl,
        subrequest: `widget-${id}-${lang}`,
        ...tokensQuery,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { value, choices } = this.props;
    if (
      this.state.termsPairsCache.length === 0 &&
      value?.length > 0 &&
      choices?.length > 0
    ) {
      this.setState((state) => ({
        termsPairsCache: [...state.termsPairsCache, ...choices],
      }));
    }
  }

  // componentDidMount() {
  //   if (
  //     (!this.props.choices || this.props.choices?.length === 0) &&
  //     this.props.vocabBaseUrl
  //   ) {
  //     this.props.getVocabulary({
  //       vocabNameOrURL: this.props.vocabBaseUrl,
  //       size: -1,
  //       subrequest: this.props.lang,
  //     });
  //   }
  // }

  // componentDidUpdate(prevProps) {
  //   if (
  //     this.props.vocabBaseUrl !== prevProps.vocabBaseUrl &&
  //     (!this.props.choices || this.props.choices?.length === 0)
  //   ) {
  //     this.props.getVocabulary({
  //       vocabNameOrURL: this.props.vocabBaseUrl,
  //       size: -1,
  //       subrequest: this.props.lang,
  //     });
  //   }
  // }

  /**
   * Handle the field change, store it in the local state and back to simple
   * array of tokens for correct serialization
   * @method handleChange
   * @param {array} selectedOption The selected options (already aggregated).
   * @returns {undefined}
   */
  handleChange(selectedOption) {
    this.props.onChange(
      this.props.id,
      selectedOption ? selectedOption.map((item) => item.value) : null,
      // selectedOption ? selectedOption.value : null,
    );
    this.setState((state) => ({
      termsPairsCache: [...state.termsPairsCache, ...selectedOption],
    }));
  }

  timeoutRef = React.createRef();

  // How many characters to hold off searching from. Search tarts at this plus one.
  SEARCH_HOLDOFF = 2;

  loadOptions = (query) => {
    // Implement a debounce of 400ms and a min search of 3 chars
    if (query.length > this.SEARCH_HOLDOFF) {
      if (this.timeoutRef.current) clearTimeout(this.timeoutRef.current);
      return new Promise((resolve) => {
        this.timeoutRef.current = setTimeout(async () => {
          const res = await this.fetchAvailableChoices(query);
          resolve(res);
        }, 400);
      });
    } else {
      return Promise.resolve([]);
    }
  };

  fetchAvailableChoices = async (query) => {
    const resp = await this.props.getVocabulary({
      vocabNameOrURL: this.props.vocabBaseUrl,
      query,
      size: -1,
      subrequest: this.props.lang,
    });

    return normalizeChoices(resp.items || [], this.props.intl);
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const selectedOption = normalizeValue(
      this.state.termsPairsCache,
      this.props.value,
      this.props.intl,
    );
    const SelectAsync = this.props.reactSelectAsync.default;

    return (
      <FormFieldWrapper {...this.props}>
        <SelectAsync
          id={`field-${this.props.id}`}
          key={this.props.id}
          isDisabled={this.props.disabled || this.props.isDisabled}
          className="react-select-container"
          classNamePrefix="react-select"
          cacheOptions
          defaultOptions={[]}
          loadOptions={this.loadOptions}
          onInputChange={(search) =>
            this.setState({ searchLength: search.length })
          }
          noOptionsMessage={() =>
            this.props.intl.formatMessage(
              this.state.searchLength > this.SEARCH_HOLDOFF
                ? messages.no_options
                : messages.type_text,
            )
          }
          styles={customSelectStyles}
          theme={selectTheme}
          components={{
            ...(this.props.choices?.length > 25 && {
              MenuList,
            }),
            MultiValueContainer,
            ClearIndicator,
            DropdownIndicator,
            Option,
          }}
          value={selectedOption || []}
          placeholder={
            this.props.placeholder ??
            this.props.intl.formatMessage(messages.select)
          }
          onChange={this.handleChange}
          isMulti
          // isMulti={false}
        />
      </FormFieldWrapper>
    );
  }
}

export const SelectAutoCompleteComponent = injectIntl(SelectAutoComplete);

export default compose(
  injectIntl,
  injectLazyLibs(['reactSelectAsync']),
  connect(
    (state, props) => {
      const vocabBaseUrl =
        getVocabFromHint(props) ||
        getVocabFromField(props) ||
        getVocabFromItems(props);

      const vocabState =
        state.vocabularies?.[vocabBaseUrl]?.subrequests?.[
          `widget-${props.id}-${state.intl.locale}`
        ]?.items;

      // If the schema already has the choices in it, then do not try to get
      // the vocab, even if there is one
      return props.items?.choices
        ? { choices: props.items.choices, lang: state.intl.locale }
        : vocabState
        ? {
            choices: vocabState,
            vocabBaseUrl,
            lang: state.intl.locale,
          }
        : { vocabBaseUrl, lang: state.intl.locale };
    },
    { getVocabulary, getVocabularyTokenTitle },
  ),
)(SelectAutoComplete);
