import songs from "./songs";
import {isEmpty, isNil, sortBy} from "lodash";
import {slugify} from "voca";

/** @typedef {'eng', 'hun', 'srb'} Language */
/** @typedef {'youtube', 'facebook', 'instagram', 'soundcloud'} Provider */
/** @typedef {'video', 'audio'} MediaType */
/** @typedef {'corridos', 'ladainha', 'maculele'} SongType */

/**
 * @typedef Media
 * @property {Provider} provider
 * @property {MediaType} type
 * @property {string} link
 */

/**
 * @typedef Translated
 * @property {Language} language
 * @property {string} text
*/

/**
 * @typedef SongInterface
 * @property {string} id
 * @property {string} name
 * @property {string} lyrics
 * @property {Translated[]} translations
 * @property {Media, Media[]} media
 * @property {SongType} [type]
 * @property {Translated[]} [descriptions]
 */

const getId = (name) => `${slugify(name)}`;

/**
 * @returns SongInterface[]
 */
export function getSortedSongs() {
  /** @type {SongInterface[]} */
  const rawSongs = sortBy(songs, 'name');

  return rawSongs.map(song => {
    return {
      ...song,
      id: getId(song.name),
    }
  })
}

export function setPageTitleBySelectedSong() {
  const parsedUrl = new URL(window.location.href);

  if (isEmpty(parsedUrl.hash)) {
    return;
  }

  const songElement = document.querySelector(`[data-song-id="${parsedUrl.hash}"]`);

  if (isNil(songElement)) {
    return;
  }

  const songName = songElement.dataset.songName;
  window.document.title = `${songName} - Capoeira Subotica Songs`;
}
