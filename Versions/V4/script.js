function createMatrix() {
  function initArray(matrix, rows, cols) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (i == 0 || j == 0 || i == rows - 1 || j == cols - 1) {
          matrix[i][j] = 5;
        } else {
          matrix[i][j] = 0;
        }
      }
    }
  }
  var matrix = new Array(rows);
  for (let i = 0; i < rows; i++) {
    matrix[i] = new Array(cols);
  }

  initArray(matrix, rows, cols);
  return matrix;
}

function plot(rows = 36, cols = 64) {
  let c = "", y = 0;
    for (let i = 0; i < rows; i++) {
      var x = 0;
      for (let j = 0; j < cols; j++) {
        let colr = grid_color;

        if(i === 0 || j === 0 || i === rows - 1 || j === cols - 1){
          colr = border_color;
        }
        c += `<rect id=${
          i + ":" + j
        } x="${x}" y="${y}" width="30" height="30" fill="${colr}" r="0" rx="0" ry="0"  stroke="#000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); stroke-opacity: 0.2;" stroke-opacity="0.2"></rect>`;
        x += 30;
      }
      y += 30;
    }
    document.getElementById("container").innerHTML = c;
    document.getElementById(src_crd).style.fill = "rgb(0, 255, 0)";
    document.getElementById(dst_crd).style.fill = "rgb(255, 0, 0)";
    matrix[split(src_crd, 0)][split(src_crd, 1)] = 1;
    matrix[split(dst_crd, 0)][split(dst_crd, 1)] = 2;

  }


  function split(str, idx) {
    return str.split(":")[idx];
  }

  /* This function is triggered whenever any box is clicked*/
  let initiate_coloring_walls = false, switch_coloring_walls = false;
  function activate(event){
    initiate_coloring_walls = true;
    if(document.getElementById(event.target.id).style.fill === walls_color){
      switch_coloring_walls = false;
    }else{
      switch_coloring_walls = true;
    }
    reply_click(event);
  }

  function deactivate(){
    initiate_coloring_walls = false;
  }

  function reply_click(event) {

    if(!initiate_coloring_walls) return;
    let id = event.target.id;
    let elem = document.getElementById(id);
    let x = parseInt(split(id, 0));
    let y = parseInt(split(id, 1));

    if (x == 0 || x == rows - 1 || y == 0 || y == cols - 1) {
      return;
    }
  
    if (cnt == 0) {
      if (id === dst_crd) {
        return;
      }
     
      elem.style.fill = "rgb(0, 255, 0)";
      isSrc = true;
      src_crd = id;
      matrix[split(src_crd, 0)][split(src_crd, 1)] = 1;
  
      if (!isDst) cnt++;
      else cnt = 10;
    } else if (cnt == 1) {
      if (id === src_crd) {
        return;
      }
      elem.style.fill = "rgb(255, 0, 0)";
      cnt++;
      dst_crd = id;
      isDst = true;
      matrix[split(dst_crd, 0)][split(dst_crd, 1)] = 2;
    } else {
      if (switch_coloring_walls && elem.style.fill.length === 0) {
        elem.style.fill = walls_color;
        matrix[split(id, 0)][split(id, 1)] = 3;
      } else {
        if (elem.style.fill === "rgb(0, 255, 0)") {
          cnt = 0;
          isSrc = false;
          src_crd = "";
          elem.style.fill = "";
          matrix[split(id, 0)][split(id, 1)] = 0;
        } else if (elem.style.fill === "rgb(255, 0, 0)") {
          cnt = 1;
          isDst = false;
          dst_crd = "";
          elem.style.fill = "";
          matrix[split(id, 0)][split(id, 1)] = 0;
        } else if (elem.style.fill === "rgb(0, 0, 255)") {
          return;
        }

        if(!switch_coloring_walls){
          matrix[split(id, 0)][split(id, 1)] = 0;
          elem.style.fill = "";
        }
      }
    }
  }

/* Clearing Walls as well as Path*/
function clearPath(obj) {
  let val = 0;
  if (obj.id === "wall") {
    val = 3;
  } else {
    val = 9;
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (val === 9 && matrix[i][j] === 7) {
        matrix[i][j] = 0;
        document.getElementById(`${i}:${j}`).style.fill = "";
        continue;
      }

      if (val === 9 && matrix[i][j] === 9) {
        matrix[i][j] = 0;
        document.getElementById(`${i}:${j}`).style.fill = "";
      }
      if (matrix[i][j] === val) {
        matrix[i][j] = 0;
        document.getElementById(`${i}:${j}`).style.fill = "";
      }
    }
  }
}

/* Bi - directionality */
function biDirection() {
  isBirectional = !isBirectional;
  if (isBirectional) {
    document.getElementById("directions").innerHTML = "Bi-Directional";
  } else {
    document.getElementById("directions").innerHTML = "Single-Directional";
  }
}

/* ------------------------- Algorithm ---- BFS ------------------------------------------------*/

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

/* Initiating the Algorithm*/
function Direct() {
  if (isBirectional) {
    bibfs(matrix);
  } else {
    bfs(matrix);
  }
}

/* Diagonality Addtion */
//To initiate the diagonal moves
function isDiagonal() {
  dirs = fdirs;
  toggleDirs = !toggleDirs;
  if (toggleDirs) {
    dirs = dirs.concat(dia);
    document.getElementById("diagonalMoves").innerHTML = "Diagonal Allowed";
  } else {
    document.getElementById("diagonalMoves").innerHTML = "Diagonal NA";
  }
}

/*Side Panel onclick Listeners*/

/* Set the width of the sidebar to 250px (show it) */
function setAttributePanel(width, border, borderColor){
  document.getElementById("mySidepanel").style.width = width;
  document.getElementById("mySidepanel").style.border= border;
  document.getElementById("mySidepanel").style.borderColor= borderColor;
}
function triggerNav() {
  
  navopen = !navopen;
  if(navopen){
    setAttributePanel("350px", "5px solid", "white");
  }else{
    setAttributePanel("0px", "", "");
  }
}

function flippCard(){
  flipp = !flipp;
  let temp = "rotateY(180deg)";
  if(!flipp){
    temp = "";
  }
  document.getElementById("front-card").style.transform = temp;
}


  
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