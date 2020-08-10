// ## var request types ##
var requestMethod = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE'
};
var requestContentType = {
  TEXT: 'text/plain',
  JSON: 'application/json',
  XML: 'application/xml',
  HTML: 'text/html'
};
var responseTypes = {
  Blob: 'blob',
  Svg: 'svg'
};

//  ###  Functions ###
function GetLoginEmail() {
  return $('#InputEmail').val();
}

function GetLoginPassword() {
  return $('#InputPassword').val();
}

function ClearCredentials() {
  $('#InputEmail').val("");
  $('#InputPassword').val("");
  location.reload();
}

function showLogInArea() {
  $('#UserLogin').show();
}

function hideLogInArea() {
  $('#UserLogin').hide();
}

function showMainArea() {
  $('#mainArea').show();
}

function hideMainArea() {
  $('#mainArea').hide();
}

function showSpinner() {
  $('#Spinner').show();
}

function hideSpinner() {
  $('#Spinner').fadeOut("slow");
}

function ShowLogin() {
  document.getElementById("login").style.display = "block";
  document.getElementById("descrtion").style.display = "none";
}

function showPassword() {
  var x = document.getElementById("InputPassword");
  if (x.type === "password") {
    x.type = "text";
    $('#showPassword .fa').removeClass('fa-eye-slash');
    $('#showPassword .fa').addClass('fa-eye');
  } else {
    x.type = "password";
    $('#showPassword .fa').addClass('fa-eye-slash');
    $('#showPassword .fa').removeClass('fa-eye');
  }
}

function ShowButtonLogin() {
  document.getElementById("ButtonLogin").removeAttribute("disabled")
}



function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validateLogInAction() {
  var email = GetLoginEmail();
  var password = GetLoginPassword();
  if (!email.trim().length > 0 || !password.trim().length > 0) {
    showNotification("Warning", 'Email address and password are required');
    hideSpinner();
    return false;
  }
  if (!validateEmail(email)) {
    showNotification("Warning", 'Please enter a valid email address');
    hideSpinner();
    return false;
  }
  return true;
}

function validateLogInKeep(email, password) {
  var Getemail = email;
  var Getpassword = password;
  if (!Getemail.trim().length > 0 || !Getpassword.trim().length > 0) {
    showNotification("Warning", 'Email address and password are required');
    hideSpinner();
    return false;
  }
  if (!validateEmail(Getemail)) {
    showNotification("Warning", 'Please enter a valid email address');hideSpinner();
    hideSpinner();
    return false;
  }
  return true;
}


function showNotification(header, content) {
  $('.col-header').text(header);
  $('.col-content').text(content);
  $(".Notification").show();
}



// 2. buttons for menu more in website
$("#InputPassword").focus(function () {
  ShowButtonLogin();
});

$(".dropdown-toggle").click(function () {
  $(".dropdown-menu").toggleClass("acive");
});

$('#goto-signout').click(function () {
  hideMainArea();
  showLogInArea();
  ClearCredentials();
  localStorage.removeItem("UserKeep");
});
