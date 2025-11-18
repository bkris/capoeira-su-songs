import { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import RichTextEditor from './RichTextEditor';

const createEmptyTranslation = () => ({
  language: '',
  text: ''
});

const MEDIA_PROVIDER_OPTIONS = {
  audio: [
    { value: 'file', label: 'File upload' },
    { value: 'soundcloud', label: 'SoundCloud' }
  ],
  video: [
    { value: 'youtube', label: 'YouTube' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' }
  ]
};

const createEmptyMedia = () => ({
  type: '',
  provider: '',
  link: ''
});

const buildInitialSongData = () => ({
  id: '',
  name: '',
  lyrics: '',
  translations: [createEmptyTranslation()],
  media: [createEmptyMedia()]
});

function SongEditor() {
  const [songData, setSongData] = useState(() => buildInitialSongData());
  const [jsonOutput, setJsonOutput] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  const updateField = (field, value) => {
    setSongData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const updateMediaField = (index, field, value) => {
    setSongData((prev) => ({
      ...prev,
      media: prev.media.map((mediaItem, idx) => {
        if (idx !== index) {
          return mediaItem;
        }
        const updatedMedia = {
          ...mediaItem,
          [field]: value
        };
        if (field === 'type') {
          const validProviders = MEDIA_PROVIDER_OPTIONS[value]?.map((option) => option.value) || [];
          if (!validProviders.includes(updatedMedia.provider)) {
            updatedMedia.provider = '';
          }
        }
        return updatedMedia;
      })
    }));
  };

  const addMedia = () => {
    setSongData((prev) => ({
      ...prev,
      media: [...prev.media, createEmptyMedia()]
    }));
  };

  const removeMedia = (index) => {
    setSongData((prev) => {
      if (prev.media.length === 1) {
        return {
          ...prev,
          media: [createEmptyMedia()]
        };
      }
      return {
        ...prev,
        media: prev.media.filter((_, idx) => idx !== index)
      };
    });
  };

  const updateTranslation = (index, field, value) => {
    setSongData((prev) => ({
      ...prev,
      translations: prev.translations.map((translation, idx) => {
        if (idx !== index) {
          return translation;
        }
        return {
          ...translation,
          [field]: value
        };
      })
    }));
  };

  const addTranslation = () => {
    setSongData((prev) => ({
      ...prev,
      translations: [
        ...prev.translations,
        createEmptyTranslation()
      ]
    }));
  };

  const removeTranslation = (index) => {
    setSongData((prev) => {
      if (prev.translations.length === 1) {
        return {
          ...prev,
          translations: [createEmptyTranslation()]
        };
      }
      return {
        ...prev,
        translations: prev.translations.filter((_, idx) => idx !== index)
      };
    });
  };

  const handleSave = () => {
    const formattedTranslations = songData.translations
      .filter((translation) => translation.language.trim() || translation.text.trim())
      .map((translation) => ({
        language: translation.language.trim(),
        text: translation.text
      }));

    const formattedData = {
      id: songData.id === '' ? null : Number(songData.id),
      name: songData.name.trim(),
      lyrics: songData.lyrics,
      translations: formattedTranslations,
      media: songData.media
        .map((mediaItem) => ({
          type: mediaItem.type.trim(),
          provider: mediaItem.provider.trim(),
          link: mediaItem.link.trim()
        }))
        .filter((mediaItem) => mediaItem.type && mediaItem.provider && mediaItem.link)
    };

    setJsonOutput(JSON.stringify(formattedData, null, 2));
  };

  const handleReset = () => {
    setSongData(buildInitialSongData());
    setJsonOutput('');
    setCopyMessage('');
  };

  const handleCopy = async () => {
    if (!jsonOutput) {
      return;
    }
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard) {
        throw new Error('Clipboard API not available');
      }
      await navigator.clipboard.writeText(jsonOutput);
      setCopyMessage('Copied!');
      setTimeout(() => setCopyMessage(''), 2000);
    } catch (err) {
      setCopyMessage('Unable to copy');
    }
  };

  return (
    <Container fluid="lg" className="py-4 song-editor">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="mb-2">Song JSON Editor</h1>
          <p className="mb-0 text-muted">
            Capture every field that appears in the song collection, then export the structured JSON in one click.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button as={Link} to="/" variant="outline-secondary">Back to songs</Button>
          <Button variant="outline-warning" onClick={handleReset}>Reset</Button>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Header as="h2" className="h5 mb-0">Song metadata</Card.Header>
        <Card.Body>
          <Row className="g-4">
            <Col md={3}>
              <Form.Group controlId="songId">
                <Form.Label>Song ID</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={songData.id}
                  onChange={(event) => updateField('id', event.target.value)}
                  placeholder="e.g. 42"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="songName">
                <Form.Label>Song name</Form.Label>
                <Form.Control
                  type="text"
                  value={songData.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Add the canonical title"
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="songLyrics">
            <RichTextEditor
              label="Lyrics"
              value={songData.lyrics}
              onChange={(value) => updateField('lyrics', value)}
              placeholder="Compose or paste the full lyrics here..."
            />
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header as="h2" className="h5 mb-0 d-flex justify-content-between align-items-center">
          <span>Media entries</span>
          <Button size="sm" variant="outline-primary" onClick={addMedia}>
            Add media
          </Button>
        </Card.Header>
        <Card.Body>
          {songData.media.map((mediaItem, index) => {
            const providerOptions = MEDIA_PROVIDER_OPTIONS[mediaItem.type] || [];
            const providerDisabled = !mediaItem.type;
            return (
              <div key={`media-${index}`} className="media-block">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="h6 mb-0">Media #{index + 1}</h3>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => removeMedia(index)}
                  >
                    Remove
                  </Button>
                </div>
                <Row className="g-3 mb-3">
                  <Col md={3}>
                    <Form.Group controlId={`media-type-${index}`}>
                      <Form.Label>Type</Form.Label>
                      <Form.Select
                        value={mediaItem.type}
                        onChange={(event) => updateMediaField(index, 'type', event.target.value)}
                      >
                        <option value="">Select type</option>
                        <option value="audio">Audio</option>
                        <option value="video">Video</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId={`media-provider-${index}`}>
                      <Form.Label>Provider</Form.Label>
                      <Form.Select
                        value={mediaItem.provider}
                        onChange={(event) => updateMediaField(index, 'provider', event.target.value)}
                        disabled={providerDisabled}
                      >
                        <option value="">Select provider</option>
                        {providerOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId={`media-link-${index}`}>
                      <Form.Label>Link</Form.Label>
                      <Form.Control
                        type="text"
                        value={mediaItem.link}
                        placeholder="https://"
                        onChange={(event) => updateMediaField(index, 'link', event.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {index < songData.media.length - 1 && <hr />}
              </div>
            );
          })}
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header as="h2" className="h5 mb-0 d-flex justify-content-between align-items-center">
          <span>Translations</span>
          <Button size="sm" variant="outline-primary" onClick={addTranslation}>
            Add translation
          </Button>
        </Card.Header>
        <Card.Body>
          {songData.translations.map((translation, index) => (
            <div key={`translation-${index}`} className="translation-block">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="h6 mb-0">Translation #{index + 1}</h3>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => removeTranslation(index)}
                >
                  Remove
                </Button>
              </div>
              <Row className="g-3 mb-3">
                <Col md={3}>
                  <Form.Group controlId={`translation-lang-${index}`}>
                    <Form.Label>Language</Form.Label>
                    <Form.Control
                      type="text"
                      value={translation.language}
                      onChange={(event) => updateTranslation(index, 'language', event.target.value)}
                      placeholder="eng, por..."
                    />
                  </Form.Group>
                </Col>
                <Col md={9}>
                  <Form.Group controlId={`translation-text-${index}`}>
                    <RichTextEditor
                      label="Translated text"
                      value={translation.text}
                      onChange={(value) => updateTranslation(index, 'text', value)}
                      placeholder="Add the translated lyrics..."
                    />
                  </Form.Group>
                </Col>
              </Row>
              {index < songData.translations.length - 1 && <hr />}
            </div>
          ))}
        </Card.Body>
      </Card>

      <div className="d-flex gap-3 flex-wrap">
        <Button variant="success" onClick={handleSave}>
          Save &amp; build JSON
        </Button>
        {jsonOutput && (
          <Button variant="outline-secondary" onClick={handleCopy}>
            Copy JSON
          </Button>
        )}
        {copyMessage && <span className="text-muted align-self-center">{copyMessage}</span>}
      </div>

      {jsonOutput && (
        <Card className="mt-4">
          <Card.Header as="h2" className="h5 mb-0">JSON output</Card.Header>
          <Card.Body>
            <pre className="json-output mb-0">{jsonOutput}</pre>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default SongEditor;
