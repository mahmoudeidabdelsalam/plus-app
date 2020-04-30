function ShowLogin() {
  document.getElementById("login").style.display = "block";
  document.getElementById("descrtion").style.display = "none";
}

function showPassword() {
  var x = document.getElementById("InputPassword");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

function ShowButtonLogin() {
  document.getElementById("ButtonLogin").removeAttribute("disabled")
}


// *** Validations *** //
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

//  ###  A - LOG IN AREA  ###
function validateLogInAction() {
  var email = GetLoginEmail();
  var password = GetLoginPassword();

  if (!email.trim().length > 0 || !password.trim().length > 0) {
    showNotification("Warning", 'Email address and password are required');
    return false;
  }

  if (!validateEmail(email)) {
    showNotification("Warning", 'Please enter a valid email address');
    return false;
  }

  return true;
}


var messageBanner;
var isUserLoggedIn = false;
var xhrRequest;

(function () {
  "use strict";


    $(document).ready(function () {

      $(".dropdown-toggle").click(function () {
        $(".dropdown-menu").toggleClass("acive");
      });


			$('#goto-website').click(function () {
				window.open("https://www.premast.com/", "_blank");
			});
			$('#goto-community').click(function () {
				window.open("https://www.premast.com/blog/", "_blank");
			});
			$('#goto-support').click(function () {
				window.open("https://www.premast.com/contact-us/", "_blank");
			});
      $('#goto-terms').click(function () {
        window.open("https://www.premast.com/terms-and-conditions/", "_blank");
			});
			$('#goto-signout').click(function () {
        hideMainArea();
        showLogInArea();
				ClearCredentials();
			});

      //1. Validate sign up and log in, on click and handle actions
      $('#ButtonLogin').click(function () {
        var valResult = validateLogInAction();
        showSpinner();
        if (valResult) {
          logInUser();
          GetNavBar();
          GetContent();
        }
      });


      // 2.Get Terms Items
      $.ajax({
        type: 'GET',
        url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GetCategory,
        contentType: requestContentType.JSON,
        dataType: '',
        beforeSend: function () {
          showSpinner();
        },
        success: function (response) {
          hideSpinner();
          var data = response.data
          var len = data.length;
          for (var i = 0; i < len; i++) {
            var name = data[i].name;
            var icon = data[i].icon;
            var tr_str = "<li>" +
              "<span class='icon'><img class='m-auto d-block img-fluid' src='" + icon +"' alt='logo plus'></span>" +
              "<span class='name'>" + name + "</span>" +
              "</li>";

            $("#ListCategory").append(tr_str);
          }
        },
        error: function () {
          hideSpinner();
          showNotification("error", "Loding Filed 404");
        }
      });


      // 3.Login Users
      function logInUser() {
        var type = requestMethod.POST;
        var url = ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.logInUrl;
        var data = {
          email: GetLoginEmail(),
          password: GetLoginPassword()
        };
        var contentType = requestContentType.JSON;
        var dataType = '';
        CallWS(type, url, contentType, dataType, JSON.stringify(data), logInUserSuccessCallback, logInUserErrorCallback, logInUserErrorCallback, null);
      }

      // 4.Get NavBar Items
      function GetNavBar() {
        $.ajax({
          type: 'GET',
          url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GetCategory,
          contentType: requestContentType.JSON,
          dataType: '',
          beforeSend: function () {
            showSpinner();
          },
          success: function (response) {
            hideSpinner();
            var data = response.data
            var len = data.length;
            for (var i = 0; i < len; i++) {
              console.log(i);
              var active = "";
              if(i == 0) {
                active = "active"
              }
              var name = data[i].name;
              var id = data[i].id;
              var icon = data[i].icon;
              var item_term = "<li class='nav-item'><a class='nav-link " + active + "' id='" + id + "-tab' data-toggle='tab' href='#" + id + "' role='tab' aria-controls='" + id + "' aria-selected='true'>" +
                "<span class='icon'><img class='m-auto d-block img-fluid' src='" + icon + "' alt='logo plus'></span>" +
                "<span class='name'>" + name + "</span>" +
                "</a></li>";

              $("#myTab").append(item_term);
            }
          },
          error: function () {
            hideSpinner();
            showNotification("error", "Loding Filed 404");
          }
        });
      }


      // 4.Get NavBar Items
      function GetContent() {
        $.ajax({
          type: 'GET',
          url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GetContent,
          contentType: requestContentType.JSON,
          dataType: '',
          beforeSend: function () {
            showSpinner();
          },
          success: function (response) {
            hideSpinner();
            var data = response.data
            var len = data.length;
            for (var i = 0; i < len; i++) {
              
              var Image = data[i].PreviewImage;

              var items = "<li class='img-item'>" +
                "<img src='" + Image + "' />" +
                "</li>";

              $("#content").append(items);
            }
          },
          error: function () {
            hideSpinner();
            showNotification("error", "Loding Filed 404");
          }
        });
      }


    });


  function CallWS(type, url, contentType, dataType, data, successCallBack, errorCallback, failureCallback, params) {
    $.ajax({
      type: type,
      url: url,
      contentType: contentType,
      dataType: dataType,
      data: data,
      success: function (response) {
        if (successCallBack) successCallBack(response, params);
      },
      failure: function (response) {
        if (failureCallback) failureCallback(response.Message);
        hideSpinner();
      },
      error: function (response) {
        if (errorCallback) errorCallback(response.Message);
        hideSpinner();
      }
    });
  }


  function logInUserSuccessCallback(response) {
    if (response.data.IsSuccess) {
      hideLogInArea();
      showMainArea();
      hideSpinner();
      isUserLoggedIn = true;
    } else {
      isUserLoggedIn = false;
      showLogInArea();
      hideMainArea();
      hideSpinner();
      showNotification("Information", response.message);
    }
  }

  function logInUserErrorCallback(response) {
    showLogInArea();
    showNotification("Error", 'Log in process failed');
  }


  function showNotification(header, content) {
    $('.modal-title').text(header);
    $('.modal-content-text').text(content);
    $("#myModal").modal("toggle");
    if (header === "Warning") {
      $('.modal-header').addClass('modal-body-warning');
    } else if (header === "Error") {
      $('.modal-header').addClass('modal-body-error');
    } else {
      $('.modal-header').addClass('modal-body-info');
    }
  }

})();