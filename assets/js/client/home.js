$(document).ready(() => {
  let AddBookType = myDatabase.ref("/addBookType");

  AddBookType.on("value", function (snap) {
    let bookTypeArr = Object.entries(snap.val()).reverse();
    let objectArray = bookTypeArr.map((item) => {
      return {
        id: item[0],
        ...item[1],
      };
    });

    bookTypePage(objectArray);
  });

  function bookTypePage(arr) {
    $(".catalogSectionBox").html(
      arr.map((item) => {
        return `<div class="pt-4"><a href="./catalog.html">${item.bookType}</a></div>`;
      })
    );
  }
});
