import Song from "./Song";

/**
 * @param {SongInterface[]} songs
 * @param {function} onFullScreen
 * @param {boolean} showEditorLinks
 * @returns {JSX.Element}
 * @constructor
 */
function SongList({songs = [], onFullScreen, showEditorLinks = false}) {
  const songList = songs.map(song => (
    <Song key={song.id}
          id={song.id}
          name={song.name}
          lyrics={song.lyrics}
          type={song.type}
          translations={song.translations}
          media={song.media}
          descriptions={song.descriptions}
          onFullScreen={onFullScreen}
          showEditorLink={showEditorLinks}
    ></Song>
  ))

  return (
    <>{songList}</>
  );
}

export default SongList;
