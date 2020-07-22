function plot(rows = 50, cols = 50) {
    for (let i = 0; i < rows; i++) {
      var x = 0;
      for (let j = 0; j < cols; j++) {
        let colr = "rgb(255, 255, 255)";
        if (j == 0 || i == 0 || j == cols - 1 || i == rows - 1) {
          colr = "rgb(43, 45, 47) ";
        }
        c += `<rect id=${
          i + ":" + j
        } x="${x}" y="${y}" class="button" onClick=reply_click(this) width="30" height="30" r="0" rx="0" ry="0" fill="${colr}" stroke="#000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); stroke-opacity: 0.2;" stroke-opacity="0.2"></rect>`;
        x += 30;
      }
      y += 30;
    }
    document.getElementById("container").innerHTML = c;
  }

  plot();