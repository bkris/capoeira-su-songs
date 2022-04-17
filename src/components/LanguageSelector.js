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
  const componentId = Math.ceil(Math.random() * 1000);

  if (languages.length <= 1) {
    return <></>;
  }

  const handleLanguageChange = (e) => {
    setRadioValue(e.currentTarget.value);
    onLanguageChange(e.currentTarget.value);
  }

  const buttons = languages.map((lng, idx) => {
    const buttonId = `${componentId}-${idx}`;
    return (
      <ToggleButton
        key={buttonId}
        size="sm"
        id={buttonId}
        type="radio"
        variant="outline-dark"
        name="radio"
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
