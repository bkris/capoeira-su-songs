import {Ratio} from "react-bootstrap";
import {isEmpty} from "lodash";

const NO_MEDIA = <></>;

function YoutubeVideo({link}) {
  const parsedUrl = new URL(link);
  const videoId = parsedUrl.searchParams.get('v')

  if (isEmpty(videoId)) {
    return NO_MEDIA;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;

  return (
    <Ratio aspectRatio="16x9">
      <iframe src={embedUrl} allowFullScreen></iframe>
    </Ratio>
  )
}

function Media({link, provider, type}) {
  if (type !== "video") {
    return NO_MEDIA
  }

  if (provider === 'youtube') {
    return <YoutubeVideo link={link}/>
  }

  return NO_MEDIA;
}
export default  Media;
