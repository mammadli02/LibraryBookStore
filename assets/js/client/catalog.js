$(document).ready(() => {
  $(".owl-carousel1").owlCarousel({
    autoplay: true,
    autoplayTimeout: 3000,
    loop: true,
    margin: 30,
    nav: true,
    navText: [
      "<img src='./assets/images/prev.svg'>",
      "<img src='./assets/images/next.svg'>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      577: {
        items: 2,
      },
      1100: {
        items: 4,
      },
      1200: {
        items: 5,
      },
    },
  });

  $(document).on("click", ".categoryAll", function () {
    $(".categoryAll").not(this).removeClass("active");
    $(this).addClass("active");
  });

  myDatabase.ref("/addBookType").on("value", (snap) => {
    let bookTypeObject = snap.val();
    let bookTypeArr = Object.entries(bookTypeObject).reverse();
    let bookTypeObjArr = bookTypeArr.map((info) => {
      return {
        id: info[0],
        ...info[1],
      };
    });
    renderBookTypes(bookTypeObjArr);
  });

  function renderBookTypes(arr) {
    $("#categoryAppend").html(
      arr.map((info) => {
        if (info.bookType === localStorage.getItem("bookType")) {
          return `<li class="categoryAll active ml-4" value="${info.bookType}">${info.bookType}</li>`;
        } else {
          return `<li class="categoryAll ml-4" value="${info.bookType}">${info.bookType}</li>`;
        }
      })
    );
  }

  function getBooks() {
    myDatabase.ref("/books").on("value", (snap) => {
      let bookInfoObject = snap.val();
      let bookInfoArr = Object.entries(bookInfoObject).reverse();
      let bookInfoObjArr = bookInfoArr.map((info) => {
        return {
          id: info[0],
          ...info[1],
        };
      });

      let localCategory = localStorage.getItem("bookType");

      renderBestseller(bookInfoObjArr);
      renderNewReleases(bookInfoObjArr);
      renderCatPage(bookInfoObjArr, localCategory);
    });
  }

  getBooks();

  function getBooksInfo(item, tagName) {
    $(".loadingSpinner").fadeOut();
    let bookName = item.bookName.slice(0, 17);
    let bookAuthor = item.authorName.slice(0, 17);
    let bookImage;
    let cardNew = "";

    item.bookImage
      ? (bookImage = item.bookImage)
      : (bookImage = "./assets/images/clientNoImg.png");

    item.checked ? (cardNew = `<span class="newBook">NEW</span>`) : false;

    let bookInfo = $("<div>").addClass("card position-realtive").html(`
         ${cardNew}
             <img src="${bookImage}" height="250" class="card-img-top" alt="..." />
      <div class="card-body">
          <h5 class="card-title">${bookName}</h5>
          <p class="card-text">${bookAuthor}</p>
          <button class="catalogbtn">
              <a href="./bookPage.html" data-value="${item.id}" class="book-info"> Read more</a>
          </button>
      </div>
      `);
    $(tagName).trigger("add.owl.carousel", bookInfo);
  }

  function renderBestseller(arr) {
    for (let item of arr) {
      if (item.bookCategory === "besteller") {
        getBooksInfo(item, "#bestseller");
      }
    }
  }

  function renderNewReleases(arr) {
    for (let item of arr) {
      if (item.checked) {
        getBooksInfo(item, "#newReleases");
      }
    }
  }

  $(document).on("click", ".categoryAll", function () {
    $(".loadingSpinner").fadeIn();
    localStorage.setItem("bookType", $(this).text());
    getBooks();
  });

  function renderCatPage(arr, localCategory) {
    for (let item of arr) {
      if (localCategory) {
        if (item.bookCategory === localCategory) {
          var length = $(".all-book-carousel .owl-item").length;
          for (var i = 0; i < length; i++) {
            $(".all-book-carousel")
              .trigger("remove.owl.carousel", [i])
              .trigger("refresh.owl.carousel");
          }
          setTimeout(() => {
            getBooksInfo(item, "#allBookList");
          }, 1000);
        } else if (localCategory === "all") {
          $("#allCategory").addClass("active");
          getBooksInfo(item, "#allBookList");
        }
      } else {
        $("#allCategory").addClass("active");
        getBooksInfo(item, "#allBookList");
      }
    }
  }
  $(document).on("click", ".book-info", function () {
    localStorage.setItem("bookId", $(this).data("value"));
  });
});
