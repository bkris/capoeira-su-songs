import {Button} from "react-bootstrap";
import { FaArrowAltCircleUp } from 'react-icons/fa';

function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Button variant="outline-dark" className="position-fixed bottom-0 end-0 mb-2 me-2" onClick={scrollToTop}>
      <FaArrowAltCircleUp/>
    </Button>
  );
}

export default ScrollToTop;
