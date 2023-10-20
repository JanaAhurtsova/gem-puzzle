export const getMatrix = (arr, selectedSize) => {
  let matrix = Array.from(Array(selectedSize), () => new Array(selectedSize));
  let x = 0;
  let y = 0;

  for (let i = 0; i < arr.length; i++) {
    if (x >= selectedSize) {
      y++;
      x = 0;
    }
    matrix[y][x] = arr[i];
    x++;
  }
  return matrix;
};

export const isValidForSwap = (coords1, coords2) => {
  const diffX = Math.abs(coords1.x - coords2.x);
  const diffY = Math.abs(coords1.y - coords2.y);

  return (
    (diffX === 1 || diffY === 1) &&
    (coords1.x === coords2.x || coords1.y === coords2.y)
  );
};

export const swap = (coords1, coords2, matrix) => {
  const coords1Num = matrix[coords1.y][coords1.x];
  matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
  matrix[coords2.y][coords2.x] = coords1Num;
};

export const findCoordinatesByNum = (num, matrix) => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === num) {
        return { x, y };
      }
    }
  }
};

export const randomShuffle = (arr) => {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

export const isSolvable = (matrix, selectedSize) => {
  let matrixArr = matrix.flat();
  let pos = findEmptyPos(matrix, selectedSize);
  let inversions = getInversion(matrixArr, selectedSize ** 2);
  if (selectedSize % 2 !== 0) {
    return inversions % 2 === 0;
  } else {
    if (pos % 2 === 0) {
      return inversions % 2 !== 0;
    } else {
      return inversions % 2 === 0;
    }
  }
};

const findEmptyPos = (matrix, selectedSize) => {
  for (let i = selectedSize - 1; i >= 0; i--) {
    for (let j = selectedSize - 1; j >= 0; j--) {
      if (matrix[i][j] == 0) {
        return selectedSize - i;
      }
    }
  }
};

function getInversion(arr, countTile) {
  let inversion = 0;
  for (let i = 0; i < countTile - 1; i++) {
    for (let j = i + 1; j < countTile; j++) {
      if (arr[j] && arr[i] && arr[i] > arr[j]) {
        inversion++;
      }
    }
  }
  return inversion;
}

export const isWin = (matrix, countTile) => {
  let winArr = new Array(countTile).fill(0).map((item, i) => i + 1);
  winArr[winArr.length - 1] = 0;
  let matrixArr = matrix.flat();
  for (let i = 0; i < winArr.length; i++) {
    if (matrixArr[i] !== winArr[i]) {
      return false;
    }
  }
  return true;
};

export const sortResults = (wins) => {
  const results = JSON.parse(localStorage.getItem('result')) ?? wins;
  results.sort((a,b) => {
    if (a.time > b.time) {
      return 1;
    } else if(a.time < b.time) {
      return -1;
    } else {
      if (a.move > b.move) {
        return 1;
      } else if (a.move < b.move){
        return -1;
      } else {
        return;
      }
    }
  })
  
  return results.length > 10 ? results.slice(0, 10) : results;
};
