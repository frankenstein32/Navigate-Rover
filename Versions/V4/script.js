/* ----------------------------------------------------- Introduction about Flow of Code ----------------------------------------- */

                                                  /* Division of whole code section by section */
                                                  /*
                                                    * Creating Grid Boxes
                                                    * Creating Grid Equivalent Boxes
                                                    * All the Click Listeners used in html file
                                                    * BFS algorithm
                                                    * Bi-BFS Algorithm
                                                    * All variables used in the whole file
                                                  */

/*-------------------------------------------------------------------------------------------------------------------------------- */
/* Creating Grid as well as plotting rect Tags */

/* Helper-Function use to remove the x and y from an id for e.g. id="12:34" hence, x = 12 and y = 34 */
function split(str, idx) {
  /* Splitting on the basis of colon and returning corresponding element '0' for x and '1' for y */
  return str.split(":")[idx];
}

/* Function that will create an Array of Dimension -> [rowsxcols] and fill border with 5 and rest with 1.*/
function createMatrix() {

  /* Initializing the created array with 0 and borders with 5 */
  function initArray(matrix, rows, cols) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {

        /* Conditions used to seperate out the Borders */
        if (i == 0 || j == 0 || i == rows - 1 || j == cols - 1) {
          matrix[i][j] = 5;
        } else {
          matrix[i][j] = 0;
        }
      }
    }
  }

  /* Created a new Array of dimension [rowsxcols] */
  var matrix = new Array(rows);
  for (let i = 0; i < rows; i++) {
    matrix[i] = new Array(cols);
  }

  /* Calling Function to initialize the values after creating matrix */
  initArray(matrix, rows, cols);

  /* Return the Matrix */
  return matrix;
}

/*-------------------------------------------------------------------------------------------------------------------------------- */

/* Function to create html tags of rect in order to create boxes inside the Grid with dimension [rowsxcols]*/
function plot(rows = 36, cols = 64) {

  /* 'c' will contain the whole generated html rect tags string to change innerhtml of enclosing div */
  /* 'y' will denote the 'y' coordinate where the next grid must be placed */
  let c = "", y = 0;

    /* Looping for each row */
    for (let i = 0; i < rows; i++) {

      /* 'x' is a coordinate denoting where the next grid must be placed */
      var x = 0;

      /* For each row we will loop for each column present in the Grid */
      for (let j = 0; j < cols; j++) {

        /* 'colr' will store the rest grid color which is dark gray currently */
        let colr = grid_color;

        /* If the Rectange present in the grid is on the border side then change the color in order to highlight borders */
        if(i === 0 || j === 0 || i === rows - 1 || j === cols - 1){
          colr = border_color;
        }

        /* Creating a rect tag that is appending in 'c' for now and will be updated to innerhtml of enclosing div */
        /* I know you will be wondering about the id given to each rect :-
          * Each rect must be provided with id in order to do anything with the corresponding rect.
          * Operations like coloring the grid as well saving saving any number in corresponding matrix needs an id of the rect.
          * Hence id is important to allot to each rect to make further changes in matrix on which whole algo is based.
          * In order to assing every rect id i decided to allot their corresponding row_number + : + col_number to be as id
          * As with this scenario it is easy to remember and will be unique for every rect tag.     
        */
        c += `<rect id=${i + ":" + j} x="${x}" y="${y}" width="30" height="30" fill="${colr}" r="0" rx="0" ry="0"  stroke="#000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); stroke-opacity: 0.2;" stroke-opacity="0.2"></rect>`;

        /* Incrementing the 'x' coordinate as we have width of 30px and hence 'x' coordinate for next rect will be +30 from current pos. */
        x += 30;
      }

      /* Incrementing the 'y' coordinate as we have placed sufficient rect in 1 row now need to advance 'y' as height of each rect 
          is 30px hence for every rect in next column the y coordinate will be +30*/
      y += 30;
    }

    /* At last after creating rect tags using loops, now update innerHtml of enclosing div with id='container'[grid.html] */
    document.getElementById("container").innerHTML = c;

    /* I wanted to preplace the Source - coordinate so at rect with id='src_crd' will be coloured green */
    document.getElementById(src_crd).style.fill = "rgb(0, 255, 0)";
    matrix[split(src_crd, 0)][split(src_crd, 1)] = 1; /* Update the pos as '1' to denote source location */

    /* I wanted to preplace the Destination - coordinate so at rect with id='dst_crd' will be coloured Red */
    document.getElementById(dst_crd).style.fill = "rgb(255, 0, 0)";
    matrix[split(dst_crd, 0)][split(dst_crd, 1)] = 2; /* Update the pos as '2' to denote Destination location */

  }


