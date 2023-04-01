// function welcomeMessage() {
//   console.info("Setting up the interface");

//   const $container = $(".container");
//   const $welcomeMessage = $("<h3>").attr("id", "welcome-message");
//   $welcomeMessage.text(
//     "Welcome, Brave Runner. Today we will traverse the plains of bytes avoiding obstacles within our paths!"
//   );
//   $container.prepend($welcomeMessage);

// }

function createMaze(mazeSize) {
  console.info("Creating the maze");

  const $container = $(".container");
  for (let i = 0; i < mazeSize; i++) {
    const $mazeRow = $("<div>").addClass("row");
    $mazeRow.attr("id", `row${i}`);

    for (let j = 0; j < mazeSize; j++) {
      const $mazeGrid = $("<div>").addClass(`row${i} grid`);
      $mazeGrid.attr("id", `row${i}-grid${j}`);
      $mazeRow.append($mazeGrid);
      $container.append($mazeRow);
    }
  }
}

function addButtons(buttonNamesArray) {
  const $container = $(".container");
  const $buttonDiv = $("<div>").addClass("maze-setter");
  for (let name of buttonNamesArray) {
    const $button = $("<button>").addClass("maze-buttons")
    $button.attr("id", `${name}-button`);
    $button.text(name)
    $buttonDiv.append($button)
  }

  $container.append($buttonDiv)
}

$(() => {
  console.info("Welcome to Maze Runner!");
  //   welcomeMessage();
  addButtons(["Start", "End", "Obstacles"]);
  createMaze(50);
});
