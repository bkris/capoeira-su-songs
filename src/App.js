import './App.css';
import Container from 'react-bootstrap/Container';
import Header from "./components/Header";
import TableOfContent from "./components/TableOfContent";
import SongList from "./components/SongList";
import SearchHeader from "./components/SearchHeader";
import {useEffect, useState} from "react";
import {getSongElementByPageUrl, getSortedSongs, scrollToSection, setPageTitleBySelectedSong} from "./song.service";
import {isEmpty} from "lodash";
import ScrollToTop from "./components/ScrollToTop";
import Preview from "./components/Preview";
import SortOrder from "./components/SortOrder";

function App() {
  const allSongs = getSortedSongs('date', 'desc');
  const [songs, setSongs] = useState(allSongs);
  const [selectedSong, setSelectedSong] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortBy, setSortBy] = useState('date');

  function handleSortOrder(currentSortBy) {
    if (currentSortBy !== sortBy) {
      return;
    }
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  }

  let handleSearch = (e) => {
    const lowerCase = e.target.value.toLowerCase();
    const filteredSongs = allSongs.filter(song => {
      if (isEmpty(lowerCase)) {
        // returns all songs, no filtering
        return true;
      }

      const titleContain = song.name.toLowerCase().includes(lowerCase);
      return titleContain || song.lyrics.toLowerCase().includes(lowerCase);
    })
    setSongs(filteredSongs);
  };

  useEffect(() => {
      const songElement = getSongElementByPageUrl();
      setPageTitleBySelectedSong(songElement);
      scrollToSection(songElement);
    }, []);

  const onFullscreenClicked = (song) => {
    setSelectedSong(song);
  }

  const onFullscreenClosed = () => {
    setSelectedSong(null);
  }

  const onSortByNameClicked = () => {
    handleSortOrder('name')
    setSortBy('name');
    const allSongs = getSortedSongs('name', sortOrder);
    setSongs(allSongs)
  }

  const onSortByDateClicked = () => {
    handleSortOrder('date')
    setSortBy('date');
    const allSongs = getSortedSongs('date', sortOrder);
    setSongs(allSongs)
  }

  return (
    <>
      <Container fluid="lg">
        <Header />
        <TableOfContent songs={songs}>
          <SearchHeader onSearch={handleSearch}/>
          <SortOrder onSortByName={onSortByNameClicked} onSortByDate={onSortByDateClicked}/>
        </TableOfContent>
        <SongList songs={songs} onFullScreen={onFullscreenClicked}/>
      </Container>
      {selectedSong && <Preview selectedSong={selectedSong} onHide={onFullscreenClosed}/>}
      <ScrollToTop/>
    </>
  );
}

export default App;
