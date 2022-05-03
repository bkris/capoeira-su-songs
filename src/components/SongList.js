import Song from "./Song";

/**
 * @param {SongInterface[]} songs
 * @param {function} onFullScreen
 * @returns {JSX.Element}
 * @constructor
 */
function SongList({songs = [], onFullScreen}) {
  const songList = songs.map(song => (
    <Song key={song.id}
          id={song.id}
          name={song.name}
          lyrics={song.lyrics}
          translations={song.translations}
          media={song.media}
          descriptions={song.descriptions}
          onFullScreen={onFullScreen}
    ></Song>
  ))

  return (
    <>{songList}</>
  );
}

export default SongList;
