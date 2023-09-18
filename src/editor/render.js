import { Popup } from 'semantic-ui-react';
import cx from 'classnames';

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
            // open={data.always_show || undefined}
            // on={!data.always_show ? 'hover' : undefined}
            on="hover"
            trigger={
              <span
                id={`label_ref-${uid}`}
                {...attributes}
                className={cx(popup_position, 'label-node with-popup')}
              >
                {children}
              </span>
            }
            className={popup_position}
          >
            <GlossaryPopupValue
              glossaryTerm={glossaryTerm ? glossaryTerm[0] : ''}
              // glossaryTerm={glossaryTerm ? glossaryTerm : ''}
            />
          </Popup>
        </span>
      ) : (
        <span
          id={`label_ref-${uid}`}
          {...attributes}
          className="label-node with-popup"
        >
          {children}
        </span>
      )}
    </>
  );
};
