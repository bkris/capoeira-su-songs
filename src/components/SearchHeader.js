import {Row, Col, InputGroup, FormControl} from "react-bootstrap";

function SearchHeader({onSearch}) {
  return (
    <Row className="sticky-top pt-3 pb-3 mb-1 header">
      <Col md={12}>
        <InputGroup>
          <FormControl
            placeholder="Search"
            aria-label="Search"
            onChange={onSearch}
          />
        </InputGroup>
      </Col>
    </Row>
  );
}

export default SearchHeader;
