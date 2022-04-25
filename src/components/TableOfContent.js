import {Row, Col, ListGroup} from "react-bootstrap";

/**
 * @param children
 * @param {SongInterface[]} songs
 * @returns {JSX.Element}
 * @constructor
 */
function TableOfContent({children , songs = []}) {
  const setPageTitle = (name) => window.document.title = `${name} - Capoeira Subotica Songs`;

  const songList = songs.map((song, index) => {
    const id = `#${song.id}`;
    return (
      <ListGroup.Item key={index}
                      action
                      href={id}
                      className="d-flex justify-content-between"
                      data-song-name={song.name}
                      data-song-id={id}
                      onClick={() => setPageTitle(song.name)}>
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
