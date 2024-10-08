import {Ratio} from "react-bootstrap";
import { InstagramEmbed, TikTokEmbed, FacebookEmbed } from 'react-social-media-embed';

import {isEmpty} from "lodash";
import {MediaProviders} from "../song.service";

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

  const iframe_container = {
    left: 0,
    width: "100%",
    height: 800,
    position: "relative"
  }

  const iframe = {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    position: "absolute",
    border: 0
  }

  return (
    <div style={iframe_container}>
      <iframe
        src={fullLink}
        id={urlEncodedLink} title={urlEncodedLink}
        style={iframe} scrolling="no" frameBorder="0"
        allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"/>
    </div>
  )
}

function InstagramVideo({link}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <InstagramEmbed url={link} width={328} />
    </div>
  );
}

function TikTokVideo({link}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <TikTokEmbed url={link} width={325} />
    </div>
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

function PhysicalFile({path}) {
  const fullPath = `${process.env.PUBLIC_URL}/records/${path}`;
  return (
    <audio controls preload="none">
      <source src={fullPath} type="audio/mp4" />
      <p>Your browser does not support HTML5 audio.</p>
    </audio>
  )
}

/**
 * @param {string} link
 * @param {MediaProviders} provider
 * @param {MediaType} type
 * @returns {JSX.Element|*}
 * @constructor
 */
function Media({link, provider, type}) {
  function renderVideoType() {
    if (provider === MediaProviders.YT) {
      return <YoutubeVideo link={link}/>
    }

    if (provider === MediaProviders.FB) {
      return <FacebookVideo link={link}/>
    }

    if (provider === MediaProviders.IG) {
      return <InstagramVideo link={link}/>
    }

    if (provider === MediaProviders.TK) {
      return <TikTokVideo link={link}/>
    }

    return NO_MEDIA;
  }

  function renderAudioType() {
    if (provider === 'file') {
      return <PhysicalFile path={link}/>
    }

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
