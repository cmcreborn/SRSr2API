#! /bin/bash

pid=$(pgrep -f '/objs/srs')
if [ -z "$pid" ]; then
  echo "none"
else
  kill -9 $pid
  echo "killdone"
fi