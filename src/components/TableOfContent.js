import {Row, Col, ListGroup} from "react-bootstrap";
import slugify from "voca/slugify";

function TableOfContent({children , songs = []}) {
  const songList = songs.map((song, index) => {
    const id = `#${slugify(song.name)}`;
    return (
      <ListGroup.Item key={index} action href={id} className="d-flex justify-content-between">
        <span>{index + 1}. {song.name}</span>{song.type && <span>{song.type}</span>}
      </ListGroup.Item>
    )
  })

  return (
    <>
    <Row>
      <Col>
        <h3>Table of content</h3>
      </Col>
    </Row>
    {children}
    <Row className="mb-5">
      <Col xs={12}>
        <ListGroup>
          {songList}
        </ListGroup>
      </Col>
    </Row>
    </>
  );
}

export default TableOfContent;
