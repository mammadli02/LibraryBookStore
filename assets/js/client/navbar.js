$(document).ready(() => {
  // For Mobile
  $(".clientHamburger").click(() => {
    $(".mobileNavClient").hide();
    $(".mobNavMenu").removeClass("d-none");
    $(".mobNavMenu").show();
  });

  $(".xbtn").click(() => {
    $(".mobNavMenu").hide();
    $(".mobNavMenu").addClass("d-none");
    $(".mobileNavClient").show();
  });
});
