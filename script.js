const buttonsArray = ["Start", "End", "Obstacles", "Visualize", "Clear"];

$(() => {
  console.info("Welcome to Maze Runner!");
  //   welcomeMessage();
  addButtons(buttonsArray);
  createMaze();
});

// function welcomeMessage() {
//   console.info("Setting up the interface");

//   const $container = $(".container");
//   const $welcomeMessage = $("<h3>").attr("id", "welcome-message");
//   $welcomeMessage.text(
//     "Welcome, Brave Runner. Today we will traverse the plains of bytes avoiding obstacles within our paths!"
//   );
//   $container.prepend($welcomeMessage);

// }

function createMaze(mazeSize = 50) {
  console.info("Creating the maze");

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
    $(".maze-setter").remove();
    addButtons(buttonsArray);

    $(".maze").remove();
    createMaze();
  }
}

function visualizePath() {
  if ($(".start").length === 0 || $(".end").length === 0) {
    alert("Please input a start and end point to visualize the path.");
  } else {
    // checkAdjacentNodes()
    findPath();
  }
}

function checkAdjacentNodes() {
  const $start = $(".start");
  const $end = $(".end");

  console.info("start >>> ", $start);
  console.info("end >>> ", $end);

  let currentNodeID = $(".start").attr("id");

  currentNodeIDArr = currentNodeID.split("-");
  console.info("currentNodeID[0] >>> ", currentNodeIDArr[0]);
  console.info("currentNodeID[1] >>> ", currentNodeIDArr[1]);

  // gets the current node's row and col number
  let currentNodeCol = currentNodeIDArr[0].match(/\d/g).join("");
  let currentNodeRow = currentNodeIDArr[1].match(/\d/g).join("");
  console.info("currentNodeCol >>> ", currentNodeCol);
  console.info("currentNodeRow >>> ", currentNodeRow);

  // check top node
  if (currentNodeRow !== 0) {
    let topNodeCol = currentNodeCol;
    let topNodeRow = currentNodeRow - 1;
    const $topNode = $(`#col${topNodeCol}-row${topNodeRow}`);
    console.log("$topNode >>> ", $topNode);
    $topNode.addClass("checked");
  }

  // check left node
  if (currentNodeCol !== 0) {
    let leftNodeCol = currentNodeCol - 1;
    let leftNodeRow = currentNodeRow;
    const $leftNode = $(`#col${leftNodeCol}-row${leftNodeRow}`);
    console.log("$leftNode >>> ", $leftNode);
    $leftNode.addClass("checked");
  }

  // check right node
  if (currentNodeCol !== $(".col").length - 1) {
    let rightNodeCol = parseInt(currentNodeCol) + 1;
    let rightNodeRow = currentNodeRow;

    const $rightNode = $(`#col${rightNodeCol}-row${rightNodeRow}`);
    console.log("$rightNode >>> ", $rightNode);
    $rightNode.addClass("checked");
  }

  // check bottom node
  if (currentNodeCol !== $(".col").length - 1) {
    let bottomNodeCol = currentNodeCol;
    let bottomNodeRow = parseInt(currentNodeRow) + 1;

    const $bottomNode = $(`#col${bottomNodeCol}-row${bottomNodeRow}`);
    console.log("$bottomNode >>> ", $bottomNode);
    $bottomNode.addClass("checked");
  }
}

function findPath() {
  const startNodeID = $(".start").attr("id");
  const $endNode = $(".end");
  const endNodeID = $(".end").attr("id");

  let startNodeIDArr = startNodeID.split("-");
  let endNodeIDArr = endNodeID.split("-");

  let startNodeCol = startNodeIDArr[0].match(/\d/g).join("");
  let startNodeRow = startNodeIDArr[1].match(/\d/g).join("");
  let endNodeCol = endNodeIDArr[0].match(/\d/g).join("");
  let endNodeRow = endNodeIDArr[1].match(/\d/g).join("");

  while ($(".found").length < 1) {
    console.info("start col >>> ", startNodeCol);
    console.info("start row >>> ", startNodeRow);
    console.info("end col >>> ", endNodeCol);
    console.info("end row >>> ", endNodeRow);

    if (parseInt(startNodeCol) < parseInt(endNodeCol)) {
      console.info("IN RIGHT");
      const $rightNode = $(
        `#col${parseInt(startNodeCol) + 1}-row${startNodeRow}`
      );
      $rightNode.addClass("path");
      startNodeCol++;
      if ($rightNode.attr("id") === endNodeID) {
        console.info("FOUND RIGHT");
        $endNode.addClass("found");
      }
    } else if (parseInt(startNodeCol) > parseInt(endNodeCol)) {
      console.info("IN LEFT");
      const $leftNode = $(
        `#col${parseInt(startNodeCol) - 1}-row${startNodeRow}`
      );
      $leftNode.addClass("path");
      startNodeCol--;
      if ($leftNode.attr("id") === endNodeID) {
        console.info("FOUND LEFT");
        $endNode.addClass("found");
      }
    } else if (parseInt(startNodeRow) > parseInt(endNodeRow)) {
      console.info("IN TOP");
      const $topNode = $(
        `#col${startNodeCol}-row${parseInt(startNodeRow) - 1}`
      );
      $topNode.addClass("path");
      startNodeRow--;
      if ($topNode.attr("id") === endNodeID) {
        console.info("FOUND TOP");
        $endNode.addClass("found");
      }
    } else if (parseInt(startNodeRow) < parseInt(endNodeRow)) {
      console.info("IN BOTTOM");
      const $bottomNode = $(
        `#col${startNodeCol}-row${parseInt(startNodeRow) + 1}`
      );
      $bottomNode.addClass("path");
      startNodeRow++;
      if ($bottomNode.attr("id") === endNodeID) {
        console.info("FOUND BOTTOM");
        $endNode.addClass("found");
      }
    }
  }
}
