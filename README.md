# SRS server restart API

For SRS Server restart, using NodeJS Express and basic shell script.

## How to use

### prepare
1. NodeJS install
2. Package: express, cors,  body-parser

### run
```
node w001.js
```

## API

### 依照 SRS server 重啟順序：
1. kill 當前 SRS 服務
2. setUlimit (預設若小餘1000不需設定)
3. 啟動 SRS 服務

### 相對應的shell script:
1. killSRS.sh
2. setUlimit.sh
3. restartSRS.sh

### 本專案API run在1985 port, 相對應api(使用post):
1. /killSRS
2. /setUlimit
3. /restartSRS

### 合併重啟步驟:
- API: /killstartSRS  為整合 /killSRS /setUlimit /restartSRS
- shell script: killstartSRS.sh

## Basic shell script 

### killSRS.sh
1. kill SRS process by PID
2. echo result

```sh
pid=$(pgrep -f '/objs/srs')
if [ -z "$pid" ]; then
  echo "none"
else
  kill -9 $pid
  echo "killdone"
fi
```

### setUlimit.sh
- set ulimit

```sh
ulimit -HSn 1508
```

### restartSRS.sh
1. check srs running or not
2. move to SRS server path and start Server with config.
3. echo result

```sh
pid=$(pgrep -f '/objs/srs')
if [ -z "$pid" ]; then
  ulimit -HSn 1508
  time sleep 1
  cd /Your/SRS/PATH/trunk && time sleep 1 && ./objs/srs -c your/config/path/config.conf && echo "done"
else
  echo "SRS still running..."
fi
```

