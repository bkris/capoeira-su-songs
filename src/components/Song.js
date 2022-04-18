import {Row, Col} from "react-bootstrap";
import {isEmpty, uniq} from "lodash";
import LanguageSelector from "./LanguageSelector";
import {useState} from "react";
import MediaSection from "./MediaSection";

/**
 * Song component
 * @param {string} id
 * @param {string} name
 * @param {string} lyrics
 * @param {{language: string, text: string}[]} translations
 * @param {MediaInterface, MediaInterface[]} media
 * @param {string} language
 * @param {{language: string, text: string}[]} descriptions
 * @returns {JSX.Element}
 * @constructor
 */
export default function Song({
                id,
                name,
                lyrics,
                translations = [],
                media,
                language='eng',
                descriptions=[]
}) {
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

      { hasDescription && <Col lg={12} className="pb-3" dangerouslySetInnerHTML={{__html: descriptionText}}/> }

      <MediaSection media={media}/>
    </Row>
  );
}
