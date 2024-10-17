import React, { Component, useContext } from "react";
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

  videoOnStateChange(event) {
    const player = event.target;
    this.props?.onStateChange(player.getCurrentState());
  }

  render() {
    const { videoId, queue, queueId, loopSingle } = this.props;

    const opts = {
      height: "195",
      width: "320",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        controls: 0,
        rel: 0,
        listType: "playlist",
        playlist: loopSingle ? queue[queueId] : queue?.join(","),
        index: queueId + 1,
        loop: 1,
      },
    };

    return (
      <YouTube
        // videoId={videoId}
        opts={opts}
        onReady={this.videoOnReady}
        onStateChange={this.props.onStateChange}
      />
    );
  }
}

export default ReactYoutube;
