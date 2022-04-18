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
      <iframe src={embedUrl} id={videoId} title={videoId} allowFullScreen></iframe>
    </Ratio>
  )
}

function FacebookVideo({link}) {
  const urlEncodedLink = encodeURI(link);
  const fullLink = `https://www.facebook.com/plugins/video.php?href=${urlEncodedLink}&show_text=0&width=560`

  return (
    <Ratio>
      <iframe
        src={fullLink}
        width="560" height="420" style={{border: 'none', overflow: 'hidden'}} scrolling="no" frameBorder="0"
        allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"/>
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

  if (provider === 'facebook') {
    return <FacebookVideo link={link}/>
  }

  return NO_MEDIA;
}
export default  Media;
