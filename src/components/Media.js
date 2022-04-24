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
  const fullLink = `https://www.facebook.com/plugins/video.php?href=${urlEncodedLink}&show_text=0`

  return (
    <Ratio>
      <iframe
        src={fullLink}
        id={urlEncodedLink} title={urlEncodedLink}
        style={{border: 'none', overflow: 'hidden'}} scrolling="no" frameBorder="0"
        allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"/>
    </Ratio>
  )
}

function InstagramVideo({link}) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
  );
}

function Soundcloud({link}) {
  const urlEncodedLink = encodeURI(link);
  const fullLink = `https://w.soundcloud.com/player/?url=${urlEncodedLink}&amp;auto_play=false&amp;hide_related=false&amp;visual=true&amp;show_comments=true&amp;color=false&amp;show_user=true&amp;show_reposts=false`

  return (
    <Ratio aspectRatio="16x9">
      <iframe width="100%" scrolling="no" frameBorder="no"
              id={urlEncodedLink} title={urlEncodedLink}
              src={fullLink}></iframe>
    </Ratio>
  );
}

/**
 * @param {string} link
 * @param {Provider} provider
 * @param {MediaType} type
 * @returns {JSX.Element|*}
 * @constructor
 */
function Media({link, provider, type}) {
  function renderVideoType() {
    if (provider === 'youtube') {
      return <YoutubeVideo link={link}/>
    }

    if (provider === 'facebook') {
      return <FacebookVideo link={link}/>
    }

    if (provider === 'instagram') {
      return <InstagramVideo link={link}/>
    }

    return NO_MEDIA;
  }

  function renderAudioType() {
    if (provider === 'soundcloud') {
      return <Soundcloud link={link}/>
    }

    return NO_MEDIA;
  }

  if (type === 'audio') {
    return renderAudioType();
  }

  if (type === "video") {
    return renderVideoType();
  }

  return NO_MEDIA;
}
export default  Media;
