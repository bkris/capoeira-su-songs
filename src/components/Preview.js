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
        <div className="fs-3 fw-bolder pre-line" dangerouslySetInnerHTML={{__html: selectedSong.lyrics}}/>
      </Modal.Body>
    </Modal>
  );
}

export default Preview;
