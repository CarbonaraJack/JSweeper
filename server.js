//Express and app instance
var express = require ('express');
var app = express();
//server vars
var port = 3000;

//route index.html to home
app.get('/',function(req,res,next){
  res.sendFile(__dirname+'/docs/index.html');
});

//route minesweeper.js
app.get('/minesweeper.js',function(req,res,next){
  res.sendFile(__dirname+'/docs/minesweeper.js');
});

//route minesweeper.css
app.get('/minesweeper.css',function(req,res,next){
  res.sendFile(__dirname+'/docs/minesweeper.css');
});

//simple html server
app.listen(port,function(){
  console.log("Server open on port "+port);
});
