import {Modal} from "react-bootstrap";

/**
 *
 * @param {{id: number, name: string, lyrics: string}} selectedSong
 * @param {function} onHide
 * @return {JSX.Element}
 * @constructor
 */
function Preview({selectedSong, onHide}) {
  return (
    <Modal show={true} fullscreen={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedSong.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="fs-3 fw-bold pre-line">{selectedSong.lyrics}</div>
      </Modal.Body>
    </Modal>
  );
}

export default Preview;
