streamUrl=$1
streamLow="rtmp://localhost/live/$1_st_low"
streamMid="rtmp://localhost/live/$1_st_mid"
streamHigh="rtmp://localhost/live/$1_st_high"
#echo $streamLow

inital="http://$3:8000/live/"
httpLow="$inital$1_st_low/index.m3u8"
httpMid="$inital$1_st_mid/index.m3u8"
httpHigh="$inital$1_st_high/index.m3u8"

finalplay="#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-STREAM-INF:BANDWIDTH=300000,RESOLUTION=640x360\n$httpLow\n#EXT-X-STREAM-INF:BANDWIDTH=600000,RESOLUTION=842x480\n$httpMid\n#EXT-X-STREAM-INF:BANDWIDTH=1000000,RESOLUTION=1280x720\n$httpHigh"

echo -e $finalplay > "/home/shravan/Program/node/I-SEE-U/web/views/video/playlist/$4.m3u8"

#ffmpeg -loop 1 -i %03d.png -t 30 output.mkv

echo $2

ffmpeg -re -hwaccel auto -i $2 \
-vf scale=w=640:h=360 -c:a aac -ar 11025 -c:v h264 -profile:v baseline -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -b:v 800k -maxrate 856k -bufsize 1200k -b:a 96k -f flv $streamLow \
-vf scale=w=842:h=480 -c:a aac -ar 11025 -c:v h264 -profile:v baseline -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -maxrate 1498k -bufsize 2100k -b:a 128k -f flv $streamMid

#-vf scale=w=1280:h=720 -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -b:v 2800k -maxrate 2996k -bufsize 4200k -b:a 128k -f flv $streamHigh


ffmpeg -re -hwaccel auto -i http://192.168.43.218:8080/video \
-vf scale=w=640:h=360 -c:a aac -ar 11025 -c:v h264 -profile:v baseline -crf 50 -sc_threshold 0 -g 48 -keyint_min 48 -b:v 400k -maxrate 400k -bufsize 540k -b 20k -f flv rtmp://localhost/live/st_low \
-vf scale=w=842:h=480 -c:a aac -ar 11025 -c:v h264 -profile:v baseline -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -maxrate 1498k -bufsize 2100k -b:a 128k -f flv rtmp://localhost/live/st_mid
