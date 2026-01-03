import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import RichTextEditor from './RichTextEditor';
import { getSortedSongs } from '../song.service';

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
  name: '',
  lyrics: '',
  translations: [createEmptyTranslation()],
  media: [createEmptyMedia()],
  descriptions: [createEmptyTranslation()]
});

const normalizeTranslatedList = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return [createEmptyTranslation()];
  }
  return items.map((item) => ({
    language: item?.language || '',
    text: item?.text || ''
  }));
};

const normalizeMediaList = (items) => {
  if (!items) {
    return [createEmptyMedia()];
  }
  if (Array.isArray(items)) {
    const formatted = items.map((item) => ({
      type: item?.type || '',
      provider: item?.provider || '',
      link: item?.link || ''
    }));
    return formatted.length > 0 ? formatted : [createEmptyMedia()];
  }
  return [{
    type: items?.type || '',
    provider: items?.provider || '',
    link: items?.link || ''
  }];
};

const buildSongDataFromExisting = (song) => ({
  name: song?.name || '',
  lyrics: song?.lyrics || '',
  translations: normalizeTranslatedList(song?.translations),
  descriptions: normalizeTranslatedList(song?.descriptions),
  media: normalizeMediaList(song?.media)
});

function SongEditor() {
  const location = useLocation();
  const [songData, setSongData] = useState(() => buildInitialSongData());
  const [jsonOutput, setJsonOutput] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const songIdFromQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('songId');
  }, [location.search]);
  const selectedSong = useMemo(() => {
    if (!songIdFromQuery) {
      return null;
    }
    const preparedSongs = getSortedSongs('name', 'asc');
    return preparedSongs.find((song) => song.id === songIdFromQuery) || null;
  }, [songIdFromQuery]);

  useEffect(() => {
    if (selectedSong) {
      setSongData(buildSongDataFromExisting(selectedSong));
      setJsonOutput('');
      setCopyMessage('');
      return;
    }
    if (!songIdFromQuery) {
      setSongData(buildInitialSongData());
      setJsonOutput('');
      setCopyMessage('');
    }
  }, [selectedSong, songIdFromQuery]);

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

  const updateDescriptions = (index, field, value) => {
    setSongData((prev) => ({
      ...prev,
      descriptions: prev.descriptions.map((description, idx) => {
        if (idx !== index) {
          return description;
        }
        return {
          ...description,
          [field]: value
        };
      })
    }));
  };

  const addDescription = () => {
    setSongData((prev) => ({
      ...prev,
      descriptions: [...prev.descriptions, createEmptyTranslation()]
    }));
  };

  const removeDescription = (index) => {
    setSongData((prev) => {
      if (prev.descriptions.length === 1) {
        return {
          ...prev,
          descriptions: [createEmptyTranslation()]
        };
      }
      return {
        ...prev,
        descriptions: prev.descriptions.filter((_, idx) => idx !== index)
      };
    });
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
    console.log("asdadas")
    const formattedTranslations = songData.translations
      .filter((translation) => translation.language.trim() || translation.text.trim())
      .map((translation) => ({
        language: translation.language.trim(),
        text: translation.text
      }));

    const formattedDescriptions = songData.descriptions
      .filter((description) => description.language.trim() || description.text.trim())
      .map((description) => ({
        language: description.language.trim(),
        text: description.text
      }));

    const formattedData = {
      name: songData.name.trim(),
      lyrics: songData.lyrics,
      translations: formattedTranslations,
      descriptions: formattedDescriptions,
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
    if (selectedSong) {
      setSongData(buildSongDataFromExisting(selectedSong));
    } else {
      setSongData(buildInitialSongData());
    }
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
            <Col md={8}>
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
                    <Form.Select
                      value={translation.language}
                      onChange={(event) => updateTranslation(index, 'language', event.target.value)}
                    >
                      <option value="">Select language</option>
                      <option value="eng">English</option>
                      <option value="hun">Hungarian</option>
                      <option value="ser">Serbian</option>
                    </Form.Select>
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
          <span>Descriptions</span>
          <Button size="sm" variant="outline-primary" onClick={addDescription}>
            Add description
          </Button>
        </Card.Header>
        <Card.Body>
          {songData.descriptions.map((description, index) => (
            <div key={`description-${index}`} className="description-block">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="h6 mb-0">Description #{index + 1}</h3>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => removeDescription(index)}
                >
                  Remove
                </Button>
              </div>
              <Row className="g-3 mb-3">
                <Col md={3}>
                  <Form.Group controlId={`description-lang-${index}`}>
                    <Form.Label>Language</Form.Label>
                    <Form.Select
                      value={description.language}
                      onChange={(event) => updateDescriptions(index, 'language', event.target.value)}
                    >
                      <option value="">Select language</option>
                      <option value="eng">English</option>
                      <option value="hun">Hungarian</option>
                      <option value="ser">Serbian</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={9}>
                  <Form.Group controlId={`description-text-${index}`}>
                    <RichTextEditor
                      label="Description text"
                      value={description.text}
                      onChange={(value) => updateDescriptions(index, 'text', value)}
                      placeholder="Explain the song context..."
                    />
                  </Form.Group>
                </Col>
              </Row>
              {index < songData.descriptions.length - 1 && <hr />}
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
