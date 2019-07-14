const exec = require('child_process').exec;
const { spawn } = require('child_process');
var app = require('express')();
var getPid = '';
var myShellResult = '';

// process POST request data for express version 4+ 
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// for cross domain setting
var cors = require('cors');
var corsOption = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204,
  "credentials":true
};
app.use(cors(corsOption));

/**
 * @api {post} /startSRS 啟動SRS
 * @apiName startSRS
 * @apiGroup SRS
 * @apiDescription 啟動SRS
 *
 * @apiSuccessExample Success-Response:
 * done
 */
app.post('/startSRS', function (req, res) {
    var that = this;
    console.log('data POST from startSRS');
    var sh = spawn('sh', ['restartSRS.sh'],{detached: true});
    sh.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    sh.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);

    });

    sh.on('close', (code) => {
      console.log(`child process exited with code ${code}`);

    });
    res.end('done');


})

/**
 * @api {post} /setUlimit 設定SRS所需連線數
 * @apiName setUlimit
 * @apiGroup SRS
 * @apiDescription 設定SRS所需連線數
 *
 * @apiSuccessExample Success-Response:
 * done
 * @apiErrorExample Error-Response:
 * exec error: error reason
 */
app.post('/setUlimit', function (req, res) {
    var that = this;
    console.log('data POST from setUlimit');
    var myShellScript = exec('sh setUlimit.sh',
    (error, stdout, stderr) => {
        console.log(`${stdout}`);
        console.log(`${stderr}`);
        that.getPid = `${stdout}`;

        res.end('done');
        if (error !== null) {
            console.log(`exec error: ${error}`);
            res.end(`exec error: ${error}`);
        }
    });
})

/**
 * @api {post} /checkSRS 確認當前SRS
 * @apiName checkSRS
 * @apiGroup SRS
 * @apiDescription 確認當前SRS
 *
 * @apiSuccessExample 取得當前SRS-PID:
 * done SRS Pid = 5566
 * @apiSuccessExample 當前無SRS執行:
 * done SRS Pid = none
 * @apiErrorExample Error-Response:
 * exec error: error reason
 */
app.post('/checkSRS', function (req, res) {
    var that = this;
    console.log('data POST from checkSRS');
    var myShellScript = exec('sh test.sh',
    (error, stdout, stderr) => {
        console.log(`${stdout}`);
        console.log(`${stderr}`);
        that.getPid = `${stdout}`;
        console.log('that.getPid = ' + that.getPid);
        res.end('done SRS Pid = ' + that.getPid);
        if (error !== null) {
            console.log(`exec error: ${error}`);
            res.end(`exec error: ${error}`);
        }
    });
})

/**
 * @api {post} /killSRS 停止SRS
 * @apiName killSRS
 * @apiGroup SRS
 * @apiDescription 停止SRS運行
 *
 * @apiSuccessExample 當前無SRS顯示:
 * No SRS
 * @apiSuccessExample 成功停止顯示:
 * killSRS done
 * @apiErrorExample Error-Response:
 * exec error: error reason
 */
app.post('/killSRS', function (req, res) {
    var that = this;
    that.myShellResult='';
    console.log('data POST from killSRS');
    var myShellScript = exec('sh killSRS.sh',
    (error, stdout, stderr) => {
        console.log(`${stdout}`);
        console.log(`${stderr}`);
        that.myShellResult = `${stdout}`;
        console.log('that.myShellResult = ' + that.myShellResult);
        if (error !== null) {
            console.log(`exec error: ${error}`);
            that.myShellResult = '';
            res.end(`exec error: ${error}`);
        }
        else{
            if(that.myShellResult.replace(/\r?\n$/, '') === "none"){
                that.myShellResult = '';
                res.end("No SRS");
            }
            else{
                that.myShellResult = '';
                res.end("killSRS done");
            }
        }

    });
})

/**
 * @api {post} /killstartSRS 停止並重啟SRS
 * @apiName killstartSRS
 * @apiGroup SRS
 * @apiDescription 停止並重啟SRS運行
 *
 * @apiSuccessExample success:
 * done
 * @apiErrorExample Error-Response:
 * close unexpect.
 */
app.post('/killstartSRS', function (req, res) {
    var that = this;
    console.log('data POST from killstartSRS');
    that.myShellResult='';
    var sh = spawn('sh', ['killstartSRS.sh'],{detached: true});
    sh.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      that.myShellResult= `${data}`;
      if(that.myShellResult.replace(/\r?\n$/, '') === 'done'){res.end('done');}
    });

    sh.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
      //if(data == 'done'){res.end('done');}
    });

    sh.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      res.end('close unexpect.');
    });


})

app.listen(1985);