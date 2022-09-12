$(document).ready(() => {
  $(document).on("click", ".joinBtn", (e) => {
    e.preventDefault();
    let inputFullName = $("#inputFullName").val().trim();
    let inputEmail = $("#inputEmail").val().trim();

    let clearInput = () => {
      $("#inputFullName").val("");
      $("#inputEmail").val("");
    };

    if (!inputFullName || !inputEmail) {
      $(".alertMsg").removeClass("d-none");
      return;
    } else {
      let userForm = {
        inputFullName,
        inputEmail,
      };

      let userInformation = myDatabase.ref("/clientJoin");
      userInformation.push().set(userForm);

      $(".alertMsg").addClass("d-none");
      setTimeout(() => {
        $(".alertSuccessMsg").removeClass("d-none");
      }, 1000);
      clearInput();
      setTimeout(function () {
        window.location.reload();
      }, 2500);
    }
  });
});
