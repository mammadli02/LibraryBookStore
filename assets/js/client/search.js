let resultArr = [];
let count = 0;

if (localStorage.getItem("search")) {
  let localSearch = localStorage.getItem("search");
  myDatabase.ref("/books").on("value", function (snap) {
    let bookObj = snap.val();
    let bookArr = Object.entries(bookObj).reverse();
    let bookObjArr = bookArr.map((item) => {
      return {
        id: item[0],
        ...item[1],
      };
    });
    renderBooks(bookObjArr, localSearch);
    $(".slider-section").addClass("d-none");
    if (resultArr.length == 0) {
      $(".slider-section").addClass("d-none");
      localStorage.removeItem("search");
      return swal({
        icon: "error",
        title: "Error...",
        text: "No results found for your search",
      });
    }
    resultArr = [];
    count = 0;
  });
}

$("#searchBtn").on("click", function (e) {
  e.preventDefault();
  let search = $("#searchInput").val().trim();
  $("#searchInput").val("");
  if (search === "") {
    return swal({
      icon: "warning",
      title: "Warning...",
      text: "Please, enter the search text",
    });
  } else {
    myDatabase.ref("/books").on("value", function (snap) {
      let bookObj = snap.val();
      let bookArr = Object.entries(bookObj).reverse();
      let bookObjArr = bookArr.map((item) => {
        return {
          id: item[0],
          ...item[1],
        };
      });

      renderBooks(bookObjArr, search);

      if (resultArr.length == 0) {
        $(".slider-section").addClass("d-none");
        localStorage.removeItem("search");
        return swal({
          icon: "error",
          title: "Error...",
          text: "No results found for your search",
        });
      }
      resultArr = [];
      count = 0;
    });
  }
});

function renderBooks(arr, search) {
  $("#searchSlider").html(
    arr.map((item) => {
      if (item.bookName.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
        localStorage.setItem("search", search);
        $(".slider-section").removeClass("d-none");
        count++;
        resultArr.push(item);
        let bookImage = "";
        let cardNew = "";
        item.bookImage
          ? (bookImage = item.bookImage)
          : (bookImage =
              "https://static.wixstatic.com/media/223356_4adca957048e4b3cada43d1709362beb~mv2.jpg/v1/fill/w_560,h_622,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/boook.jpg");
        item.isNew === true
          ? (cardNew = '<span class="card-new">NEW</span>')
          : false;

        let result = `<div class="carousel-item ${count == 1 ? "active" : ""}">
                <div class="row">
                        <div class="col-lg-4 col-md-4 col-sm-12 col-12 img-section">
                        ${cardNew}
                            <img class="img-thumbnail" src="${bookImage}"
                                alt="">
                        </div>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-12">
                            <h2 class="book-name">${item.bookName.substring(
                              0,
                              40
                            )}</h2>
                            <p class="author-name">${item.authorName}</p>
                            <p class="book-description">${item.bookDesc.substring(
                              0,
                              250
                            )}</p>
                        </div>
                    </div>
                </div>`;

        if (resultArr.length === 1) {
          $(".carousel-control-prev").addClass("d-none");
          $(".carousel-control-next").addClass("d-none");
          return result;
        } else {
          $(".carousel-control-prev").removeClass("d-none");
          $(".carousel-control-next").removeClass("d-none");
          return result;
        }
      }
    })
  );
}
