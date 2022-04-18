import {ButtonGroup, ToggleButton} from "react-bootstrap";
import {useState} from "react";

/**
 * @param {string} id
 * @param {string[]} languages
 * @param onLanguageChange
 * @returns {JSX.Element}
 * @constructor
 */
function LanguageSelector({id, languages = [], onLanguageChange}) {
  const [radioValue, setRadioValue] = useState('eng');

  if (languages.length <= 1) {
    return <></>;
  }

  const handleLanguageChange = (e) => {
    setRadioValue(e.currentTarget.value);
    onLanguageChange(e.currentTarget.value);
  }

  const buttons = languages.map((lng, idx) => {
    const buttonId = `${id}-${idx}`;
    return (
      <ToggleButton
        key={buttonId}
        size="sm"
        id={buttonId}
        type="radio"
        variant="outline-dark"
        name={buttonId}
        value={lng}
        checked={radioValue === lng}
        onChange={handleLanguageChange}
      >
        {lng}
      </ToggleButton>
    )
  })

  return (
    <ButtonGroup className="mb-2">
      {buttons}
    </ButtonGroup>
  );
}
export default LanguageSelector;
