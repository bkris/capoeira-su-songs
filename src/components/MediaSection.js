import { Accordion, AccordionContext, Col } from 'react-bootstrap';
import { isArray, isEmpty } from 'lodash';
import { useContext } from 'react';
import { FaFacebook, FaFileAudio, FaInstagram, FaLink, FaSoundcloud, FaTiktok, FaYoutube } from 'react-icons/fa';
import Media from './Media';

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

  const providerIconMap = {
    youtube: FaYoutube,
    facebook: FaFacebook,
    instagram: FaInstagram,
    tiktok: FaTiktok,
    soundcloud: FaSoundcloud,
    file: FaFileAudio
  };

  const renderHeaderLabel = (mediaItem) => {
    const providerKey = (mediaItem.provider || '').toLowerCase();
    const Icon = providerIconMap[providerKey] || FaLink;
    return (
      <div className="d-flex align-items-center gap-2 w-100 text-truncate">
        <Icon className="flex-shrink-0 text-muted" title={providerKey || 'link'} aria-hidden="true" />
        <span className="text-truncate">{mediaItem.link}</span>
      </div>
    );
  };

  /**
   * @param {Media} m
   * @param {number} index
   * @returns {JSX.Element}
   */
  const renderItem = (m, index = 0) => (
    <Accordion.Item eventKey={index.toString()} key={index}>
      <Accordion.Header style={{ overflow: 'hidden' }}>{renderHeaderLabel(m)}</Accordion.Header>
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
