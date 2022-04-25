import './App.css';
import Container from 'react-bootstrap/Container';
import Header from "./components/Header";
import TableOfContent from "./components/TableOfContent";
import SongList from "./components/SongList";
import SearchHeader from "./components/SearchHeader";
import {useEffect, useState} from "react";
import {getSortedSongs, setPageTitleBySelectedSong} from "./song.service";
import {isEmpty} from "lodash";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const allSongs = getSortedSongs();
  const [songs, setSongs] = useState(allSongs);

  let handleSearch = (e) => {
    const lowerCase = e.target.value.toLowerCase();
    const filteredSongs = allSongs.filter(song => isEmpty(lowerCase) ? true : song.name.toLowerCase().includes(lowerCase))
    setSongs(filteredSongs);
  };

  useEffect(() => {
      setPageTitleBySelectedSong();
    },
    []);

  return (
    <>
      <Container fluid="lg">
        <Header />
        <TableOfContent songs={songs}>
          <SearchHeader onSearch={handleSearch}/>
        </TableOfContent>
        <SongList songs={songs}/>
      </Container>
      <ScrollToTop/>
    </>
  );
}

export default App;
