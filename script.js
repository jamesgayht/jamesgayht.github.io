const buttonsArray = ["Start", "End", "Obstacles", "Visualize", "Clear"];

$(() => {
  console.info("Welcome to Maze Runner!");

  $("#instructions").on("click", () => {
    console.info("clicking instructions");
    alert(
      '1. Generate a grid based on your desired size\n2. Place a starting and ending point anywhere on the grid\n3. Place obstacles along the way to block off paths\n4. Click "Visualize" to see Dijkstra\'s Algorithm in motion'
    );
  });
  addButtons(buttonsArray);
  createMaze();

  $("form").submit(function (e) {
    e.preventDefault();

    let formInput = $("form").serialize();
    let formArr = formInput.split("=");
    console.info(formArr);

    $(".maze").remove();
    $(".maze-setter").remove();
    addButtons(buttonsArray);
    createMaze(formArr[1]);
  });
});

function createMaze(mazeSize = 50) {
  console.info(`Creating the maze of ${mazeSize}x${mazeSize}`);

  const $maze = $("<div>").addClass("maze");
  $(".container").append($maze);
  for (let i = 0; i < mazeSize; i++) {
    const $mazeRow = $("<div>").addClass("col");
    $mazeRow.attr("id", `col${i}`);

    for (let j = 0; j < mazeSize; j++) {
      const $mazeGrid = $("<div>").addClass(`col${i} grid`);
      $mazeGrid.attr("id", `col${i}-row${j}`);
      $mazeRow.append($mazeGrid);
      $maze.append($mazeRow);
    }
  }

  $("#Start-button").on("click", addStartPoint);
  $("#End-button").on("click", addEndPoint);
  $("#Obstacles-button").on("click", addObstacles);
  $("#Clear-button").on("click", clearMaze);
  $("#Visualize-button").on("click", visualizePath);
}

function addButtons(buttonNamesArray) {
  const $container = $(".container");
  const $buttonDiv = $("<div>").addClass("maze-setter");
  for (let name of buttonNamesArray) {
    const $button = $("<button>").addClass("maze-buttons");
    $button.attr("id", `${name}-button`);
    $button.text(name);
    $buttonDiv.append($button);
  }

  $container.append($buttonDiv);
}

function addStartPoint(element) {
  const $button = $(element.currentTarget);
  $button.addClass("enabled");
  $("#End-button").removeClass("enabled");
  $("#Obstacles-button").removeClass("enabled");

  $(".grid").on("click", (element) => {
    if ($("#Start-button").hasClass("enabled")) {
      // on clicking the maze, select the id of the grid to set as the start point
      $(".start").removeClass("start");
      const $selectedGrid = $(element.currentTarget);
      console.info("selected grid >>> ", $selectedGrid);
      $selectedGrid.addClass("start");

      console.info("remove class enabled ");
      $button.removeClass("enabled");

      // prevent further clicking until start button is clicked again
      $(".grid").off("click");
    }
  });
}

function addEndPoint(element) {
  const $button = $(element.currentTarget);
  $button.addClass("enabled");

  $("#Start-button").removeClass("enabled");
  $("#Obstacles-button").removeClass("enabled");

  $(".grid").on("click", (element) => {
    if ($("#End-button").hasClass("enabled")) {
      // on clicking the maze, select the id of the grid to set as the end point
      $(".end").removeClass("end");
      const $selectedGrid = $(element.currentTarget);
      $selectedGrid.addClass("end");

      $button.removeClass("enabled");

      // prevent further clicking until start button is clicked again
      $(".grid").off("click");
    }
  });
}

function addObstacles(element) {
  const $button = $(element.currentTarget);
  $("#Start-button").removeClass("enabled");
  $("#End-button").removeClass("enabled");

  if ($button.hasClass("enabled")) {
    $button.removeClass("enabled");
    $(".grid").off("click");
  } else {
    $button.addClass("enabled");
    $(".grid").mousedown(() => {
      if ($("#Obstacles-button").hasClass("enabled")) {
        $(".grid")
          .mousemove((element) => {
            console.info("in mousemove >>> ");
            $(element.currentTarget).addClass("obstacle");
          })
          .mouseup(function () {
            $(".grid").off("mousemove");
          });
      }
    });
  }
  $(".grid").off("click");
}

function clearMaze(element) {
  if (confirm("Are you sure you want to clear the maze?")) {
    let mazeSize = $(".col").length;
    $(".maze-setter").remove();
    $(".maze").remove();
    addButtons(buttonsArray);
    createMaze(mazeSize);
  }
}