/*-------------------------------------------------------------------------------------------------------------------------------- */


/*--------------------------------------------------- Click Listeners ------------------------------------------------------------ */

/* 
  * Below three functions activate, deactivate works in accordance with the reply_click function described below
  * Purpose: Aim is to make the wall making procedure easy to perform rather then clicking each rect to make wall[very tough].
  * Achieved: After creating these methods now user needs to click on any rect and need to keep to click pressed and now the 
  * user can move the cursor on the rects which user want to make as walls.
  * Similarly If user want to remove walls inbulk then the user needs click any wall and need to keep the click pressed and now
  * user can move the cursor on the walls which user want to remove.
  * To Stop any of these procedures all the user is to loosen up the click which the user has pressed.[Release the click to stop].
*/

/* 
  * Purpose: This Function will activate a boolean variable initiate_coloring walls which allows the code to color the rect.
  * This function will be called whenever the user either simply clicks or click and keeps pressing the click.
  * As name suggest it activates the rect to color them with either walls, src or dest .
*/
function activate(event){

  /* Mark the initiate_coloring_walls as true so that rects can be alloted colors as if it is false then color cannot be performed */
  initiate_coloring_walls = true;

  /* 
    * Get the id of the target which is clicked using event object and if the marked is already of wall color that means
    * the user wants to initiate the remove walls procedure.
   */
  if(document.getElementById(event.target.id).style.fill === walls_color){
    switch_coloring_walls = false;
  }else{ /* Otherwise if the user clicks empty rect then user wants to start creating walls procedure */
    switch_coloring_walls = true;
  }

  /* 
    * Reply_click is a function that will manage the coloring of the individual rect and will color if and only if 
    * initiate_coloring_walls is true otherwise it will return */
  reply_click(event);
}

/*-------------------------------------------------------------------------------------------------------------------------------- */

/* Purpose: This function will be called whenever the user releases the click from the grid */
function deactivate(){

  /* Mark the initiate_coloring_walls as false that no need to color the rects */
  initiate_coloring_walls = false;
}
/*-------------------------------------------------------------------------------------------------------------------------------- */

/* 
  * Purpose: This Function marks rect as walls or Source or Destination.
  * params: event is basically used to extract the id of the cooresponding rect which is clicked to color it.
  * This function is called whenever the user ""hovers"" any grid element but will execute according to the boolean variable
  * initiate_coloring_walls is whether true or false.
  */
