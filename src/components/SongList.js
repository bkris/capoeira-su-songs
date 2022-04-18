import Song from "./Song";

/**
 * @param {SongInterface[]} songs
 * @returns {JSX.Element}
 * @constructor
 */
function SongList({songs = []}) {
  const songList = songs.map(song => (
    <Song key={song.id}
          id={song.id}
          name={song.name}
          lyrics={song.lyrics}
          translations={song.translations}
          media={song.media}
          descriptions={song.descriptions}
    ></Song>
  ))

  return (
    <>{songList}</>
  );
}

export default SongList;
