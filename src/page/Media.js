import {Ratio} from "react-bootstrap";

function Media({link, provider, type}) {
  if (type !== "video") {
    return <div></div>;
  }

  if (provider === 'youtube') {
    const videoId = link.split('v=')[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;

    return (
      <Ratio aspectRatio="16x9">
        <iframe src={embedUrl} allowFullScreen></iframe>
      </Ratio>
    )
  }
}
export default  Media;
