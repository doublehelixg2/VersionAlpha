const { NodeMediaServer } = require("node-media-server");
const ffmpegPath = require("./ffmpegconfig");
const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8000,
    mediaroot: "./media",
    allow_origin: "*"
  },
  trans: {
    ffmpeg: ffmpegPath.setPath(),
    tasks: [
      {
        app: "live",
        hls: true,
        hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]"
      }
    ]
  }
};
var nms = new NodeMediaServer(config);
nms.run();
