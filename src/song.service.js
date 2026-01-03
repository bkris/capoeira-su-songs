import songs from "./songs";
import {deburr, isEmpty, isNil, reverse, sortBy} from "lodash";
import {slugify} from "voca";

/** @typedef {'eng', 'hun', 'srb'} Language */
/** @typedef {'video', 'audio'} MediaType */
/** @typedef {'corridos', 'ladainha', 'maculele'} SongType */

/**
 * @readonly
 * @enum {string}
 * */
export const MediaProviders = {
  YT: 'youtube',
  FB: 'facebook',
  IG: 'instagram',
  SC: 'soundcloud',
  TK: 'tiktok'
}

/**
 * @typedef Media
 * @property {MediaProviders} provider
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
export function getSortedSongs(sort = 'name', order = 'asc') {
  /** @type {SongInterface[]} */
  const rawSongs = sortBy(songs, (song) => {
    if (sort === 'name') {
      return deburr(song.name)
    }
    return song.id;
  });

  /** @type {SongInterface[]} */
  const preparedSongs = rawSongs.map((song) => {
    const numericId = song.id;
    return {
      ...song,
      numericId,
      id: getId(song.name),
    };
  });

  return order === 'asc' ? preparedSongs : reverse(preparedSongs);
}

/**
 * Returns the element of selected song appears in url hash section
 * @return {undefined, HTMLElement}
 */
export function getSongElementByPageUrl() {
  const parsedUrl = new URL(window.location.href);

  if (isEmpty(parsedUrl.hash)) {
    return;
  }

  return document.querySelector(`[data-song-id="${parsedUrl.hash}"]`);
}

export function setPageTitleBySelectedSong(songElement) {
  songElement = songElement || getSongElementByPageUrl();

  if (isNil(songElement)) {
    return;
  }

  const songName = songElement.dataset.songName;
  window.document.title = `${songName} - Capoeira Subotica Songs`;
}

export function scrollToSection(songElement) {
  if (isNil(songElement)) {
    return;
  }

  songElement.click();
}
