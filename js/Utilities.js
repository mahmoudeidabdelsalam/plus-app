//  ###  A - CONSTANTS  AREA  ###

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


//  ###  B - GETTERS  AREA  ###
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

// *** Show / Hide Login Area *** //
function showLogInArea() {
  $('#UserLogin').show();
}
function hideLogInArea() {
  $('#UserLogin').hide();
}

// *** Show / Hide Main Area *** //
function showMainArea() {
  $('#mainArea').show();
}
function hideMainArea() {
  $('#mainArea').hide();
}


// *** Show / Hide Spinner *** //
function showSpinner() {
  $('#Spinner').show();
}
function hideSpinner() {
  $('#Spinner').fadeOut("slow");
}
