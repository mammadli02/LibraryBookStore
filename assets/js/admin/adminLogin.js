$(document).ready(() => {
  let adminLoginForm = $("#adminLoginForm");
  let adminPanel = $("#AdminPanel");

  if (localStorage.getItem("login")) {
    adminLoginForm.hide();
    adminPanel.show();
  } else {
    adminLoginForm.show();
    adminPanel.hide();
  }

  //  Join button
  $(document).on("click", "#adminJoinButton", (e) => {
    e.preventDefault();

    $(".sideBar").addClass("d-none");

    let UserName = $("#userName").val().trim();
    let UserPassword = $("#userPassword").val().trim();

    let clearUserInfo = () => {
      $("#userName").val("");
      $("#userPassword").val("");
    };

    if (!UserName || !UserPassword) {
      Swal.fire({
        icon: "error",
        title: "Wrong....",
        text: "Please fill out the form completely !!!",
      });
      clearUserInfo();
    } else {
      myDatabase.ref("/admin").on("value", function (snap) {
        let name = snap.val().userName;
        let password = snap.val().userPassword;

        let userInfo = {
          name,
          password,
        };

        if (UserName == name && UserPassword == password) {
          setTimeout(() => {
            localStorage.setItem("login", JSON.stringify(userInfo));
            clearUserInfo();
            adminLoginForm.hide();
            adminPanel.show();
          }, 100);
        } else {
          Swal.fire({
            icon: "error",
            title: "Wrong....",
            text: "Username or Password is incorrect!!!",
          });
          clearUserInfo();
        }
      });
    }
  });

  // Logout Button
  $(document).on("click", "#adminLogout", () => {
    setTimeout(() => {
      localStorage.removeItem("login");
      adminLoginForm.show();
      adminPanel.hide();
    }, 1000);
  });

  // Mobile Menu //
  //*******************//
  // Hamburger Button//
  $(document).on("click", ".hamburger", () => {
    $(".sideBar").removeClass("d-none");
    $(".menuHeader").hide();
  });

  // Logout Button
  $(document).on("click", "#mobileLog", () => {
    setTimeout(() => {
      adminLoginForm.show();
      adminPanel.hide();
    }, 1000);
  });

  // List Button
  $(document).on("click", ".mobileNavList li", () => {
    $(".sidebar").hide();
    $(".menuHeader").show();
  });
});
