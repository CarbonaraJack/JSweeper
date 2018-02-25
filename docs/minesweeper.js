/**
  MDN random int function
**/
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
  //The maximum is exclusive and the minimum is inclusive
}
/**
  Cell object
**/
function Cell(type,value){
  Cell.prototype.assignPos = assignCellPos;
  Cell.prototype.draw = drawCell;
  this.type = type; //can be flag, shown or hidden
  this.value = value; // B = bomb, otherwise we have proximity number
}
/**
  Function that sets the absolute coordinates of a cell
**/
var assignCellPos = function(topX,topY,cellSize){
  this.topX = topX;
  this.topY = topY;
  this.cellSize = cellSize;
  this.botX = topX+cellSize-1;
  this.botY = topY+cellSize-1;
}
/**
  Function that draws a single cell
**/
var drawCell = function(ctx){
  if(this.type==="hidden"){
    //draw the backround of the cell
    ctx.beginPath();
    ctx.rect(this.topX,this.topY,this.cellSize,this.cellSize);
    ctx.fillStyle = "#d3d3d3";
    ctx.fill();
    //draw the border
    //I have to simulate standard HTML solid border behaviour
    //this is a pain, but I want to stick with the original minesweeper look
    //and feel as much as I can

    //Top and left borders
    ctx.beginPath();
    ctx.moveTo(this.topX,this.topY);
    ctx.lineTo(this.botX,this.topY);
    ctx.lineTo(this.botX-1,this.topY+1);
    ctx.lineTo(this.topX+1,this.topY+1);
    ctx.lineTo(this.topX+1,this.botY-1);
    ctx.lineTo(this.topX,this.botY);
    ctx.closePath();
    ctx.strokeStyle = "#f5f5f5";
    ctx.stroke();
    //bottom and right borders
    ctx.beginPath();
    ctx.moveTo(this.botX,this.topY+1);
    ctx.lineTo(this.botX,this.botY);
    ctx.lineTo(this.topX+1,this.botY);
    ctx.lineTo(this.topX+2,this.botY-1);
    ctx.lineTo(this.botX-1,this.botY-1);
    ctx.lineTo(this.botX-1,this.topY+1);
    ctx.closePath();
    ctx.strokeStyle = "#808080";
    ctx.stroke();
  }else if(this.type==="shown"){
    //draw the backround of the cell
    ctx.beginPath();
    ctx.rect(this.topX,this.topY,this.cellSize,this.cellSize);
    ctx.fillStyle = "#d3d3d3";
    ctx.fill();
    //draw the border
    ctx.beginPath();
    ctx.rect(this.topX,this.topY,this.cellSize,this.cellSize);
    ctx.strokeStyle = "#696969";
    ctx.stroke();
    //get the text of the cell
    var cellText = this.value;
    if(cellText === "B"){
      //For now if I have a bomb I will draw *, will change it with a mine
      //picture in the future.
      cellText = "*";
    }
    //Draw the text only if I have to
    if(cellText!==0){
      //the font size will be 80% of the cell size
      ctx.font = this.cellSize*0.8 + 'px sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      //choose a different color for each number
      switch (cellText) {
        case 1:
          ctx.fillStyle = "#0000ff";
          break;
        case 2:
          ctx.fillStyle = "#006400";
          break;
        case 3:
          ctx.fillStyle = "#ff0000";
          break;
        case 4:
          ctx.fillStyle = "#ff00ff";
          break;
        case 5:
          ctx.fillStyle = "#00ffff";
          break;
        case 6:
          ctx.fillStyle = "#90ee90";
          break;
        case 7:
          ctx.fillStyle = "#ffa500";
          break;
        case 8:
          ctx.fillStyle = "#000000";
          break;
        default:
          ctx.fillStyle = "#000000";
      }
      ctx.fillText(cellText,
        //align the text at the bottm middle of the cell. This together with the
        //80% font size magically centers the text. TEST WITH MULTIPLE BROWSERS!
        this.topX+this.cellSize/2,this.topY+this.cellSize);
    }
  }
}
/**
  Field object
**/
function Field(columns,rows,mines){
  Field.prototype.draw = drawField;
  Field.prototype.assignConst = assignFieldConst;
  this.columns = columns;
  this.rows = rows;
  //generate the array
  this.cells = [];
  //array that will store the positions of the mines
  var minePos = [];
  //INITIALIZE THE CELLS MATRIX
  for (var i = 0; i < this.columns; i++) {
    this.cells[i] = [];
    for (var j = 0; j < this.rows; j++) {
      this.cells[i][j] = new Cell("shown",0);
    }
  }
  //GENERATE THE MINES
  for (var i = 0; i < mines; i++) {
    var genPos;//generated position
    do{
      //generate a new mine position
      genPos=getRandomInt(0,columns*rows);
      //initiate flag to true
      var flag = true;
      for (pos of minePos) {
        flag= flag && !(pos === genPos);
        //if at least one element of the array genPos is = to the new generated
        //number then the flag becomes false and the function starts over
      }
    } while (!flag);
    //insert the generated position in the array
    minePos[i]=genPos;
  }
  //PLACE THE MINES INSIDE THE MATRIX
  for (pos of minePos) {
    var x= Math.floor(pos/columns);
    var y= pos % columns;
    this.cells[x][y].value="B";
    //Populate the proximity matrix
    if(x>0){
      if(this.cells[x-1][y].value!=="B"){
        this.cells[x-1][y].value++;
      }
    }
    if(y>0){
      if(this.cells[x][y-1].value!=="B"){
        this.cells[x][y-1].value++;
      }
    }
    if(x<this.columns-1){
      if(this.cells[x+1][y].value!=="B"){
        this.cells[x+1][y].value++;
      }
    }
    if(y<this.rows-1){
      if(this.cells[x][y+1].value!=="B"){
        this.cells[x][y+1].value++;
      }
    }
    if(x>0 && y>0){
      if(this.cells[x-1][y-1].value!=="B"){
        this.cells[x-1][y-1].value++;
      }
    }
    if(x>0 && y<this.rows-1){
      if(this.cells[x-1][y+1].value!=="B"){
        this.cells[x-1][y+1].value++;
      }
    }
    if(x<this.columns-1 && y>0){
      if(this.cells[x+1][y-1].value!=="B"){
        this.cells[x+1][y-1].value++;
      }
    }
    if(x<this.columns-1 && y<this.rows-1){
      if(this.cells[x+1][y+1].value!=="B"){
        this.cells[x+1][y+1].value++;
      }
    }
  }
}