function reply_click(event) {

  /* 
    * initiate_coloring_walls is a boolean variable which decided whether to color the rect tag or not.
    * Purpose: It is triggered when user clicks any grid to make it wall and till the removes the click it will remain true.
    * Aim: This was done in order to achieve free-hand walls creation on the grid to minimize the efforts on clicking */
  if(!initiate_coloring_walls) return;

  /* Extracting id from the event.target which denotes the id of the target element which is clicked */
  let id = event.target.id;

  /* With the help of id now we can make changes by using its object and changing the style.fill of every rect which is clicked */
  let elem = document.getElementById(id);

  /* From the id 'x' coordinate is extracted and converted to number */
  let x = parseInt(split(id, 0));
  /* From the id 'y' coordinate is extracted and converted to number */
  let y = parseInt(split(id, 1));

  /* If the user has clicked the border rect then no need to do anything as it is not permissible to make wall/src/dst on border */
  if (x == 0 || x == rows - 1 || y == 0 || y == cols - 1) {
    return;
  }

  /* 
    * cnt is a variable to mark whether we want to place wall/src/dst.
    * '0' denotes User want to change location of Src.
    * '1' denotes User want to change location of Dest.
    * Any other number denotes User either want to create wall or remove wall or remove source or remove destination 
  */

    /* Here cnt = '0' means want to place Source at new location */
  if (cnt == 0) {

    /* If User want to mark destination as Source then not possible simply return */
    if (id === dst_crd) {
      return;
    }
   
    /* After Handling corner cases: change the color of the corresponding rect to Green[denoting green] */
    elem.style.fill = "rgb(0, 255, 0)";

    /* 
      * isSrc purpose is to mark whether source is already placed or not
      * Marking isSrc true as src is not placed 
    */
    isSrc = true;

    /* src_crd stores the source corrdinates and marking current 'id' as source location */
    src_crd = id;

    /* After colouring we need to save the corresponding as '1' denoting source in the matrix */
    matrix[split(src_crd, 0)][split(src_crd, 1)] = 1;

    /* 
      * isDst denotes whether the Destination is already placed or not 
      * Checking if Destination is placed then make cnt = 10 to mark walls next time.
      * If Destination is not placed then do cnt++ so that on next click Destination will be placed
    */
    if (!isDst) cnt++;
    else cnt = 10;
  } else if (cnt == 1) { /* If the cnt is '1' that means we are here to mark the desitnation on the grid. */

    /* If we want to place the Destination over Source then simply return as it is not permissible */
    if (id === src_crd) {
      return;
    }

    /* After checking corner cases: Fill the corresponding rect as Red to denote Destination */
    elem.style.fill = "rgb(255, 0, 0)";

    /* Here After placing Destination User will place walls so simply make cnt greater than 1 as '0' is for src and '1' for dest */
    cnt++;

    /*After colouring the rect we need to save the location of coordinates of the destination. */
    dst_crd = id;

    /* This will mark isDst 'True' hence making clear that destination is placed already on the grid */
    isDst = true;

     /*After colouring the rect we also need to mark corresponding location with  */
    matrix[split(dst_crd, 0)][split(dst_crd, 1)] = 2;
  } else {
    /* This Else denotes user either wants to place walls or to remove walls/src/dst */

    /* 
      * This if condition will be satisfied when switch coloring is true and the current rect has no walls or src or dst 
      * 'switch_coloring': This is used to introduce smooth creation of the walls and it will be true whenever the user has
      *  clicked the grid and will be false when the user removes the click from the Grid.
      * That means till user keeps the click pressed and hover the grid then walls will be created.
    */
    if (switch_coloring_walls && elem.style.fill.length === 0) {
      elem.style.fill = walls_color; /* Fill the current rect with the wall color to denote wall*/
      matrix[split(id, 0)][split(id, 1)] = 3; /* marked the corresponding location in matrix as wall too*/
    } else {
      /* This else makes sure the user wants to either remove src/dst/wall */

      if (elem.style.fill === "rgb(0, 255, 0)") { /* If the rect is Src then simply remove the Src to Empty*/
        cnt = 0; /* Make cnt = 0 so that next time user clicks then First Src is placed */
        isSrc = false; /* Making isSrc denotes that now src is not placed and needs to be placed asap */
        src_crd = ""; /* Also remove the saved coordinates to blank as previous ones are of no use for us */
        elem.style.fill = ""; /* Remove color so that it can be of default color of the grid */
        matrix[split(id, 0)][split(id, 1)] = 0; /* Also removing the saved data from the matrix */
      } else if (elem.style.fill === "rgb(255, 0, 0)") { /* If the rect is Dst then simply remove the dst to Empty */
        cnt = 1; /* Make cnt = 1 so that next time user clicks then First Dst is placed */
        isDst = false; /* Making isDst denotes that now dst is not placed and needs to be placed asap */
        dst_crd = ""; /* Also remove the saved coordinates to blank as previous ones are of no use for us */
        elem.style.fill = ""; /* Remove color so that it can be of default color of the grid */
        matrix[split(id, 0)][split(id, 1)] = 0; /* Also removing the saved data from the matrix */
      } else if (elem.style.fill === "rgb(0, 0, 255)") { /* If the rect is part of shortest path then user cannot create/remove wall */
        return;
      }

      /* As discussed above the use of switch_coloring_walls, here if it is true then make it empty otherwise no need */
      if(!switch_coloring_walls){
        matrix[split(id, 0)][split(id, 1)] = 0;
        elem.style.fill = "";
      }
    }
  }
}

/*-------------------------------------------------------------------------------------------------------------------------------- */

