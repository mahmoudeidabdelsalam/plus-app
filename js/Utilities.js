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
  document.getElementById("signUp").style.display = "none";
  document.getElementById("ThankYou").style.display = "none";
}

function ShowSignUp() {
  document.getElementById("signUp").style.display = "block";
  document.getElementById("descrtion").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("ThankYou").style.display = "none";
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

function showPasswordSingUp() {
  var x = document.getElementById("InputPasswordSingUp");
  if (x.type === "password") {
    x.type = "text";
    $('#showPasswordSingUp .fa').removeClass('fa-eye-slash');
    $('#showPasswordSingUp .fa').addClass('fa-eye');
  } else {
    x.type = "password";
    $('#showPasswordSingUp .fa').addClass('fa-eye-slash');
    $('#showPasswordSingUp .fa').removeClass('fa-eye');
  }
}

function showPasswordSingUpConf() {
  var x = document.getElementById("InputPasswordSingUpConf");
  if (x.type === "password") {
    x.type = "text";
    $('#showPasswordSingUpConf .fa').removeClass('fa-eye-slash');
    $('#showPasswordSingUpConf .fa').addClass('fa-eye');
  } else {
    x.type = "password";
    $('#showPasswordSingUpConf .fa').addClass('fa-eye-slash');
    $('#showPasswordSingUpConf .fa').removeClass('fa-eye');
  }
}


var $password = $("#InputPasswordSingUp");
var $confirmPass = $("#InputPasswordSingUpConf");

//Check the length of the Password
function checkLength() {
  return $password.val().length > 8;
}

//Check to see if the value for pass and confirmPass are the same
function samePass() {
  return $password.val() === $confirmPass.val();
}

//If checkLength() is > 8 then we'll hide the hint
function PassLength() {
  if (checkLength()) {
    $password.next().hide();
  } else {
    $password.next().show();
  }
}

//If samePass returns true, we'll hide the hint
function PassMatch() {
  if (samePass()) {
    $confirmPass.next().hide();
  } else {
    $confirmPass.next().show();
  }
}

function canSubmit() {
  return samePass() && checkLength();
}

function enableSubmitButton() {
  $("#ButtonSingUp").removeClass("disabled");
}

//Calls the enableSubmitButton() function to disable the button
// enableSubmitButton();

$password.keyup(PassLength).keyup(PassMatch);
$confirmPass.focus(PassMatch).keyup(PassMatch).keyup(enableSubmitButton);





function ShowButtonLogin() {
  document.getElementById("ButtonLogin").removeAttribute("disabled");
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


function showNotification(header, content, ClassName) {
  $('.Notification').addClass(ClassName);
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


$('#Switch').click(function () {
  $("body").toggleClass("dark-mode");
  $(this).text($(this).text() == 'Switch to dark mode' ? 'Switch to light mode' : 'Switch to dark mode');
  if ($("body").hasClass("dark-mode")) {
    localStorage.setItem('ThemeMode', 'dark');
  } else {
    localStorage.setItem('ThemeMode', 'light');
  }
});


$('#view #list').click(function () {
  $('div#data-container').addClass("list-item");
  $(this).addClass('active');
  $('#view #grid').removeClass('active');
});

$('#view #grid').click(function () {
  $('div#data-container').removeClass("list-item");
  $(this).addClass('active');
  $('#view #list').removeClass('active');
});


// Clipboards.js
function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();

  $('[data-toggle="tooltip"]').tooltip('hide');
  $(element).tooltip('show');
}


$("body").on("click", ".toRgb", function () {
    var color = $(this).data('color');
    $(this).hide();
    

    var regexp = /#(\S)/g;
    var color_id = color.replace(regexp, '#li_$1');

    $(color_id).find(".toHex").show();

    $(color_id).find("span.ColorCode").html('rgb('+hexToRgb(color).r +  ',' + hexToRgb(color).g + ',' + hexToRgb(color).b+')');
    $(color_id).find(".ColorType").html('rgb <i class="fa fa-retweet" aria-hidden="true"></i>'); 
});


$("body").on("click", ".toHex", function () {
  var color = $(this).data('color');
  $(this).hide();
  
  var regexp = /#(\S)/g;
  var color_id = color.replace(regexp, '#li_$1');

  $(color_id).find(".toRgb").show();

  $(color_id).find("span.ColorCode").html(color);
  $(color_id).find(".ColorType").html('hex <i class="fa fa-retweet" aria-hidden="true"></i>'); 
});



function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

