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
function Field(width,height,mines){
  this.width = width;
  this.height = height;
  //generate the array
  this.cells = [];
  //array that will store the positions of the mines
  var minePos = [];
  //INITIALIZE THE CELLS MATRIX
  for (var i = 0; i < this.width; i++) {
    this.cells[i] = [];
    for (var j = 0; j < this.height; j++) {
      this.cells[i][j] = new Cell("shown",0);
    }
  }
  //GENERATE THE MINES
  for (var i = 0; i < mines; i++) {
    var genPos;//generated position
    do{
      //generate a new mine position
      genPos=getRandomInt(0,width*height);
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
    var x= Math.floor(pos/width);
    var y= pos % width;
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
    if(x<this.width-1){
      if(this.cells[x+1][y].value!=="B"){
        this.cells[x+1][y].value++;
      }
    }
    if(y<this.height-1){
      if(this.cells[x][y+1].value!=="B"){
        this.cells[x][y+1].value++;
      }
    }
    if(x>0 && y>0){
      if(this.cells[x-1][y-1].value!=="B"){
        this.cells[x-1][y-1].value++;
      }
    }
    if(x>0 && y<this.height-1){
      if(this.cells[x-1][y+1].value!=="B"){
        this.cells[x-1][y+1].value++;
      }
    }
    if(x<this.width-1 && y>0){
      if(this.cells[x+1][y-1].value!=="B"){
        this.cells[x+1][y-1].value++;
      }
    }
    if(x<this.width-1 && y<this.height-1){
      if(this.cells[x+1][y+1].value!=="B"){
        this.cells[x+1][y+1].value++;
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
});
