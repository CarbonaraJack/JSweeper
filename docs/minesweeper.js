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
  this.type = type; //can be flag, shown or hidden
  this.value = value; // B = bomb, otherwise we have proximity number
}
/**
  Field object
**/
function Field(columns,rows,mines){
  Field.prototype.draw = drawField;
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
  Function that draws the field of play
**/
var drawField = function (ctx, margin, width, height){
  var cellHeight=height/this.rows;
  var cellWidth=width/this.columns;
  //I want squared cells, not rectangles so I keep the shortest edge
  var cellSize = cellHeight;
  if(cellWidth<cellSize){
    cellSize=cellWidth;
  }
  /*
  ctx.beginPath();
  ctx.rect(margin,margin,width,height);
  ctx.strokeStyle = "000";
  ctx.stroke();
  */
  for (var i = 0; i < this.columns; i++) {
    for (var j = 0; j < this.rows; j++) {
      //draw the border
      ctx.beginPath();
      ctx.rect(margin+(i*cellSize),margin+(j*cellSize),cellSize,cellSize);
      ctx.strokeStyle = "000";
      ctx.stroke();
      //get the text of the cell
      var cellText = this.cells[i][j].value;
      if(cellText === "B"){
        //For now if I have a bomb I will draw *, will change it with a mine
        //picture in the future.
        cellText = "*";
      }
      //Draw the text only if I have to
      if(cellText!==0){
        //the font size will be 80% of the cell size
        ctx.font = cellSize*0.8 + 'px sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(cellText,
          //align the text at the bottm middle of the cell. This together with the
          //80% font size magically centers the text. TEST WITH MULTIPLE BROWSERS!
          margin+(i*cellSize)+cellSize/2,margin+(j*cellSize)+cellSize);
      }
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
  field.draw(ctx,margin,width,height);
});
