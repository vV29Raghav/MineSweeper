  // Display logged-in username
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if(currentUser){
    document.getElementById("usernameDisplay").textContent = "Hello, " + currentUser.username;
  }

  // Start predefined levels
  function startGame(level){
    let rows, cols, mines;
    switch(level){
      case 1: rows=3; cols=3; mines=2; break;
      case 2: rows=6; cols=6; mines=10; break;
      case 3: rows=9; cols=9; mines=20; break;
      case 4: rows=12; cols=12; mines=35; break;
      default: rows=9; cols=9; mines=10;
    }

    window.location.href = `index.html?rows=${rows}&cols=${cols}&mines=${mines}&level=${level}`;
  }

  // Custom level input
  function customLevel(){
    const size = parseInt(prompt("Enter grid size (e.g., 10 for 10x10):"));
    const mines = parseInt(prompt("Enter number of mines:"));
    if(size && mines){
      window.location.href = `index.html?rows=${size}&cols=${size}&mines=${mines}&level=custom`;
    }
  }

  // Logout / Back to login
  function goBack(){
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }