import {Row, Col} from "react-bootstrap";

function Header() {
  return (
    <Row className="mb-5">
      <Col md={3}>
        <img src={process.env.PUBLIC_URL + '/logo192.png'} alt="Capoeira Subotica"/>
      </Col>
      <Col md={9}>
        <h2>Capoeira songs</h2>
        <p>Songs we practice at Capoeira Subotica group</p>
        <p>Most of the translations are auto translated with google translate. We do not keep responsibility of the
          accurate translation nor the ethical correctness.</p>
      </Col>
    </Row>
  );
}

export default Header;
