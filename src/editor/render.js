import { Popup } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import cx from 'classnames';
import { GLOSSARYSVG } from './constants';
import './style.less';

export const GlossaryPopupValue = (props) => {
  const { glossaryTerm } = props;

  const glossaryTermJSON =
    glossaryTerm !== undefined ? JSON.parse(glossaryTerm) : '';

  return glossaryTermJSON ? (
    <div>
      <div>
        <b>{glossaryTermJSON['term']}</b>
      </div>
      <div>{glossaryTermJSON['definition']}</div>
      <div>
        <span>
          <b>Source: </b>
        </span>
        <span>{glossaryTermJSON['source']}</span>
      </div>
    </div>
  ) : (
    ''
  );
};

export const GlossaryElement = (props) => {
  const { attributes, children, element, mode } = props;
  const { data = {} } = element;
  const { uid, popup_position } = data;

  const glossaryTerm = data?.glossary_term || '';

  return (
    <>
      {mode === 'view' ? (
        <span id={`ref-${uid}`} aria-describedby="slate-label">
          <Popup
            position={popup_position}
            on="hover"
            trigger={
              <span
                id={`label_ref-${uid}`}
                {...attributes}
                className={cx(popup_position, 'slate-popup-item glossary-item')}
              >
                {children}
                <Icon
                  name={GLOSSARYSVG}
                  size="14px"
                  className="glossary-icon"
                />
              </span>
            }
            className={popup_position}
          >
            <GlossaryPopupValue
              glossaryTerm={glossaryTerm ? glossaryTerm : ''}
              // glossaryTerm={glossaryTerm ? glossaryTerm[0] : ''}
            />
          </Popup>
        </span>
      ) : (
        <span
          id={`label_ref-${uid}`}
          {...attributes}
          className="slate-popup-item glossary-item"
        >
          {children}
        </span>
      )}
    </>
  );
};
