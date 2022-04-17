import {Row, Col} from "react-bootstrap";
import slugify from "voca/slugify";

function TableOfContent({children , songs = []}) {
  const songList = songs.map(song => {
    const id = `#${slugify(song.name)}`;
    return (
      <li key={id}>
        <a href={id}>{song.name}</a>
      </li>
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
        <ul>
          {songList}
        </ul>
      </Col>
    </Row>
    </>
  );
}

export default TableOfContent;