/* This Function is to Clear Path as well as the walls from the Grid */
function clearPath(obj) {

  /**
    * This function is same for both clear walls button and clear path button so need handling.
    * If the function is called by clicking the clear walls button then we cannot clear the path.
    * In matrix: '3' walls, '0' empty, '1' src, '2' dest, '7' extra path, '9' shortest path
  */

  let val = 0; /* This variable will store whether we want to clear walls or paths */
  if (obj.id === "wall") { /* If this Function is called by the clear wall button */
    val = 3;  /* Then make the val = 3 means we want to remove walls  */
  } else { /* Otherwise this Function is called by the clear Path button */
    val = 9; /* Then make val = 9 means we want to remove the paths */
  }

  /* Loop over each row */
  for (let i = 0; i < rows; i++) {

    /*Fixing each row then Loop over Every coloumn */
    for (let j = 0; j < cols; j++) {

      /* 
        * If val === 9 means we are called to clear path and this location contains '7' means this is an extra path only then remove  
        * Otherwise if we are called by clear wall button then we donot have to clear this extra path 
      */
      if (val === 9 && matrix[i][j] === 7) {
        matrix[i][j] = 0; /* Marking the matrix as empty */
        document.getElementById(`${i}:${j}`).style.fill = ""; /* Marking the color as default of this rect on grid */
        continue; /* Every rect can have only one colour so no need to go further */
      }
      /* 
        * If val === 9 means we are here to clear path and value at this location is 9 that means this rect is part of shortest path
        * denoted on the screen by the algorithm hence clear the location.
        * If not then we are here to clear walls then no need to clear this location 
      */
      if (val === 9 && matrix[i][j] === 9) { 
        matrix[i][j] = 0; /* Mark this location as empty */
        document.getElementById(`${i}:${j}`).style.fill = ""; /* Colour this location as default on the grid */
      }

      /* 
        * After handling all corner cases: Not check whether the value at this location is wall or not.
        * If yes then unPaint the rect as we are surely called by the clear wall button as all possiblities of clear path we have seen
        * in above conditions
      */
      if (matrix[i][j] === val) {
        matrix[i][j] = 0; /* Mark this location as empty on the screen */
        document.getElementById(`${i}:${j}`).style.fill = ""; /* Colour this location as default on the grid */
      }
    }
  }
}

/*-------------------------------------------------------------------------------------------------------------------------------- */

/* 
  * Purpose: This function handles the whether user wants bi-directionality in algorithm or not 
  * Called: This function is called whenever we clicks the bi-directional button on the grid route
*/
function biDirection() {

  /* isBidrectional is a boolean variable which denotes if true then user wants bi-directionality otherwise not */
  isBirectional = !isBirectional; /* Each time we click the button this variable is switch from on to off or vice versa */
  if (isBirectional) { /* if true then change the button content to Bi-Directional denoting Bi-directionality is onn */
    document.getElementById("directions").innerHTML = "Bi-Directional";
  } else { /* Otherwise mark the button content as Single-Directional denoting Bi-Directional is off */
    document.getElementById("directions").innerHTML = "Single-Directional";
  }
}

/*-------------------------------------------------------------------------------------------------------------------------------- */

/* 
  * Purpose: This function is used to direct whether to call simple BFS or Bi-directional BFS 
  * Called: This function is called whenever Start button is click to initate the search b/w src and dst
  * This function uses the Bi-Directionality variable to call BFS or Bi-BFS
*/

function Direct() {
  /* If isBirectional is true then user wants to call Bi-Directional BFS */
  if (isBirectional) {
    bibfs(matrix); /* Calling Bi-directional BFS algo */
  } else { /* If false then User wants to call simple BFS */
    bfs(matrix); /* Calling BFS algo */
  }
}

/*-------------------------------------------------------------------------------------------------------------------------------- */

/* 
  * Purpose: This Function will Decides whether the User wants Diagonal moves permissble or not.
  * Called: This function is called whenever the User hits the Diagonal moves button on the screen.
  * Each time this function is called it adds or removes the diagonal moves from the algo.
*/

function isDiagonal() {

  /* Dirs is an list containing the Possible Directions by-default non-diagonal moves are permissble */
  /* fdirs contains the list with moves without diagonal hence update dirs with non-diagonal moves */
  dirs = fdirs;

  /* 
    * ToggleDirs is a boolean variable which decides whether user want diagnal moves or not.
    * Each time this function is clicked this variable is switched between true and false.
  */
  toggleDirs = !toggleDirs; 

  /* If ToggleDirs is true then do add the diagonal moves stored in the dia variable to our dirs and update the dirs */
  if (toggleDirs) {

    /* Concating Dirs containing non-diagonal moves with diagonal moves stores in dia variable */
    dirs = dirs.concat(dia);

    /* After updating also change the content to Diagonal allowed to informed the user diagonals are allowed */
    document.getElementById("diagonalMoves").innerHTML = "Diagonal Allowed";
  } else { 
    /* Otherwise also change the content to Diagonal NA to informed the user diagonals are not-allowed */
    document.getElementById("diagonalMoves").innerHTML = "Diagonal NA";
  }
}

