import Container from 'react-bootstrap/Container';
import Header from './Header';
import TableOfContent from './TableOfContent';
import SongList from './SongList';
import SearchHeader from './SearchHeader';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getSongElementByPageUrl,
  getSortedSongs,
  scrollToSection,
  setPageTitleBySelectedSong
} from '../song.service';
import { isEmpty } from 'lodash';
import ScrollToTop from './ScrollToTop';
import Preview from './Preview';
import SortOrder from './SortOrder';

function SongLibrary() {
  const allSongs = getSortedSongs('date', 'desc');
  const [songs, setSongs] = useState(allSongs);
  const [selectedSong, setSelectedSong] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortBy, setSortBy] = useState('date');
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditorMode, setIsEditorMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('editor') === 'true') {
      return true;
    }
    return window.localStorage.getItem('capoeiraEditorMode') === 'true';
  });

  function handleSortOrder(currentSortBy) {
    if (currentSortBy !== sortBy) {
      return;
    }
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  }

  const handleSearch = (e) => {
    const lowerCase = e.target.value.toLowerCase();
    const filteredSongs = allSongs.filter(song => {
      if (isEmpty(lowerCase)) {
        return true;
      }

      const titleContain = song.name.toLowerCase().includes(lowerCase);
      return titleContain || song.lyrics.toLowerCase().includes(lowerCase);
    });
    setSongs(filteredSongs);
  };

  useEffect(() => {
    const songElement = getSongElementByPageUrl();
    setPageTitleBySelectedSong(songElement);
    scrollToSection(songElement);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('capoeiraEditorMode', isEditorMode ? 'true' : 'false');
    }
    const params = new URLSearchParams(location.search);
    const hasEditorParam = params.get('editor') === 'true';
    if (isEditorMode && !hasEditorParam) {
      params.set('editor', 'true');
      navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: true });
    } else if (!isEditorMode && hasEditorParam) {
      params.delete('editor');
      const nextSearch = params.toString();
      navigate({ pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : '' }, { replace: true });
    }
  }, [isEditorMode, location.pathname, location.search, navigate]);

  const handleCloseEditorMode = () => {
    setIsEditorMode(false);
  };

  const onFullscreenClicked = (song) => {
    setSelectedSong(song);
  };

  const onFullscreenClosed = () => {
    setSelectedSong(null);
  };

  const onSortByNameClicked = () => {
    handleSortOrder('name');
    setSortBy('name');
    const allSongs = getSortedSongs('name', sortOrder);
    setSongs(allSongs);
  };

  const onSortByDateClicked = () => {
    handleSortOrder('date');
    setSortBy('date');
    const allSongs = getSortedSongs('date', sortOrder);
    setSongs(allSongs);
  };

  return (
    <>
      <Container fluid="lg">
        <Header showEditorShortcut={isEditorMode} onCloseEditorMode={handleCloseEditorMode} />
        <TableOfContent songs={songs}>
          <SearchHeader onSearch={handleSearch} />
          <SortOrder onSortByName={onSortByNameClicked} onSortByDate={onSortByDateClicked} />
        </TableOfContent>
        <SongList songs={songs} onFullScreen={onFullscreenClicked} showEditorLinks={isEditorMode} />
      </Container>
      {selectedSong && <Preview selectedSong={selectedSong} onHide={onFullscreenClosed} />}
      <ScrollToTop />
    </>
  );
}

export default SongLibrary;
