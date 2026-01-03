import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Header({ showEditorShortcut = false, onCloseEditorMode }) {
  return (
    <Row className="mb-5">
      <Col md={8} className="d-flex ">
        <img src={process.env.PUBLIC_URL + '/logo192.png'} alt="Capoeira Subotica" className="logo"/>
        <div>
          <h2>Capoeira songs</h2>
          <p>Songs we practice at Capoeira Subotica group</p>
          <p>Most of the translations are auto translated with google translate. We do not keep responsibility of the
            accurate translation nor the ethical correctness.</p>
        </div>
      </Col>
      {showEditorShortcut && (
        <Col md={4} className="d-flex justify-content-md-end align-items-start mt-3 mt-md-0">
          <div className="d-flex gap-2">
            <Button as={Link} to="/editor" variant="primary">
              Open editor
            </Button>
            <Button variant="outline-secondary" onClick={onCloseEditorMode}>
              Close editor mode
            </Button>
          </div>
        </Col>
      )}
    </Row>
  );
}

export default Header;
