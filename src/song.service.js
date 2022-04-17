import songs from "./songs";
import {sortBy} from "lodash";

export function getSortedSongs() {
  return sortBy(songs, 'name')
}

