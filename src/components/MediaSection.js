import {Accordion, AccordionContext, Col} from "react-bootstrap";
import {isArray, isEmpty} from "lodash";
import Media from "./Media";
import {useContext} from "react";

/**
 * Renders the media section in songs component
 * @param {Media, Media[]} media
 * @returns {JSX.Element}
 * @constructor
 */
export default function MediaSection({media}) {
  if (isEmpty(media)) {
    return <></>;
  }

  /**
   * @param {Media} m
   * @param {number} index
   * @returns {JSX.Element}
   */
  const renderItem = (m, index = 0) => (
    <Accordion.Item eventKey={index.toString()} key={index}>
      <Accordion.Header style={{overflow: 'hidden'}}>{m.link}</Accordion.Header>
      <Accordion.Body>
        <RenderOnlyExpanded eventKey={index.toString()}>
          <Col md={{span: 8, offset: 2}} lg={{ span: 6, offset: 3 }}>
            <Media link={m.link} provider={m.provider} type={m.type}/>
          </Col>
        </RenderOnlyExpanded>
      </Accordion.Body>
    </Accordion.Item>
  )

  if (isArray(media)) {
    const items = media.map((m, i) => {
      return renderItem(m, i);
    });

    return <Accordion>{items}</Accordion>;
  }

  const item = renderItem(media);

  return <Accordion>{item}</Accordion>;
}

function RenderOnlyExpanded({ children, eventKey }) {
  const { activeEventKey } = useContext(AccordionContext);

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <>
      { isCurrentEventKey && children}
    </>
  );
}
