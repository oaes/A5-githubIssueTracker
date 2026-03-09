document.getElementById("login-btn").addEventListener("click", function () {
  //1- get the username input
  const username = document.getElementById("username").value;

  //2- get the password
  const password = document.getElementById("password").value;

  //3- match username & password
  if (username === "admin" && password === "admin123") {
    //3-1 true:::>> alert> homepage
    alert("Sign in Successfully");

    // window.location.replace("/./index_app.html");
    window.location.assign("./index_home.html");
  } else {
    //3-2 false:::>> alert> return
    alert("Invalid Username or Password");
    return;
  }
});
