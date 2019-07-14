#! /bin/bash

pid=$(pgrep -f '/objs/srs')
if [ -z "$pid" ]; then
  echo "noSRS"
else
  kill -9 $pid
  time sleep 1
  ulimit -HSn 1508
  time sleep 1
  pid=$(pgrep -f '/objs/srs')
  if [ -z "$pid" ]; then
    cd /home/mobile-srs/srs5rec/trunk && time sleep 1 && ./objs/srs -c conf/vcc/qa/center.conf && echo "done"
  else
    echo "SRS still running..."
  fi

fi