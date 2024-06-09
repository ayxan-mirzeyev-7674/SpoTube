import React, { Component } from "react";
import YouTube from "react-youtube";

class ReactYoutube extends Component {
  constructor(props) {
    super(props);
    this.videoOnReady = this.videoOnReady.bind(this);
  }

  videoOnReady(event) {
    const player = event.target;
    // Expose the player to the parent component
    this.props.onPlayerReady(player);
  }
  render() {
    const opts = {
      height: "72",
      width: "200",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    };

    const { videoId } = this.props;

    return (
      <YouTube videoId={videoId} opts={opts} onReady={this.videoOnReady} />
    );
  }
}

export default ReactYoutube;
