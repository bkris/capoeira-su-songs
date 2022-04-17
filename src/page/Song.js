import {Row, Col} from "react-bootstrap";
import {isNil} from "lodash";
import Media from "./Media";
import LanguageSelector from "./LanguageSelector";
import {useState} from "react";

function Song({id, name, lyrics, translations = [], media, language='eng'}) {
  const hasMedia = !isNil(media);
  const translation = translations.find(translation => translation.language === language)
  const languages = translations.map(_ => _.language);

  const [translationText, setTranslationText] = useState(translation ? translation.text : "");

  const onLanguageChange = (lang) => {
    const translation = translations.find(translation => translation.language === lang);
    setTranslationText(translation ? translation.text : "");
  }

  return (

    <Row className={'pb-4'} id={id}>
      <Col lg={12} className={'pb-3'}>
        <h4 className="d-flex justify-content-between border-bottom">
          <span>{name}</span>
          <LanguageSelector languages={languages} onLanguageChange={onLanguageChange}/>
        </h4>
      </Col>
      <Col lg={6}>
        <pre>{lyrics}</pre>
      </Col>
      <Col lg={6}>
        <pre>{translationText}</pre>
      </Col>
      { hasMedia && <Col md={{span: 8, offset: 2}} lg={{ span: 6, offset: 3 }}>
        <Media link={media.link} provider={media.provider} type={media.type}/>
      </Col> }
    </Row>
  );
}

export default Song;