/*-------------------------------------------------------------------------------------------------------------------------------- */

/* 
  * Purpose: This is a helper function that is used to update three attributes width, border and borderColor to desired value. 
  * Called: This function is called from triggerNav function to remove the duplicity of the code.
*/
function setAttributePanel(width, border, borderColor){
  document.getElementById("mySidepanel").style.width = width; /* Set width acc to user */
  document.getElementById("mySidepanel").style.border= border; /* Set border acc to user */
  document.getElementById("mySidepanel").style.borderColor= borderColor; /* Set border-color acc to user */
}

/*-------------------------------------------------------------------------------------------------------------------------------- */

/*
 * Purpose: This Function is used to open and close the Left Nav-Bar on the screen.
 * Achieved: Addint this functionality makes the panel to dissapear and appear whener the user clicks the customize button on screen.
 */
function triggerNav() {
  
  /* 
    * navopen var stores the info that the user wants to show the navbar or to hide it.
    * navopen is a boolean variable that switches the boolean variable from true to false or vice versa 
  */
  navopen = !navopen;

  /* 
    * If the navopen is true that means User wants to show the navbar then add width, border and border-color by calling the 
    * helper function stated above.
    * These values are observations and hence you can change according to you.
  */
  if(navopen){
    setAttributePanel("350px", "5px solid", "white");
  }else{

    /* Otherwise make the width: 0, border: "", border-color: "" in order to hide the side panel */
    setAttributePanel("0px", "", "");
  }
}

/*-------------------------------------------------------------------------------------------------------------------------------- */

/* 
  * Purpose: This function is used to flip the card placed on the top most part of website to show the instructions.
  * Called: This function is called whenever the magic button is clicked on the screen to rotate the flip card or to undo it.
*/
function flippCard(){

  /* Flipp is a boolean variable that stores whether we need to flip the card or to not. */
  flipp = !flipp;

  /* save the tranform attribute value to rotate the card in temp variable */
  let temp = "rotateY(180deg)";

  /* If the flipp stores false that means User dont want to flip the card or want to undo it so remove the attribute from temp */
  if(!flipp){
    temp = ""; /* Overwriting the temp to forget prev value */
  }

  /* As decided: update the transform attribute of the front-card element to temp */
  document.getElementById("front-card").style.transform = temp;
}

/*-------------------------------------------------------------------------------------------------------------------------------- */


/* -------------------------------------------- Algorithm ---- BFS ---------------------------------------------------------------*/

/* Start the algorithm */
var printPath = function decodeFromRes(res) {
  let arr = res.split(",");
  // console.log(arr);
  for (let i = 1; i < arr.length - 1; i++) {
    let temp = arr[i].split(":");
    let nx = parseInt(temp[0]);
    let ny = parseInt(temp[1]);
    matrix[nx][ny] = 9;
    document.getElementById(`${nx}:${ny}`).style.fill = "rgb(0, 68, 137)";
  }
};

function search(matrix) {
  clearPath("wall");
  clearPath("path");
  let queue = [];
  let src_x = split(src_crd, 0),
    src_y = split(src_crd, 1);

  queue.push([src_x, src_y, `${src_x}:${src_y},`]);
  let visited = new Set();

  while (queue.length != 0) {
    let rp = queue.shift();
    let x = parseInt(rp[0]);
    let y = parseInt(rp[1]);
    let path = rp[2];

    if (visited.has(`${x}:${y}`)) continue;
    visited.add(`${x}:${y}`);

    // [[-1, 0], [1, 2]]
    for (let i = 0; i < dirs.length; i++) {
      let newX = x + parseInt(dirs[i][0]); // -1
      let newY = y + parseInt(dirs[i][1]); // 0

      if (newX <= 0 || newX > rows - 2 || newY <= 0 || newY > cols - 2) {
        continue;
      }
      
      if (matrix[newX][newY] != 1 && matrix[newX][newY] != 2) {
        if (matrix[newX][newY] === 3) {
          continue;
        }
        document.getElementById(`${newX}:${newY}`).style.fill = "rgb(149, 202, 255)";
        matrix[newX][newY] = 7;
      } else if (matrix[newX][newY] === 2) {
        printPath(path + `${newX}:${newY}`);
        return;
      } else {
        continue;
      }
      queue.push([newX, newY, path + `${newX}:${newY},`]);
    }
  }

  console.log("No Path Exists");
}

