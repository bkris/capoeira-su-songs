import {Row, Col} from "react-bootstrap";
import {isArray, isEmpty, uniq} from "lodash";
import Media from "./Media";
import LanguageSelector from "./LanguageSelector";
import {useState} from "react";

function Song({id, name, lyrics, translations = [], media, language='eng', descriptions=[]}) {
  const hasDescription = !isEmpty(descriptions);
  const translation = translations.find(translation => translation.language === language)
  const description = descriptions.find(desc => desc.language === language)
  const languages = uniq([...translations.map(_ => _.language), ...descriptions.map(_ => _.language)]);

  const [translationText, setTranslationText] = useState(translation ? translation.text : "");
  const [descriptionText, setDescriptionText] = useState(description ? description.text : "");

  const onLanguageChange = (lang) => {
    const translation = translations.find(translation => translation.language === lang);
    const description = descriptions.find(desc => desc.language === lang);

    setTranslationText(translation ? translation.text : "");
    setDescriptionText(description ? description.text : "");
  }

  const getMediaSection = () => {
    if (isEmpty(media)) {
      return <></>;
    }

    if (isArray(media)) {
      return media.map((m, i) => {
        return <Col key={`${id}-${i}`} md={{span: 8, offset: 2}} lg={{ span: 6, offset: 3 }} className="pb-3">
          <Media link={m.link} provider={m.provider} type={m.type}/>
        </Col>
      });
    }

    return <Col md={{span: 8, offset: 2}} lg={{ span: 6, offset: 3 }}>
      <Media link={media.link} provider={media.provider} type={media.type}/>
    </Col>
  }

  const mediaSection = getMediaSection();

  return (

    <Row className={'pb-5'} id={id}>
      <Col lg={12} className={'pb-3'}>
        <h4 className="d-flex justify-content-between border-bottom">
          <span>{name}</span>
          <LanguageSelector id={id} languages={languages} onLanguageChange={onLanguageChange}/>
        </h4>
      </Col>
      <Col lg={6}>
        <pre>{lyrics}</pre>
      </Col>
      <Col lg={6}>
        <pre>{translationText}</pre>
      </Col>

      { hasDescription && <Col lg={12}>{descriptionText}</Col> }

      {mediaSection}
    </Row>
  );
}

export default Song;
