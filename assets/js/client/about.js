$(document).ready(() => {
  myDatabase.ref("about-store").on("value", function (snap) {
    $(".loadingSpinner").fadeOut();
    $(".about-title").html(snap.val()["about-title"]);
    $(".about-description").html(snap.val()["about-description"]);
    $(".about-img img").attr("src", snap.val()["about-url"]);
  });
});
