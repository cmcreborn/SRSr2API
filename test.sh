#! /bin/bash

pid=$(pgrep -f '/objs/srs')
if [ -z "$pid" ]; then
  echo none
else
  echo $pid
fi

# echo $pid

# check servive status with pid
# if [ -z "$pid" ]; then
#   echo not running
# else
#   echo is running!
# fi