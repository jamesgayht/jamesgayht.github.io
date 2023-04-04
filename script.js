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
    const $mazeRow = $("<div>").addClass("row");
    $mazeRow.attr("id", `row${i}`);

    for (let j = 0; j < mazeSize; j++) {
      const $mazeGrid = $("<div>").addClass(`row${i} grid`);
      $mazeGrid.attr("id", `row${i}-grid${j}`);
      $mazeRow.append($mazeGrid);
      $maze.append($mazeRow);
    }
  }

  $("#Start-button").on("click", addStartPoint);
  $("#End-button").on("click", addEndPoint);
  $("#Obstacles-button").on("click", addObstacles);
  $("#Clear-button").on("click", clearMaze);
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

  $(".grid").on("click", (element) => {
    // on clicking the maze, select the id of the grid to set as the start point
    $(".start").removeClass("start");
    const $selectedGrid = $(element.currentTarget);
    console.info("selected grid >>> ", $selectedGrid);
    $selectedGrid.addClass("start");

    console.info("remove class enabled ");
    $button.removeClass("enabled");

    // prevent further clicking until start button is clicked again
    $(".grid").off("click");
  });
}

function addEndPoint(element) {
  const $button = $(element.currentTarget);
  $button.addClass("enabled");

  $(".grid").on("click", (element) => {
    // on clicking the maze, select the id of the grid to set as the end point
    $(".end").removeClass("end");
    const $selectedGrid = $(element.currentTarget);
    $selectedGrid.addClass("end");

    $button.removeClass("enabled");

    // prevent further clicking until start button is clicked again
    $(".grid").off("click");
  });
}

function addObstacles(element) {
  const $button = $(element.currentTarget);
  $button.addClass("enabled");

  $(".grid").mousedown(() => {
    $(".grid")
      .mousemove((element) => {
        console.info("in mousemove >>> ");
        $(element.currentTarget).addClass("obstacle");
        
      })
      .mouseup(function() {
        $(".grid").off("mousemove");
      })
  });
}

function clearMaze(element) {
  if (confirm("Are you sure you want to clear the maze?")) {
    $(".maze-setter").remove();
    addButtons(["Start", "End", "Obstacles", "Clear"]);

    $(".maze").remove();
    createMaze();
  }
}

$(() => {
  console.info("Welcome to Maze Runner!");
  //   welcomeMessage();
  addButtons(["Start", "End", "Obstacles", "Clear"]);
  createMaze();
});