function bfs() {
  search(matrix);
}

/* ---------------------------------------------------------------------------------------------*/

/* --------------------------------Bi:BFS----------------------------------------------------- */
/* Start the algorithm */

function fillArray(parent, p, end) {
  let arr = [];
  let k = p;
  while (k !== end) {
    arr.push(parent[k]);
    k = parent[k];
  }
  return arr;
}

function printPathBi(p1, p2, k, src, dst) {
  let arr1 = fillArray(p1, k, src).reverse();
  let arr2 = fillArray(p2, k, dst);
  arr1.push(k);
  let arr = arr1.concat(arr2);
  for (let i = 1; i < arr.length - 1; i++) {
    let temp = arr[i].split(":");
    let nx = parseInt(temp[0]);
    let ny = parseInt(temp[1]);
    matrix[nx][ny] = 9;
    document.getElementById(`${nx}:${ny}`).style.fill = "rgb(0, 68, 137)";
  }
}

function bi_bfs(matrix, queue, visited, parent) {
  let rv = queue.shift();
  let x = parseInt(rv[0]),
    y = parseInt(rv[1]);

  for (let i = 0; i < dirs.length; i++) {
    let newX = x + dirs[i][0],
      newY = y + dirs[i][1];

    if (
      newX <= 0 ||
      newY <= 0 ||
      newX > rows - 2 ||
      newY > cols - 2 ||
      matrix[newX][newY] === 1 ||
      matrix[newX][newY] === 2
    ) {
      continue;
    }

    if (!visited.has(`${newX}:${newY}`) && matrix[newX][newY] !== 3) {
      parent[`${newX}:${newY}`] = `${x}:${y}`;
      visited.add(`${newX}:${newY}`);
      document.getElementById(`${newX}:${newY}`).style.fill =
        "rgb(149, 202, 255)";
      // document.getElementById(`${newX}:${newY}`).style.transition = "1s";
      matrix[newX][newY] = 7;

      queue.push([newX, newY]);
    }
  }
}

function intersection(v1, v2) {
  for (const k of v1) {
    if (v2.has(k)) {
      return k;
    }
  }

  return -1;
}

function Bisearch(matrix) {
  console.log(dirs);
  let q1 = [],
    q2 = [],
    v1 = new Set(),
    v2 = new Set(),
    p1 = {},
    p2 = {};
  let src_x = split(src_crd, 0),
    src_y = split(src_crd, 1),
    dst_x = split(dst_crd, 0),
    dst_y = split(dst_crd, 1);

  q1.push([src_x, src_y]);
  v1.add(`${src_x}:${src_y}`);
  q2.push([dst_x, dst_y]);
  v2.add(`${dst_x}:${dst_y},`);

  p1[`${src_x}:${src_y}`] = -1;
  p2[`${dst_x}:${dst_y}`] = -1;

  while (q1.length !== 0 && q2.length !== 0) {
    bi_bfs(matrix, q1, v1, p1);
    bi_bfs(matrix, q2, v2, p2);

    let intr = intersection(v1, v2);
    if (intr !== -1) {
      printPathBi(p1, p2, intr, `${src_x}:${src_y}`, `${dst_x}:${dst_y}`);
      return;
    }
  }
  console.log("No path exists");
}

function bibfs() {
  Bisearch(matrix);
}

/*-------------------------------------------------------------------------------------- */





 /* This function is triggered whenever any box is clicked*/
let initiate_coloring_walls = false, switch_coloring_walls = false;
let cnt = 2, isSrc = true, isDst = true, navopen = false, flipp = false;
let walls_color = "rgb(45, 45, 45)", border_color="rgb(0, 16, 4)", grid_color="rgb(105, 105, 105)";
window.src_crd = "10:15";
window.dst_crd = "10:30";
window.rows = 36, window.cols = 50;
var matrix = createMatrix(), isBirectional = false;
var toggleDirs = false;
var dirs = [
  [-1, 0],
  [1, 0],
  [0, 1],
  [0, -1],
],
  fdirs = [
  [-1, 0],
  [1, 0],
  [0, 1],
  [0, -1],
];

const dia = [
  [-1, 1],
  [-1, -1],
  [1, -1],
  [1, 1],
];
plot();
 
 