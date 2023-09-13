import { Popup } from 'semantic-ui-react';
import cx from 'classnames';
import {
  serializeNodes,
  serializeNodesToText,
} from '@plone/volto-slate/editor/render';

export const GlossaryElement = (props) => {
  const { attributes, children, element, mode } = props;
  const { data = {} } = element;
  const { uid, popup_position } = data;

  console.log('data', data);
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
            {/* {serializeNodes(data.tooltip_content)} */}
            {data.glossary_term}
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
