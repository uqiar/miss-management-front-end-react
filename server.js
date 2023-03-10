const express = require('express');
require('dotenv').config()
const favicon = require('express-favicon');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();

//======middlewares===========

app.use(favicon(__dirname + '/build/favicon.png'));

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));


//======routes===========
app.get('/ping',function (req, res) {
  return res.send('pong');
});

app.get('/*',function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


process.on('uncaughtException', function (err) {
  console.log(err.message);
});


app.listen(port, () => {
  console.log('App is running on ' + port);
});

