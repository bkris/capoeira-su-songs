import {slugify} from "voca";
import Song from "./Song";

function SongList({songs=[]}) {
  const getId = (name) => `${slugify(name)}`;

  const songList = songs.map(song => (
    <Song key={getId(song.name)}
          id={getId(song.name)}
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
