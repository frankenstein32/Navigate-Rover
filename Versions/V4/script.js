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
    else cnt = 56;
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
        * 
        * If val === 9 means we are here to clear path and value at this location is 9 that means this rect is part of shortest path
        * denoted on the screen by the algorithm hence clear the location.
        * If not then we are here to clear walls then no need to clear this location 
        * 
        * After handling all corner cases: Not check whether the value at this location is wall or not.
        * If yes then unPaint the rect as we are surely called by the clear wall button as all possiblities of clear path we have seen
        * in above conditions
      */
      if ((val === 9 && (matrix[i][j] === 7 || matrix[i][j] === 9)) || (matrix[i][j] === val)) {
        matrix[i][j] = 0; /* Marking the matrix as empty */
        document.getElementById(`${i}:${j}`).style.fill = ""; /* Marking the color as default of this rect on grid */
        continue; /* Every rect can have only one colour so no need to go further */
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

/* 
  * Purpose: This function is a helper function called to color the shortest path found by algorithm and marked the same in matrix.
  * Called: This function is called by our BFS algorithm after finding the path from src to dst.
  * Params: Res is a String containing the path from src to dst including src and dest location and hence it will look like this ->
  *  for e.g. res = "12:34,12:35,12:36,12:37," [There will be an extra comma at the end and hence needs to be handled] 
  */

var printPath = function decodeFromRes(res) {

  /* 
    * Splitting the path stored in res by ','[comma] in order to get each location as an array of String 
    * After splitting the array for above example will be like -> ['12:34', '12:35', '12:36', '12:37', ''] As you can see there exist
    * an extra element at the end and at the starting exist the src location and at the second last element exist the destination 
    * location.
  */
  let arr = res.split(",");

  /* 
    * Loop for the array created after split and Do not forget to skip 0th and last 2 elements otherwise they will be coloured too
    * Hence, src and dest locations will be coloured and user will not be able to src and dest again so ignore these indices.  
  */
  for (let i = 1; i <= arr.length - 2; i++) {

    /* Now split the individual element of array with ':' [colon] to get row_number and col_number  */
    let temp = arr[i].split(":");

    /* Convert row_number to number inorder to use it as row index of matrix */
    let nx = parseInt(temp[0]);

    /* Convert col_number to number inorder to use it as col index of matrix */
    let ny = parseInt(temp[1]);

    /* Update the matrix value to 9 to denote that the current rect is part of shortest path */
    matrix[nx][ny] = 9;

    /* Update the color of shortest path to show the User there exist an Shortest Path */
    document.getElementById(`${nx}:${ny}`).style.fill = "rgb(0, 68, 137)";
  }
};

/*-------------------------------------------------------------------------------------------------------------------------------- */

/*
  * Purpose: This Function perfroms the BFS search from source to destination avoiding walls and borders
  * Called: This function is called whenever the User wants to search with Single Directionality
  * This is an basic BFS algorithm you might have studied everywhere in your course-work.
  * Params: It accepts matrix containing the whole status of src, dst, walls, borders etc.
*/
function search(matrix) {

  /* Before Starting You can Clear wall and path by youself if User forgot to clear the prev result */
  clearPath("wall");
  clearPath("path");

  /* 
    * Declare and initialize an Empty Queue to store the indices and path of each location while searching 
    * Each element of queue will be an array of size - 3 which means with indices 0, 1 and 2.
    * 0th element -> 'x' coordinate of the current cell
    * 1st element -> 'y' coordinate of the current cell
    * 2nd element -> 'path' stores the path till current cell starting from source cell.
  */
  let queue = [];

  /* Extracting the 'x' and 'y' Coordinate of the source location */
  let src_x = split(src_crd, 0), src_y = split(src_crd, 1);

  /* Adding the first element in the queue with coordinate set to coordinate of src location and path containing source location */
  queue.push([src_x, src_y, `${src_x}:${src_y},`]);

  /* A Set to mark the location as visited so that our algorithm will be saved from getting in an infinite loop */
  let visited = new Set();

  /* 
    * Some set of Operations will be done on the Queue till the Queue is Empty.
    * 1. Extract the coordinates and path of the front element in the Queue.
    * 2. check if the location with these coordinates is visited or not.
        * 2.1 If visited then continue, no need to proceed further.
        * 2.2 Otherwise Traverse the other neighbouring locations and check if these locations are valid or not.
              * 2.2.1 If neighbouring location is valid then, color it and push_back in the queue to traverse it later.
              * 2.2.2 Otherwise If locations is not valid then check the other neighbours.
        * 2.3 If you got the destination location anywhere while performing the same operations.
              * 2.3.1 If yes then send the path constructed to printPath function to print and color the shortest path.
              * 2.3.2 Otherwise the path doesnot exist between src and dst, hence print No Path Exist and return.
    * 3. END  
  */

  while (queue.length != 0) {

    /* Remove the Front element from Queue and extract data from the element popped */
    let rp = queue.shift();

    /*  Exract the 'x' coordinate, 'y' coordinate and 'path' from the front element of the Queue */
    let x = parseInt(rp[0]), y = parseInt(rp[1]), path = rp[2];

    /* If the Location is already visited that means is present in the set that means do nothing */
    if (visited.has(`${x}:${y}`)) continue; 

    /* If the location is new then mark the current location as visited by adding in the set */
    visited.add(`${x}:${y}`);

    /* Now loop over all of the neighbours direction available to the cell */
    for (let i = 0; i < dirs.length; i++) {

      /* 'newX' is the new 'x' coordinate constructed by adding either 0, -1 or +1 to the current x */
      let newX = x + parseInt(dirs[i][0]); //-1

      /* 'newY' is the new 'y' coordinate constructed by adding either 0, -1 or +1 to the current y */
      let newY = y + parseInt(dirs[i][1]); //0

      /* If the current neighbour is out of bound or lies on border then still do nothing and continue */
      if (newX <= 0 || newX > rows - 2 || newY <= 0 || newY > cols - 2) {
        continue;
      }
      
      /* If the locations is free from corner cases then check if the location must not be src and neither dst */
      if (matrix[newX][newY] != 1 && matrix[newX][newY] != 2) {

        /* If Location is neither src nor destination then check if it wall or not. If yes then continue */
        if (matrix[newX][newY] === 3) {
          continue;
        }

        /* Control here defines that this cell is neither src, nor destination and nor wall then color it as extra path */
        document.getElementById(`${newX}:${newY}`).style.fill = "rgb(149, 202, 255)";
        matrix[newX][newY] = 7; /* Mark the extra path in the matrix as '7' */
      } else if (matrix[newX][newY] === 2) { /* If the location is Destination then search is finished */
        printPath(path + `${newX}:${newY}`); /* Call the Print Path with Destination added separately */
        return; /* Now no need to travere the aim is achieved and hence return */
      } else {
        continue; /* Any other case then continue no need to advance further */
      }

      /* If the neighbour is safe from borders and beyond that and not a wall then append it in the queue for future traversal */
      queue.push([newX, newY, path + `${newX}:${newY},`]);
    }
  }

  /* If there exist no path from src to dst then Print the info */
  console.log("No Path Exists");
}

/* Purpose: This is an helper Function to call the main BFS algo named as search */
function bfs() {

  /* Calling search the main algo written to achieve the shortest path using BFS */
  search(matrix);
}

/*-------------------------------------------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------- Bi:BFS ------------------------------------------------------------- */

/*                                                           Algorithm 
  * The Main idea behind using Bi-BFS is to perform BFS from both locations src and dst.
  * We will keep track of the parent of each vertex and parent refers to the location from which you have reached the current location.
  * We have to maintain two queues and two parent storing data-structure to maintain data for both src path and dst path.
  * If path of both src and dst intersects at anytime that means now we need to traverse back from this intersecting location for both
  * of the location inorder to find path from intersection upto src and from intersection to destination.
  * At last we will apppend the answer for both results and that will be our whole path.
*/

/* ------------------------------------------------------------------------------------------------------------------------------- */

/* 
  * Purpose: This is an helper Function which basically creates an array from an Object containing parent of each location.
  * Params: Parent Object contains that for each location which is the parent of each location and parent here refers that
  * from which location you reached which location. for e.g. for shortest path algo reached from coordinate 12:2 to 13:2 hence,
  * for 13:2 parent is 12:2 so it can be visualized as parent = {"13:2" : "12:2"} [Demo purpose].
  * p: parameter here defines the intersection point when both we perform BFS from both src and dst [Hence called Bi-BFS].
*/
function fillArray(parent, p, end) {

  /* Creating an empty array to store the locations */
  let arr = [];

  /* k variable here can be treated as temporary parent which is intersection location initially */
  let k = p;

  /* The whole loop works till we reach the end of the locations either [Src or Dest] */
  while (k !== end) { /* If current temporary parent is not end then traverse next parent */
    arr.push(parent[k]); /* Add the current parent in the array to store in the answer */
    k = parent[k]; /* Update the current temporary parent with the parent of current location */
  }

  /* Return the array created */
  return arr;
}

/* ------------------------------------------------------------------------------------------------------------------------------- */

/* 
  * Purpose: This function is an helper Function that starting from the Intersection of both src and dst generates the path.
 */
function printPathBi(p1, p2, k, src, dst) {

  /* FillArray returns the path from intersecting location 'k' upto source and hence will be in reverseorder. */
  let arr1 = fillArray(p1, k, src).reverse(); /* reversing explicitly to get the correct path. */

  /* Fill Array returns the path from intersection location 'k' upto destination and hence will be straight */
  let arr2 = fillArray(p2, k, dst); /* No need to reverse */

  /* 
    * Add the intersecting in the first array because:-
      * arr1: contains the path from src to K [K is excluded].
      * arr2: contains the path from k to dst [K is excluded].
      * In order to get full path we need to do -> arr1 + K + arr2 [Full path from src to dst including intersection]
   */
  arr1.push(k); /* performing arr1 + K */

  /* Performing arr1 + K + arr2 [As stated above] */
  let arr = arr1.concat(arr2);

  /* 
    * Loop for the array created after split and Do not forget to skip 0th and last 2 elements otherwise they will be coloured too
    * Hence, src and dest locations will be coloured and user will not be able to src and dest again so ignore these indices.  
  */
  for (let i = 1; i < arr.length - 1; i++) {

    /* Now split the individual element of array with ':' [colon] to get row_number and col_number  */
    let temp = arr[i].split(":");

     /* Convert row_number to number inorder to use it as row index of matrix */
    let nx = parseInt(temp[0]);

    /* Convert col_number to number inorder to use it as col index of matrix */
    let ny = parseInt(temp[1]);

     /* Update the matrix value to 9 to denote that the current rect is part of shortest path */
    matrix[nx][ny] = 9;

     /* Update the color of shortest path to show the User there exist an Shortest Path */
    document.getElementById(`${nx}:${ny}`).style.fill = "rgb(0, 68, 137)";
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------- */

/* 
  * Purpose: This is an helper function to perform BFS for individual Queue [queue for src as well as queue for dst] 
  * Params: matrix is the main grid storing info, queue is the datastructure storing locations to traverse which can be of either 
  * src or destination, parent refers to the Array of Object containing parent of each location [can be of src as well as dst].
*/
function bi_bfs(matrix, queue, visited, parent) {

  /* Getting the front element from the queue */
  let rv = queue.shift();

  /* extract the 'x' and 'y' coordinate of the popped element */
  let x = parseInt(rv[0]), y = parseInt(rv[1]);

  /* Loop over each neighbour directions */
  for (let i = 0; i < dirs.length; i++) {

    /* 'newX' is the new 'x' coordinate constructed by adding either 0, -1 or +1 to the current x */
    /* 'newY' is the new 'y' coordinate constructed by adding either 0, -1 or +1 to the current y */
    let newX = x + dirs[i][0], newY = y + dirs[i][1];

    /* If the neighour is invalid: border or beyond border or src or destination then no need to do anything continue */
    if ( newX <= 0 || newY <= 0 || newX > rows - 2 || newY > cols - 2 || matrix[newX][newY] === 1 || matrix[newX][newY] === 2) {
      continue;
    }

    /* If the neighbour location is not already visited and there exist no wall then it can be part of our path */
    if (!visited.has(`${newX}:${newY}`) && matrix[newX][newY] !== 3) {

      /* save the parent of the neighbour coordinate to current coordinate */
      parent[`${newX}:${newY}`] = `${x}:${y}`;

      /* Mark the neighbour coordinate as visited by adding it into set */
      visited.add(`${newX}:${newY}`);

      /* Now get the element and update the color so that user can visualize progress */
      document.getElementById(`${newX}:${newY}`).style.fill = "rgb(149, 202, 255)";

      /* Mark the extra path as '7' to denote extra path in our matrix */
      matrix[newX][newY] = 7;

      /* After checking the corner cases: Still the neighbour is save then append in the queue to traverse in future. */
      queue.push([newX, newY]);
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------- */

/* Purpose: This is an helper function to check whether two sets contains anything in common or not. */
function intersection(v1, v2) {

  /* Loop over set 1 and extract each element. */
  for (const k of v1) {

    /* If the same element exist in second set then return it because this element is the intersection. */
    if (v2.has(k)) {
      return k; /* returning intersecting element. */
    }
  }

  return -1; /* return -1 if no intersection found. */
}

/* ------------------------------------------------------------------------------------------------------------------------------- */

/* Purpose: This function act as a hub for the whole algorithm of Bi-BFS */
function Bisearch(matrix) {

  /* Create two empty queues, Sets, Array of objects for src and dst both */
  let q1 = [], q2 = [], v1 = new Set(), v2 = new Set(), p1 = {}, p2 = {};

  /* Extract src 'x' and 'y' coordinate as well as for dst 'x' and 'y' coordinate */
  let src_x = split(src_crd, 0), src_y = split(src_crd, 1), dst_x = split(dst_crd, 0), dst_y = split(dst_crd, 1);

  /* Add the src location in q1 and mark it as visited and destination location in q2 and mark it as visited.  */
  q1.push([src_x, src_y]); /* Add src location in q1 */
  v1.add(`${src_x}:${src_y}`); /* Mark src location as visited */
  q2.push([dst_x, dst_y]); /* Add dst location in q2 */
  v2.add(`${dst_x}:${dst_y},`); /* Mark dst location as visited */

  /* Mark the parent of src location as '-1' as no parent is there of src */
  p1[`${src_x}:${src_y}`] = -1;

  /* Mark the parent of dst location as '-1' as no parent is there of dst */
  p2[`${dst_x}:${dst_y}`] = -1;

  /* Loop over till both are non-empty */
  while (q1.length !== 0 && q2.length !== 0) {

    /* Call bi_bfs helper function for q1, v1 and p1 */
    bi_bfs(matrix, q1, v1, p1);

    /* Call bi_bfs helper function for q2, v2 and p2 */
    bi_bfs(matrix, q2, v2, p2);

    /* Call the intersection helper function to find the intersection till now in their visited sets */
    let intr = intersection(v1, v2);

    /* if Intersection is not -1 then surely path is present Otherwise algorithm will keep looking */
    if (intr !== -1) {

      /* Calling helper function to print the path using parent of both path with given intersection location */
      printPathBi(p1, p2, intr, `${src_x}:${src_y}`, `${dst_x}:${dst_y}`);
      return; /* After printing return as no need to go further */
    }
  }

  /* If no path exist then simply print and return */
  console.log("No path exists");
}

/* ------------------------------------------------------------------------------------------------------------------------------- */

/* Purpose: This is an helper function to invoke the Bisearch function */
function bibfs() {
  Bisearch(matrix);
}

/*----------------------------------------------------- variables ---------------------------------------------------------------- */

/* 
  * initiate_coloring_walls denotes to whether color any rect or not.[For detail see reply_click()]
  * switch coloring_walls denotes to whether switch the coloring from creation of walls to removal 
  * of walls or vice versa. [for detail see activate()]
*/
let initiate_coloring_walls = false, switch_coloring_walls = false;

/* 
  * cnt: [for detail see reply_click()]
  * cnt = 0 -> It denotes we want to plot src.
  * cnt = 1 -> It denotes we want to plot dst.
  * cnt = anyvalue -> It denotes we want to either plot wall or remove src or remove dst.
  * 
  * isSrc: [for detail see reply_click()]
  * It denotes whether src has already placed in grid or not.
  * isDst: [for detail see reply_click()]
  * It denotes wether dst has already placed in grid or not.
  * 
  * navopen: [for detail see triggerNav()] 
  * It denotes whether we want to open the nav or close the nav.
  * 
  * flipp: [for detail see flippCard()]
  * It denotes whether to flip the flash card or not.
 */

let cnt = 2, isSrc = true, isDst = true, navopen = false, flipp = false;

/*
  * walls_color: It denotes the walls color is to be painted.
  * border_color: It denotes the border color is to be painted.
  * grid_color: It denotes the grid rects color is to be painted.
 */
let walls_color = "rgb(45, 45, 45)", border_color="rgb(0, 16, 4)", grid_color="rgb(105, 105, 105)";

/*
  * window: This defines the global declaration and initialization of the variable [You can remove as whole code is in same file].
  * src_crd: denotes the src coordinates [selected random for now].
  * dst_crd: denotes the dst coordintates [selected random for now].
  * rows: denotes the number of rows in grid.
  * cols: denotes the number of cols in grid.
 */
window.src_crd = "10:15";
window.dst_crd = "10:30";
window.rows = 36, window.cols = 50;

/*
   * matrix: It stores the matrix created in Function createMatrix()
   * isBirectional: It denotes the whether the algo is bi-directional or not [for detail see biDirection()]
 */

var matrix = createMatrix(), isBirectional = false;

/*
  * toggleDirs: denotes the directions list whether contain diagonal moves or not [for detail see isDiagonal()]
  * dirs: It stores the without diagonal moves initially to initialize fdirs to this value.
  * fdirs: It stores the non-diagonal moves initially but can be concated with diagonal moves. [for detail see isDiagonal()]
  * dia: It stores the diagonal moves and hence it is used to append the fdirs with diagonal moves.
 */
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

/* Plotting the grid without even waiting for any event to happen */
plot();
 
 