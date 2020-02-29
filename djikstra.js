// let tempSeize = document.querySelector("#size").value || 40;
let size = 40;

let height = 700;
let width = 700;

let row = Math.floor(height / size);
let col = Math.floor(width / size);
let grid = [];
let openSet = [];
let current;
let path = [];
let closedSet = [];
let canvas = document.querySelector("#canvas");
let container = document.querySelector(".container");

// let can = document.querySelector("#can");
let con = canvas.getContext("2d");

let addOrRemove = true;

function remove() {
  const button = document.querySelector(".remove");
  let classes = button.getAttribute("class");
  const classArr = classes.split(" ");
  console.log(classArr);
  if (classArr.length == 2) {
    button.setAttribute("class", classes + " active");
  }

  const buttonAdd = document.querySelector(".add");
  let classesRemove = buttonAdd.getAttribute("class");
  const classArrREmove = classesRemove.split(" ");
  console.log(classArrREmove);
  if (classArrREmove.length == 3) {
    buttonAdd.setAttribute("class", "btn add");
  }

  addOrRemove = false;
}
function add() {
  const button = document.querySelector(".add");
  let classes = button.getAttribute("class");
  const classArr = classes.split(" ");
  console.log(classArr);
  if (classArr.length == 2) {
    button.setAttribute("class", classes + " active");
  }

  const buttonRemove = document.querySelector(".remove");
  let classesRemove = buttonRemove.getAttribute("class");
  const classArrAdd = classesRemove.split(" ");
  console.log(classArrAdd);
  if (classArrAdd.length == 3) {
    buttonRemove.setAttribute("class", "btn remove");
  }

  addOrRemove = true;
}

canvas.addEventListener("mousemove", e => {
  if (e.ctrlKey) {
    const x = Math.floor(e.layerX / size);
    const y = Math.floor(e.layerY / size);

    grid[x][y].w = addOrRemove;

    grid[x][y].show(con, "green");
  }
});

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.totalCost = Infinity;
    this.cost = 1;
    this.neighbours = [];
    this.prev = undefined;
    this.w = false;
  }
  show(context, color) {
    context.fillStyle = color;

    if (this.w) {
      context.fillStyle = "#000000";
    }
    context.fillRect(this.x * size, this.y * size, size - 1, size - 1);
  }
  addNeighbours(grid) {
    if (this.x > 0) {
      if (grid[this.x - 1][this.y].w == false) {
        this.neighbours.push(grid[this.x - 1][this.y]);
      }
    }
    if (this.y > 0) {
      if (grid[this.x][this.y - 1].w == false) {
        this.neighbours.push(grid[this.x][this.y - 1]);
      }
    }
    if (this.x > 0 && this.y > 0) {
      if (grid[this.x - 1][this.y - 1].w == false) {
        this.neighbours.push(grid[this.x - 1][this.y - 1]);
      }
    }
    //
    if (this.y < row - 1) {
      if (grid[this.x][this.y + 1].w == false) {
        this.neighbours.push(grid[this.x][this.y + 1]);
      }
    }
    if (this.x < col - 1) {
      if (grid[this.x + 1][this.y].w == false) {
        this.neighbours.push(grid[this.x + 1][this.y]);
      }
    }
    if (this.y < row - 1 && this.x > 0) {
      if (grid[this.x - 1][this.y + 1].w == false) {
        this.neighbours.push(grid[this.x - 1][this.y + 1]);
      }
    }

    if (this.x < col - 1 && this.y > 0) {
      if (grid[this.x + 1][this.y - 1].w == false) {
        this.neighbours.push(grid[this.x + 1][this.y - 1]);
      }
    }

    if (this.x < col - 1 && this.y < row - 1) {
      if (grid[this.x + 1][this.y + 1].w == false) {
        this.neighbours.push(grid[this.x + 1][this.y + 1]);
      }
    }
  }
}

for (let i = 0; i < row; i++) {
  let gridRow = [];
  for (let j = 0; j < col; j++) {
    gridRow[j] = new Cell(i, j);
    gridRow[j].show(con, "green");
  }
  grid[i] = gridRow;
}

//add neighbours

//remove from set
function removeFromset(set, elem) {
  for (let i = set.length; i >= 0; i--) {
    if (set[i] == elem) {
      set.splice(i, 1);
    }
  }
}
// backtrack path

function evalPath(node) {
  if (node.prev != undefined) {
    path.push(node.prev);
    evalPath(node.prev);
  } else {
    return;
  }
}
console.log(grid);

// make the distance to start node 0;
// everything else has distance infinity;

let endNode = grid[row - 1][col - 1];
let startNode = grid[0][0];

startNode.totalCost = 0;

let currentNode = startNode;
openSet.push(startNode);
function djisktra() {
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      grid[i][j].addNeighbours(grid);
    }
  }
  while (currentNode != endNode) {
    //find the smallest element in openlist
    let neig = currentNode.neighbours;
    //   console.log(currentNode);

    //update Coset
    for (let neighbour of neig) {
      if (closedSet.indexOf(neig) < 0) {
        let tempCost = currentNode.totalCost + neighbour.cost;
        if (tempCost < neighbour.totalCost) {
          openSet.push(neighbour);
          neighbour.totalCost = currentNode.totalCost + neighbour.cost;
          neighbour.prev = currentNode;
        }
      }
    }

    //put current node in finished array;
    closedSet.push(currentNode);
    removeFromset(openSet, currentNode);
    // console.log(currentNode);
    let smallestElement = openSet[0];
    for (let node in openSet) {
      if (node.totalCost < smallestElement.totalCost) {
        smallestElement = node;
      }
    }

    if (smallestElement == endNode) {
      evalPath(smallestElement);
      break;
    }

    if (openSet.length == 0) {
      alert("no path found Please reload and try again");
      break;
    }

    // for (let i = 0; i < openSet.length; i++) {
    //   openSet[i].show(con, "yellow");
    // }

    // for (let i = 0; i < closedSet.length; i++) {
    //   closedSet[i].show(con, "blue");
    // }
    currentNode = smallestElement;
    // for (let i = 0; i < row; i++) {
    //   for (let j = 0; j < col; j++) {
    //     grid[i][j].show(con, "green");
    //   }
    // }
  }
  // console.log(path);

  for (let i = 0; i < path.length; i++) {
    path[i].show(con, "#ff4422");
  }
}
