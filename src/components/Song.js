import {Row, Col, Button} from "react-bootstrap";
import {isEmpty, uniq} from "lodash";
import LanguageSelector from "./LanguageSelector";
import {useEffect, useState} from "react";
import MediaSection from "./MediaSection";
import {AiOutlineFullscreen} from "react-icons/ai";
import {LanguageService} from "../language.service";

/**
 * Song component
 * @param {string} id
 * @param {string} name
 * @param {string} lyrics
 * @param {SongType} type
 * @param {Translated[]} translations
 * @param {Media, Media[]} media
 * @param {Language} language
 * @param {Translated[]} [descriptions]
 * @param onFullScreen
 * @returns {JSX.Element}
 * @constructor
 */
export default function Song({
                id,
                name,
                lyrics,
                type,
                translations = [],
                media,
                descriptions=[],
                onFullScreen
}) {
  const language = LanguageService.getLanguage();
  const hasDescription = !isEmpty(descriptions);
  const translation = translations.find(translation => translation.language === language)
  const description = descriptions.find(desc => desc.language === language)
  const languages = uniq([...translations.map(_ => _.language), ...descriptions.map(_ => _.language)]);

  const [translationText, setTranslationText] = useState(translation ? translation.text : "");
  const [descriptionText, setDescriptionText] = useState(description ? description.text : "");
  const getIsDesktop = () => {
    if (typeof window === 'undefined') {
      return true;
    }
    return window.innerWidth >= 992;
  };
  const canDeferTranslation = languages.length > 1;
  const [isDesktop, setIsDesktop] = useState(getIsDesktop);
  const [showTranslation, setShowTranslation] = useState(() => canDeferTranslation ? getIsDesktop() : true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const handleResize = () => setIsDesktop(getIsDesktop());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setShowTranslation(true);
    }
  }, [isDesktop]);

  useEffect(() => {
    if (!canDeferTranslation) {
      setShowTranslation(true);
    }
  }, [canDeferTranslation]);

  const onLanguageChange = (lang) => {
    const translation = translations.find(translation => translation.language === lang);
    const description = descriptions.find(desc => desc.language === lang);

    LanguageService.storeLanguage(lang);

    setTranslationText(translation ? translation.text : "");
    setDescriptionText(description ? description.text : "");
    if (!isDesktop && canDeferTranslation) {
      setShowTranslation(true);
    }
  }

  const onLanguageSelectorToggle = () => {
    if (!isDesktop && canDeferTranslation) {
      setShowTranslation(true);
    }
  };

  return (
    <Row className={'pb-5'} id={id}>
      <Col lg={12} className={'pb-3'}>
        <h4 className="d-flex justify-content-between border-bottom">
          <span>{name} &nbsp; {type && <span className="badge bg-secondary">{type}</span>}</span>
          <div>
            <Button size="sm" className="me-2 mb-2" onClick={() => onFullScreen({id, name, lyrics})}
                    variant="outline-dark" ><AiOutlineFullscreen/></Button>
            <LanguageSelector
              id={id}
              languages={languages}
              onLanguageChange={onLanguageChange}
              onToggle={onLanguageSelectorToggle}
            />
          </div>
        </h4>
      </Col>
      <Col lg={6} className="pre-line pb-3">
        <div className="p-3 bg-light" dangerouslySetInnerHTML={{__html: lyrics}}/>
      </Col>
      {showTranslation && (
        <Col lg={6} className="pre-line pb-3">
          <div className="p-3 bg-light" dangerouslySetInnerHTML={{__html: translationText}}/>
        </Col>
      )}

      { hasDescription && <Col lg={12} className="pb-3 pre-line" dangerouslySetInnerHTML={{__html: descriptionText}}/> }

      <MediaSection media={media}/>
    </Row>
  );
}
