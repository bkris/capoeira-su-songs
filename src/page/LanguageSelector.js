import {ButtonGroup, ToggleButton} from "react-bootstrap";
import {useState} from "react";

/**
 *
 * @param {string[]} languages
 * @param onLanguageChange
 * @returns {JSX.Element}
 * @constructor
 */
function LanguageSelector({languages = [], onLanguageChange}) {
  const [radioValue, setRadioValue] = useState('eng');

  if (languages.length <= 1) {
    return <></>;
  }

  return (
    <ButtonGroup className="mb-2">
      {languages.map((lng, idx) => (
        <ToggleButton
          key={idx}
          size="sm"
          id={`radio-${idx}`}
          type="radio"
          variant="outline-dark"
          name="radio"
          value={lng}
          checked={radioValue === lng}
          onChange={(e) => {
            console.log(e.currentTarget.value);
            setRadioValue(e.currentTarget.value);
            onLanguageChange(lng)
          }}
        >
          {lng}
        </ToggleButton>
      ))}
    </ButtonGroup>
  );
}
export default LanguageSelector;
