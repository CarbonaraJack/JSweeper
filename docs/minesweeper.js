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
  Grumdrig roundRect function (https://stackoverflow.com/a/7838871)
**/
CanvasRenderingContext2D.prototype.roundRect =
  function (x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    this.beginPath();
    this.moveTo(x+radius, y);
    this.arcTo(x+width, y,        x+width,  y+height, radius);
    this.arcTo(x+width, y+height, x,        y+height, radius);
    this.arcTo(x,       y+height, x,        y,        radius);
    this.arcTo(x,       y,        x+width,  y,        radius);
    this.closePath();
    return this;
  }

/**
  Cell object
**/
function Cell(type,value,x,y,field,topX,topY){
  Cell.prototype.draw = drawCell;
  Cell.prototype.getNeighbors = getNeighbors;
  Cell.prototype.handleLeftClick = handleLeftClick;
  Cell.prototype.handleRightClick = handleRightClick;
  this.type = type; //can be flag, shown or hidden
  this.value = value; // B = bomb, otherwise we have proximity number
  this.x = x;
  this.y = y;
  this.field = field;
  this.topX = topX;
  this.topY = topY;
  this.cellSize = field.cellSize;
  this.botX = topX+this.cellSize-1;
  this.botY = topY+this.cellSize-1;
}
/**
  Convenient function that returns a list of surrounding cells given a cell and
  its field.
**/
var getNeighbors = function(){
  var res = [];
  for (var i = this.x-1; i <= this.x+1; i++) {
    for (var j = this.y-1; j <= this.y+1; j++) {
      //make sure that the row exists
      if(this.field.cells[i]!=null){
        //make sure that the cell exists
        if(this.field.cells[i][j]!=null){
          res.push(this.field.cells[i][j]);
        }
      }
    }
  }
  return res;
}
/**
  Function that handles left click behaviour
**/
var handleLeftClick = function(){
  switch (this.type) {
    case "hidden":
        this.type= "shown";
        //check if I clicked a mine, if not, decrease the safe squares counter
        if(this.value==="B"){
          this.field.gameOver = true;
        }else{
          this.field.safeSq--;
          //if I revealed all the safe hidden cells then the game is over
          if(this.field.safeSq===0){
            this.field.gameOver = true;
          }
        }
        //if I clicked a cell with proximity value = 0 then I can show all the
        //neighboring cells
        if (this.value===0){
          for (neighbor of this.getNeighbors()) {
            neighbor.handleLeftClick();
          }
        }
      break;
    case "shown":
      //count the surrounding flags
      var flags = 0;
      for (neighbor of this.getNeighbors()) {
        if(neighbor.type==="flag"){
          flags++
        }
      }
      //if the number of cell is equal to the proximity value
      if(flags===this.value){
        for (neighbor of this.getNeighbors()) {
          //click the cell only if it is hidden
          if(neighbor.type==="hidden"){
            neighbor.handleLeftClick();
          }
        }
      }
      break;
  }
}
/**
  Function that handles right click behaviour (flag positioning)
**/
var handleRightClick = function(){
  switch (this.type) {
    case "hidden":
      this.type="flag";
      break;
    case "flag":
      this.type="hidden";
      break;
  }
}
/**
  Function that draws a single cell
**/
var drawCell = function(ctx){
  if(this.type==="hidden"||this.type==="flag"){
    switch (this.field.skin) {
      case "classic":
        //classic skin
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
        //If the cell is a flag the only difference with an hidden cell is the
        //flag symbol that will be drawn on top of it.
        if(this.type==="flag"){
          ctx.font = this.cellSize*0.8 + 'px sans-serif';
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillStyle = "#FF0000";
          ctx.fillText("F",
            //align the text at the bottm middle of the cell.
            //This together with the 80% font size magically centers the text.
            //TEST WITH MULTIPLE BROWSERS!
            this.topX+this.cellSize/2,this.topY+this.cellSize);
        }
        break;
      default:
        //Outrun Skin
        switch (this.type) {
        case "flag":
          //draw the border of the cell
          ctx.fillStyle = "#221d0d";//very dark yellow
          ctx.roundRect
            (this.topX+this.cellSize*0.05,this.topY+this.cellSize*0.05,
            this.cellSize-this.cellSize*0.1,this.cellSize-this.cellSize*0.1,
            this.cellSize*0.20).fill();
          //fill the cell
          ctx.strokeStyle = "#f4b80c";//light yellow
          ctx.roundRect
            (this.topX+this.cellSize*0.05,this.topY+this.cellSize*0.05,
            this.cellSize-this.cellSize*0.1,this.cellSize-this.cellSize*0.1,
            this.cellSize*0.20).stroke();
          //type F for flag
          ctx.font = this.cellSize*0.8 + 'px sans-serif';
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillStyle = "#f4b80c";
          ctx.fillText("F",
            //align the text at the bottm middle of the cell.
            //This together with the 80% font size magically centers the text.
            //TEST WITH MULTIPLE BROWSERS!
            this.topX+this.cellSize/2,this.topY+this.cellSize);
          break;
        default:
          //draw the border of the cell
          ctx.fillStyle ="#280215"//dark pink "#111f24";//very dark blue
          ctx.roundRect
            (this.topX+this.cellSize*0.05,this.topY+this.cellSize*0.05,
            this.cellSize-this.cellSize*0.1,this.cellSize-this.cellSize*0.1,
            this.cellSize*0.20).fill();
          //fill the cell
          ctx.strokeStyle = "#ff0081"//pink //"#42c6ff";//light blue
          ctx.roundRect
            (this.topX+this.cellSize*0.05,this.topY+this.cellSize*0.05,
            this.cellSize-this.cellSize*0.1,this.cellSize-this.cellSize*0.1,
            this.cellSize*0.20).stroke();
        }
    }
  }else if(this.type==="shown"){
    switch (this.field.skin) {
      case "classic":
        //classic skin
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
            //align the text at the bottm middle of the cell.
            //This together with the 80% font size magically centers the text.
            //TEST WITH MULTIPLE BROWSERS!
            this.topX+this.cellSize/2,this.topY+this.cellSize);
        }
        break;
      default:
        //Outrun Skin
        if(this.value!=="B"){
          //draw the border of the cell
          ctx.fillStyle ="#111f24";//very dark blue
          ctx.roundRect
            (this.topX+this.cellSize*0.05,this.topY+this.cellSize*0.05,
            this.cellSize-this.cellSize*0.1,this.cellSize-this.cellSize*0.1,
            this.cellSize*0.20).fill();
          //fill the cell
          ctx.strokeStyle = "#42c6ff";//light blue
          ctx.roundRect
            (this.topX+this.cellSize*0.05,this.topY+this.cellSize*0.05,
            this.cellSize-this.cellSize*0.1,this.cellSize-this.cellSize*0.1,
            this.cellSize*0.20).stroke();
        }else{
          //draw the border of the cell
          ctx.fillStyle ="#770926";//dark red
          ctx.roundRect
            (this.topX+this.cellSize*0.05,this.topY+this.cellSize*0.05,
            this.cellSize-this.cellSize*0.1,this.cellSize-this.cellSize*0.1,
            this.cellSize*0.20).fill();
          //fill the cell
          ctx.strokeStyle = "#f4225a";//red
          ctx.roundRect
            (this.topX+this.cellSize*0.05,this.topY+this.cellSize*0.05,
            this.cellSize-this.cellSize*0.1,this.cellSize-this.cellSize*0.1,
            this.cellSize*0.20).stroke();
        }
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
          if(cellText==="*"){
            ctx.fillStyle = "#f4225a";//red
          }else{
            ctx.fillStyle = "#42c6ff";//light blue
          }
          ctx.fillText(cellText,
            //align the text at the bottm middle of the cell.
            //This together with the 80% font size magically centers the text.
            //TEST WITH MULTIPLE BROWSERS!
            this.topX+this.cellSize/2,this.topY+this.cellSize);
      }
    }
  }
}
/**
  Field object
**/
function Field(columns,rows,mines,margin,width,height,skin){
  Field.prototype.generateMines = generateMines;
  Field.prototype.draw = drawField;
  Field.prototype.getCell = getCell;
  this.columns = columns;
  this.rows = rows;
  this.mines = mines;
  this.margin = margin;
  this.skin = skin;
  this.width = width;
  this.height = height;
  this.populated = false;

  //game over flags
  this.safeSq = rows*columns - mines;
  this.gameOver = false;

  //calculate dimensions
  var cellHeight=height/rows;
  var cellWidth=width/columns;
  //I want squared cells, not rectangles. This is why I keep the shortest edge
  var cellSize = cellHeight;
  if(cellWidth<cellSize){
    cellSize=cellWidth;
  }
  //cellSize=25;//default minesweeper dimensions
  this.cellSize = cellSize;
  //generate the array
  this.cells = [];
  //INITIALIZE THE CELLS MATRIX
  for (var i = 0; i < this.columns; i++) {
    this.cells[i] = [];
    for (var j = 0; j < this.rows; j++) {
      this.cells[i][j] = new Cell("hidden",0,i,j,this,
      margin+cellSize*i,margin+cellSize*j);
    }
  }
}
var generateMines = function (blacklist){
  //console.log("Generating Mines");
  //array that will store the positions of the mines
  var minePos = [];
  //Calculate the 1D array position of each cell in the blacklist
  var blacklistPos = [];
  for (cell of blacklist) {
    blacklistPos.push(cell.x*this.columns+cell.y);
  }
  //GENERATE THE MINES
  for (var i = 0; i < this.mines; i++) {
    var genPos;//generated position
    do{
      //generate a new mine position
      genPos=getRandomInt(0,this.columns*this.rows);
      //initiate flag to true
      var flag = true;
      //check for duplicate mines
      for (pos of minePos) {
        //if at least one element of the array genPos is = to the new generated
        //number then the flag becomes false and the function starts over
        flag= flag && !(pos === genPos);
      }
      //check for blacklisted cells
      for (pos of blacklistPos){
        //ditto as above
        flag = flag && !(pos === genPos);
      }
    } while (!flag);
    //insert the generated position in the array
    minePos[i]=genPos;
  }
  //PLACE THE MINES INSIDE THE MATRIX
  for (pos of minePos) {
    var x= Math.floor(pos/this.columns);
    var y= pos % this.columns;
    this.cells[x][y].value="B";
    //Populate the proximity matrix
    //the smart way
    for (neighbor of this.cells[x][y].getNeighbors()) {
      //if the cell doesn't contain a bomb
      if(neighbor.value!=="B"){
        //increase the proximity counter
        neighbor.value++;
      }
    }
  }
  //check populated flag to true so that I don't generate a new minefield with
  //each click.
  this.populated = true;
}
/**
  Function that draws the field of play
**/
var drawField = function (ctx){
  if (this.skin==="outrun"){
    console.log("in");
    //draw background
    ctx.fillStyle = "#000";
    ctx.fillRect(this.margin,this.margin,this.width,this.height);
  }
  for (var i = 0; i < this.columns; i++) {
    for (var j = 0; j < this.rows; j++) {
      this.cells[i][j].draw(ctx);
    }
  }
  //check if the game is over, and if so then display the Game Over popup
  if(this.gameOver){
    if(this.safeSq===0){
      window.alert("You win!");
    }else{
      window.alert("You lose!");
    }
  }
}
/**
  Function that will return the cell that is selected
**/
var getCell = function (x,y){
  if(x>this.margin && y>this.margin &&
     x<this.margin+this.cellSize*this.columns &&
     y<this.margin+this.cellSize*this.rows){
    var col = Math.floor((x-this.margin)/this.cellSize);
    var row = Math.floor((y-this.margin)/this.cellSize);
    return this.cells[col][row];
  }else{
    return false;
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
  //field vars
  var columns = 10;
  var rows = 10;
  var mines = 10;
  var margin = 15;
  var width = canvas.width - 2*margin;
  var height = canvas.height - 2*margin;
  var skin = "outrun";
  var field = new Field(columns,rows,mines,margin,width,height,skin);
  //console.log(field);
  /**
    getCell wrapper to avoid passing the canvas
  **/
  var findCell = function (evt){
    //get position of canvas relative to window
    var rect = canvas.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var offsetTop = rect.top + scrollTop,
        offsetLeft = rect.left + scrollLeft;
    //find the cell assigned to the position.
    return field.getCell(evt.clientX-offsetLeft,evt.clientY-offsetLeft);
  };
  //assign onclick event (leftClick)
  canvas.addEventListener('click',function(evt){
    var cell = findCell(evt);
    //if I manage to get a cell then I can handle the click
    if(cell !== false){
      if(!field.populated){
        //generate mines
        field.generateMines(cell.getNeighbors());
      }
      if(!field.gameOver){
        cell.handleLeftClick();
        field.draw(ctx);
      }
    }
  },false);
  // assign oncontextmenu event (rightClick)
  canvas.oncontextmenu = function(evt){
    evt.preventDefault();
    var cell = findCell(evt);
    //if I manage to get a cell then I can handle the click
    if(cell !== false && !field.gameOver){
      cell.handleRightClick();
      field.draw(ctx);
    }
    return false;
  };
  //draw the field
  field.draw(ctx);
});