/**
  Function that sets the constant variables of a field and sets the position of
  each individual cell
**/
var assignFieldConst = function(margin, width, height){
  this.margin = margin;
  var cellHeight=height/this.rows;
  var cellWidth=width/this.columns;
  //I want squared cells, not rectangles so I keep the shortest edge
  var cellSize = cellHeight;
  if(cellWidth<cellSize){
    cellSize=cellWidth;
  }
  //cellSize=25;//default minesweeper dimensions
  //now that I have my cellSize I can assign the position to each cell
  for (var i = 0; i < this.columns; i++) {
    for (var j = 0; j < this.rows; j++) {
      this.cells[i][j].assignPos(margin+cellSize*i,margin+cellSize*j,cellSize);
    }
  }
}
/**
  Function that draws the field of play
**/
var drawField = function (ctx){
  for (var i = 0; i < this.columns; i++) {
    for (var j = 0; j < this.rows; j++) {
      this.cells[i][j].draw(ctx);
    }
  }
}
$('#canvas').ready(function(){
  var canvas = $('#canvas').get(0);
  //set canvas size. To do: adapt canvas size to the window size
  canvas.width = 630;
  canvas.height = 630;
  //get drawable canvas context
  var ctx = canvas.getContext('2d');
  /**GAME CODE**/
  var field = new Field(10,10,10);
  console.log(field);
  var margin = 15;
  var width = canvas.width - 2*margin;
  var height = canvas.height - 2*margin;
  field.assignConst(margin,width,height);
  field.draw(ctx);
});
