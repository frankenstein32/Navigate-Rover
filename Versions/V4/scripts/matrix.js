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
  var matrix = createMatrix();
  export { matrix };
  