function visualizePath() {
  // checks if start points and end points are added
  if ($(".start").length === 0 || $(".end").length === 0) {
    alert("Please input a start and end point to visualize the path.");
  } else {
    $("#Start-button").removeClass("enabled");
    $("#End-button").removeClass("enabled");
    $("#Obstacles-button").removeClass("enabled");
    let mazeSize = $(".col").length;
    console.info("mazeSize in visualize path >>> ", mazeSize);
    // get the row and col index of start and end nodes
    let startNodeIDArr = $(".start").attr("id").split("-");
    let startNodeCol = startNodeIDArr[0].match(/\d/g).join("");
    let startNodeRow = startNodeIDArr[1].match(/\d/g).join("");
    console.info("startNodeCol >>> ", startNodeCol);
    console.info("startNodeRow >>> ", startNodeRow);

    let endNodeIDArr = $(".end").attr("id").split("-");
    let endNodeCol = endNodeIDArr[0].match(/\d/g).join("");
    let endNodeRow = endNodeIDArr[1].match(/\d/g).join("");
    console.info("endNodeCol >>> ", endNodeCol);
    console.info("endNodeRow >>> ", endNodeRow);

    // creates an initial grid array with all nodes, and declares which is the start and end node
    const grid = getInitialGrid(
      mazeSize,
      startNodeCol,
      startNodeRow,
      endNodeCol,
      endNodeRow
    );
    console.info("grid >>> ", grid);

    // checks for all nodes that are obstacles
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        let node = grid[i][j];
        if ($(`#col${node.col}-row${node.row}`).hasClass("obstacle")) {
          node.isWall = true;
        }
      }
    }

    const visitedNodesInOrder = dijkstra(
      grid,
      grid[startNodeRow][startNodeCol],
      grid[endNodeRow][endNodeCol]
    );
    console.info("visitedNodesInOrder >>> ", visitedNodesInOrder);

    const nodesInShortestPathOrder = getNodesInShortestPathOrder(
      grid[endNodeRow][endNodeCol]
    );
    console.info("nodesInShortestPathOrder >>> ", nodesInShortestPathOrder);

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
}

// Performs Dijkstra's algorithm; returns nodes in the order they were visited & point back to their previous node, allowing us to compute the shortest path by backtracking from the finish node.
function dijkstra(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;

  const unvisitedNodes = getAllNodes(grid);
  console.info("unvisited nodes >>> ", unvisitedNodes);

  while (!!unvisitedNodes.length) {
    // since we have initialized startNode.distance to 0, this will allow us to start from the startNode and visit its neighbours
    sortNodesByDistance(unvisitedNodes);

    // we use .shift() to remove the closestNode from the unvisitedNodes array
    const closestNode = unvisitedNodes.shift();

    // If we encounter a wall, we skip it -> continue key word skips this iteration of loop
    if (closestNode.isWall) continue;

    // If the closest node is at a distance of infinity, we must be trapped and should therefore stop
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === endNode) return visitedNodesInOrder;
    updateUnvisitedNeighbours(closestNode, grid);
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbours(node, grid) {
  const unvisitedNeighbours = getUnvisitedNeighbours(node, grid);
  for (const neighbour of unvisitedNeighbours) {
    neighbour.distance = node.distance + 1;
    neighbour.previousNode = node;
  }
}

function getUnvisitedNeighbours(node, grid) {
  const neighbours = [];
  const { col, row } = node;
  if (row > 0) neighbours.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);
  if (col > 0) neighbours.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]);
  // .filter() returns elements that are true, so we use the ! prefix to convert neightbours which are unvisited and remove those which have already been visited
  return neighbours.filter((neighbour) => !neighbour.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the endNode to find the shortest path
function getNodesInShortestPathOrder(endNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = endNode;
  while (currentNode !== null) {
    // .unshift() adds the currentNode to the beginning of nodesInShortestPathOrder array
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

const getInitialGrid = (
  mazeSize,
  startNodeCol,
  startNodeRow,
  endNodeCol,
  endNodeRow
) => {
  const grid = [];
  for (let row = 0; row < mazeSize; row++) {
    const currentRow = [];
    for (let col = 0; col < mazeSize; col++) {
      currentRow.push(
        createNode(col, row, startNodeCol, startNodeRow, endNodeCol, endNodeRow)
      );
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (
  col,
  row,
  startNodeCol,
  startNodeRow,
  endNodeCol,
  endNodeRow
) => {
  return {
    col,
    row,
    isStart: row == startNodeRow && col == startNodeCol,
    isEnd: row == endNodeRow && col == endNodeCol,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

function animateShortestPath(nodesInShortestPathOrder) {
  for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
    setTimeout(() => {
      const node = nodesInShortestPathOrder[i];
      $(`#col${node.col}-row${node.row}`).addClass("node node-shortest-path");
    }, 50 * i);
  }
}

function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
  for (let i = 0; i <= visitedNodesInOrder.length; i++) {
    if (i === visitedNodesInOrder.length) {
      // if i === visitedNodesInOrder.length, we have found our end node
      setTimeout(() => {
        animateShortestPath(nodesInShortestPathOrder);
      }, 10 * i);
      return;
    }
    setTimeout(() => {
      const node = visitedNodesInOrder[i];
      $(`#col${node.col}-row${node.row}`).addClass("node node-visited");
    }, 10 * i);
  }
}
