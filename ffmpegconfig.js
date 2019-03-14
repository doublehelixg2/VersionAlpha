const os = require('os');

exports.setPath = function(){
    if(os.platform() === 'linux'){
        return '/usr/bin/ffmpeg';
    }
    else{
        return 'C:\\ffmpeg\\bin\\ffmpeg.exe';
    }
}