$(document).ready(() => {
  $(".input").intlTelInput({
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/8.4.6/js/utils.js",
  });

  $("#contactBookButton").on("click", (e) => {
    e.preventDefault();
    let userContact = myDatabase.ref("/clientContact");
    let fullNameContactUs = $("#fullNameContactUs").val().trim();
    let emailContactUs = $("#emailContactUs").val().trim();
    let addressContactUs = $("#addressContactUs").val().trim();
    let phoneContactUs = $("#phoneContactUs").val().trim();
    let contactInfo = {
      fullNameContactUs,
      emailContactUs,
      addressContactUs,
      phoneContactUs,
    };

    if (
      !fullNameContactUs ||
      !emailContactUs ||
      !addressContactUs ||
      !phoneContactUs
    ) {
      Swal.fire({
        icon: "error",
        title: "Wrong !!!",
        text: "Please fill out the form completely!",
      });
      resetContactİnfo();
    } else {
      userContact.push().set(contactInfo);
      Swal.fire(
        "Success !!!",
        "Your information has been sent successfully",
        "success"
      );
      resetContactİnfo();
    }

    function resetContactİnfo() {
      $("#fullNameContactUs").val("");
      $("#emailContactUs").val("");
      $("#addressContactUs").val("");
      $("#phoneContactUs").val("");
    }
  });
});
