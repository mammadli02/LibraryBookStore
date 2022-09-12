$(document).ready(() => {
  // Add Book Section
  $("#AdminSearchResult").hide();
  $("#addTypeSection").hide();

  $(document).on("click", ".searchBtn", (e) => {
    e.preventDefault();
    $("#AdminSearch").val().trim() ? $("#AdminSearchResult").show() : false;
  });

  $(document).on("click", "#AdminSearchResult", () => {
    $("#AdminSearchResult").hide();
    $("#AdminSearch").val("");
  });

  $(document).on("click", ".searchBtn", () => {
    $("#AdminSearchResult ul").html(
      `<img class="rounded-circle loadingImg" src="./assets/images/loading.gif" width="50" alt="...loading"/>`
    );
    let searchBookName = $("#AdminSearch").val();
    const booksInfo = {
      async: true,
      crossDomain: true,
      url: `https://www.googleapis.com/books/v1/volumes?q=${searchBookName}`,
      method: "GET",
    };
    $.ajax(booksInfo).then(function (res) {
      $("#AdminSearchResult ul").html("");
      let bookArr = res.items;

      setTimeout(() => {
        if (!bookArr) {
          $("#AdminSearchResult ul").html(
            `<p class="text-secondary ml-lg-4 h4">No result found !!!</p>`
          );
          $("#AdminSearch").val("");
        } else {
          for (el of bookArr) {
            let data = el.volumeInfo;
            let bookImg = "";
            data.imageLinks.thumbnail
              ? (bookImg = data.imageLinks.thumbnail)
              : (bookImg = "./assets/images/no image.png");

            let searchResult = $("<li>")
              .addClass("row align-items-center mb-4 cursor-pointer")
              .attr("data-name", data.authors);
            searchResult.html(
              `<img src="${bookImg}" class="col-3 rounded-circle" height="50px" alt=""><span style="color:#BCBCBC" class="col-9">${data.authors}</span>`
            );
            $("#AdminSearchResult ul").append(searchResult);
            searchResult.on("click", () => {
              clearBookForm();
              bookFormInfo(data);
            });
          }
        }
      }, 1000);
    });
  });

  function clearBookForm() {
    $("#bookName").val("");
    $("#authorName").val("");
    $("#bookImageUrl").val("");
    $("#publicationYear").val("");
    $("#bookDesc").val("");
    $("#isNew").prop("checked", false);
  }

  // Book Form Section //
  function bookFormInfo(info) {
    $("#bookName").val(info.title);
    $("#authorName").val(info.authors);
    info.imageLinks.thumbnail
      ? $("#bookImageUrl").val(info.imageLinks.thumbnail)
      : false;

    if (info.publishedDate) {
      let publishYear = info.publishedDate.slice(0, 4);
      let thisYear = new Date().getFullYear();
      $("#publicationYear").val(publishYear);

      if (publishYear >= thisYear - 6) {
        $("#isNew").prop("checked", true);
      }
    }

    let descCount = info.description.length;
    $("#bookDesc").val(info.description.slice(0, 1000));

    descCount < 1000 ? (descCount = descCount) : (descCount = 1000);
    if (descCount > 1000) {
      $("#adminDescCount").addClass("text-danger");
    }
    $("#adminDescCountZero").html(descCount);
  }

  function countLimitDesc(textarea, count, text) {
    $(textarea).on("keyup", () => {
      $(count).html($(textarea).val().length);
      if ($(textarea).val().length >= 1000) {
        $(text).addClass("text-danger");
      } else {
        $(text).removeClass("text-danger");
      }
    });
  }

  countLimitDesc("#bookDesc", "#adminDescCountZero", "#adminDescCount");

  // Add Book Type //
  $(document).on("click", "#addTypeBtn", () => {
    $("#addTypeSection").show();
  });

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
    $("#categorySelect").html(
      arr.map((item) => {
        return `<option value="${item.bookType}" class="mb-3">${item.bookType}</option>`;
      })
    );
  }

  $(document).on("click", "#bookTypeBtn", function (e) {
    e.preventDefault();
    let bookTypeInput = $("#bookTypeInput").val().trim();
    if (!bookTypeInput) {
      Swal.fire({
        icon: "error",
        title: "Wrong !!!",
        text: "Book type can't be empty!",
      });
    } else {
      AddBookType.push().set({ bookType: bookTypeInput });
      Swal.fire("Successful", "Book type successfully added!", "success");
    }

    $("#bookTypeInput").val("");
    $("#addTypeSection").hide();
  });

  $("#addBookBtn").on("click", () => {
    let bookName = $("#bookName").val();
    let authorName = $("#authorName").val();
    let bookImage = $("#bookImageUrl").val();
    let bookYear = $("#publicationYear").val();
    let bookDesc = $("#bookDesc").val();
    let bookCategory = $("#categorySelect").val();
    let checked = $("#isNew").is(":checked");

    let bookInfo = {
      bookName,
      authorName,
      bookImage,
      bookYear,
      bookDesc,
      bookCategory,
      checked,
    };
    if (!bookName || !authorName) {
      Swal.fire({
        icon: "error",
        title: "Wrong !!!",
        text: "Book information can't be empty!",
      });
      return;
    }

    myDatabase.ref("/books").push().set(bookInfo);

    Swal.fire({
      icon: "success",
      title: "Success !!",
      text: "The information of the book has been successfully added",
    });
    clearBookForm();
  });

  // About Store Section //

  function countLimit(textarea, countDiv, textDiv) {
    $(textarea).on("change keyup paste", () => {
      $(countDiv).text($(textarea).val().length);
      if ($(textarea).val().length >= 1000) {
        $(textDiv).addClass("text-danger");
      } else {
        $(textDiv).removeClass("text-danger");
      }
    });
  }

  countLimit("#aboutDescription", "#aboutTextareaCount", "#aboutTextarea");

  myDatabase.ref("about-store").on("value", function (snap) {
    $("#title").val(snap.val()["title"]);
    $("#imageUrl").val(snap.val()["about-url"]);
    $("#aboutDescription").val(snap.val()["about-description"]);

    let aboutCount = snap.val()["about-description"].length;
    $("#aboutTextareaCount").text(aboutCount);
  });

  $(".about-info-add").on("click", (e) => {
    let title = $("#title").val().trim();
    let imageUrl = $("#imageUrl").val().trim();
    let aboutDescription = $("#aboutDescription").val().trim();
    e.preventDefault();
    if (title === "" || imageUrl === "" || aboutDescription === "") {
      swal({
        icon: "error",
        title: "Error...",
        text: "Information can't be empty",
      });
      return;
    }
    myDatabase.ref("about-store").set({
      "about-title": title,
      "about-url": imageUrl,
      "about-description": aboutDescription,
    });

    swal({
      icon: "success",
      title: "Success...",
      text: "Information successfully updated",
    });
  });

  // Join Us //

  let userInformation = myDatabase.ref("/clientJoin");

  userInformation.on("value", function (snap) {
    let userData = Object.entries(snap.val()).map((item) => {
      return {
        id: item[0],
        ...item[1],
      };
    });
    renderPage(userData);
  });

  function renderPage(userInfoArr) {
    $("#joinTable").html(
      userInfoArr
        .map((item, index) => {
          return `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${item.inputFullName}</td>
            <td>${item.inputEmail}</td>
       </tr>
        `;
        })
        .join("")
    );
  }

  // Contact Us //

  let userContact = myDatabase.ref("/clientContact");

  userContact.on("value", function (snap) {
    let userContactData = Object.entries(snap.val()).map((data) => {
      return {
        id: data[0],
        ...data[1],
      };
    });
    renderPageContact(userContactData);
  });

  function renderPageContact(userArr) {
    $("#contactTable").html(
      userArr.map((user, index) => {
        return `
            <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${user.fullNameContactUs}</td>
                  <td>${user.emailContactUs}</td>
                  <td>${user.addressContactUs}</td>
                  <td>${user.phoneContactUs}</td>
            </tr>
      `;
      })
    );

    // Mobile //

    let sidebar = $(".sidebar");
    $(".hamburger").click(function () {
      $("#adminpanel").hide();
      sidebar.show();
    });
    $(".x-image").click(function () {
      sidebar.hide();
      $("#adminpanel").show();
      $(".menuHeader").show();
    });
  }
});
