function plot(rows = 50, cols = 50) {
  let c = "", y = 0;
    for (let i = 0; i < rows; i++) {
      var x = 0;
      for (let j = 0; j < cols; j++) {
        c += `<rect id=${
          i + ":" + j
        } x="${x}" y="${y}" width="30" height="30" fill="rgb(255, 255, 255)" r="0" rx="0" ry="0"  stroke="#000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); stroke-opacity: 0.2;" stroke-opacity="0.2" ></rect>`;
        x += 30;
      }
      y += 30;
    }
    document.getElementById("container").innerHTML = c;
    document.getElementById(src_crd).style.fill = "rgb(0, 255, 0)";
    document.getElementById(dst_crd).style.fill = "rgb(255, 0, 0)";

  }


  function split(str, idx) {
    return str.split(":")[idx];
  }

  /* This function is triggered whenever any box is clicked*/
  let initiate_coloring_walls = false, switch_coloring_walls = false;
  function activate(event){
    initiate_coloring_walls = true;
    if(document.getElementById(event.target.id).style.fill === "rgb(128, 128, 128)"){
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
    if (cnt == 0) {
      if (id === dst_crd) {
        return;
      }
     
      elem.style.fill = "rgb(0, 255, 0)";
      isSrc = true;
      src_crd = id;
  
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
    } else {
      if (switch_coloring_walls && elem.style.fill.length === 0) {
        elem.style.fill = "rgb(128, 128, 128)";
      } else {
        if (elem.style.fill === "rgb(0, 255, 0)") {
          cnt = 0;
          isSrc = false;
          src_crd = "";
          elem.style.fill = "";
        } else if (elem.style.fill === "rgb(255, 0, 0)") {
          cnt = 1;
          isDst = false;
          dst_crd = "";
          elem.style.fill = "";
        } else if (elem.style.fill === "rgb(0, 0, 255)") {
          return;
        }

        if(!switch_coloring_walls){
          elem.style.fill = "";
        }
      }
    }
  }
  
let cnt = 2, isSrc = true, isDst = true;
window.src_crd = "10:15";
window.dst_crd = "10:30";
plot();