var messageBanner;
var isUserLoggedIn = false;
var xhrRequest;

(function () {
  "use strict";

  // jQBrowser v0.2: http://davecardwell.co.uk/javascript/jquery/plugins/jquery-browserdetect/
  eval(function (p, a, c, k, e, d) { e = function (c) { return (c < a ? "" : e(c / a)) + String.fromCharCode(c % a + 161) }; while (c--) { if (k[c]) { p = p.replace(new RegExp(e(c), 'g'), k[c]) } } return p }('Ö ¡(){® Ø={\'¥\':¡(){¢ £.¥},\'©\':{\'±\':¡(){¢ £.©.±},\'¯\':¡(){¢ £.©.¯}},\'¬\':¡(){¢ £.¬},\'¶\':¡(){¢ £.¶},\'º\':¡(){¢ £.º},\'Á\':¡(){¢ £.Á},\'À\':¡(){¢ £.À},\'½\':¡(){¢ £.½},\'¾\':¡(){¢ £.¾},\'¼\':¡(){¢ £.¼},\'·\':¡(){¢ £.·},\'Â\':¡(){¢ £.Â},\'³\':¡(){¢ £.³},\'Ä\':¡(){¢ £.Ä},\'Ã\':¡(){¢ £.Ã},\'Å\':¡(){¢ £.Å},\'¸\':¡(){¢ £.¸}};$.¥=Ø;® £={\'¥\':\'¿\',\'©\':{\'±\':²,\'¯\':\'¿\'},\'¬\':\'¿\',\'¶\':§,\'º\':§,\'Á\':§,\'À\':§,\'½\':§,\'¾\':§,\'¼\':§,\'·\':§,\'Â\':§,\'³\':§,\'Ä\':§,\'Ã\':§,\'Å\':§,\'¸\':§};Î(® i=0,«=».ì,°=».í,¦=[{\'¤\':\'Ý\',\'¥\':¡(){¢/Ù/.¨(°)}},{\'¤\':\'Ú\',\'¥\':¡(){¢ Û.³!=²}},{\'¤\':\'È\',\'¥\':¡(){¢/È/.¨(°)}},{\'¤\':\'Ü\',\'¥\':¡(){¢/Þ/.¨(°)}},{\'ª\':\'¶\',\'¤\':\'ß Ñ\',\'¥\':¡(){¢/à á â/.¨(«)},\'©\':¡(){¢ «.¹(/ã(\\d+(?:\\.\\d+)+)/)}},{\'¤\':\'Ì\',\'¥\':¡(){¢/Ì/.¨(«)}},{\'¤\':\'Í\',\'¥\':¡(){¢/Í/.¨(°)}},{\'¤\':\'Ï\',\'¥\':¡(){¢/Ï/.¨(«)}},{\'¤\':\'Ð\',\'¥\':¡(){¢/Ð/.¨(«)}},{\'ª\':\'·\',\'¤\':\'å Ñ\',\'¥\':¡(){¢/Ò/.¨(«)},\'©\':¡(){¢ «.¹(/Ò (\\d+(?:\\.\\d+)+(?:b\\d*)?)/)}},{\'¤\':\'Ó\',\'¥\':¡(){¢/æ|Ó/.¨(«)},\'©\':¡(){¢ «.¹(/è:(\\d+(?:\\.\\d+)+)/)}}];i<¦.Ë;i++){µ(¦[i].¥()){® ª=¦[i].ª?¦[i].ª:¦[i].¤.Õ();£[ª]=É;£.¥=¦[i].¤;® ­;µ(¦[i].©!=²&&(­=¦[i].©())){£.©.¯=­[1];£.©.±=Ê(­[1])}ê{® Ç=Ö ë(¦[i].¤+\'(?:\\\\s|\\\\/)(\\\\d+(?:\\\\.\\\\d+)+(?:(?:a|b)\\\\d*)?)\');­=«.¹(Ç);µ(­!=²){£.©.¯=­[1];£.©.±=Ê(­[1])}}×}};Î(® i=0,´=».ä,¦=[{\'ª\':\'¸\',\'¤\':\'ç\',\'¬\':¡(){¢/é/.¨(´)}},{\'¤\':\'Ô\',\'¬\':¡(){¢/Ô/.¨(´)}},{\'¤\':\'Æ\',\'¬\':¡(){¢/Æ/.¨(´)}}];i<¦.Ë;i++){µ(¦[i].¬()){® ª=¦[i].ª?¦[i].ª:¦[i].¤.Õ();£[ª]=É;£.¬=¦[i].¤;×}}}();', 77, 77, 'function|return|Private|name|browser|data|false|test|version|identifier|ua|OS|result|var|string|ve|number|undefined|opera|pl|if|aol|msie|win|match|camino|navigator|mozilla|icab|konqueror|Unknown|flock|firefox|netscape|linux|safari|mac|Linux|re|iCab|true|parseFloat|length|Flock|Camino|for|Firefox|Netscape|Explorer|MSIE|Mozilla|Mac|toLowerCase|new|break|Public|Apple|Opera|window|Konqueror|Safari|KDE|AOL|America|Online|Browser|rev|platform|Internet|Gecko|Windows|rv|Win|else|RegExp|userAgent|vendor'.split('|')))

  /* ----------------------------------------------------------------- */

  var aol = $.browser.aol();       // AOL Explorer
  var camino = $.browser.camino();    // Camino
  var firefox = $.browser.firefox();   // Firefox
  var flock = $.browser.flock();     // Flock
  var icab = $.browser.icab();      // iCab
  var konqueror = $.browser.konqueror(); // Konqueror
  var mozilla = $.browser.mozilla();   // Mozilla
  var msie = $.browser.msie();      // Internet Explorer Win / Mac
  var netscape = $.browser.netscape();  // Netscape
  var opera = $.browser.opera();     // Opera
  var safari = $.browser.safari();    // Safari

  var userbrowser = $.browser.browser(); //detected user browser

  //operating systems

  var linux = $.browser.linux(); // Linux
  var mac = $.browser.mac();   // Mac OS
  var win = $.browser.win();   // Microsoft Windows

  //version

  var userversion = $.browser.version.number();

  /* ----------------------------------------------------------------- */

  if (mac == true) {

    $("html").addClass("mac");


  } else if (linux == true) {

    $("html").addClass("linux");

  } else if (win == true) {

    $("html").addClass("windows");

  }

  /* ----------------------------------------------------------------- */

  if (userbrowser == "Safari") {

    $("html").addClass("safari");

  } else if (userbrowser == "Firefox") {

    $("html").addClass("firefox");

  } else if (userbrowser == "Camino") {

    $("html").addClass("camino");

  } else if (userbrowser == "AOL Explorer") {

    $("html").addClass("aol");

  } else if (userbrowser == "Flock") {

    $("html").addClass("flock");

  } else if (userbrowser == "iCab") {

    $("html").addClass("icab");

  } else if (userbrowser == "Konqueror") {

    $("html").addClass("konqueror");

  } else if (userbrowser == "Mozilla") {

    $("html").addClass("mozilla");

  } else if (userbrowser == "Netscape") {

    $("html").addClass("netscape");

  } else if (userbrowser == "Opera") {

    $("html").addClass("opera");

  } else if (userbrowser == "Internet Explorer") {

    $("html").addClass("ie");

  } else { }

  $("html").addClass("" + userversion + "");
  
  Office.initialize = function (reason) {
    $(document).ready(function () {

      //1. Validate sign up and log in, on click and handle actions
      $('#ButtonLogin').click(function () {
        showSpinner();
        setTimeout(
          function () {
            var valResult = validateLogInAction();            
            showSpinner();
            if (valResult) {
              logInUser();
            }
          }, 100);
      });

      function logInUserSuccessCallback(response) {
        if (response.data.IsSuccess) {
          hideSpinner();
          hideLogInArea();
          showMainArea();
          GetNavBar();
          isUserLoggedIn = true;
        } else {
          isUserLoggedIn = false;
          showLogInArea();
          hideSpinner();
          showNotification("Information", response.message);
        }
      }

      function logInUserErrorCallback(response) {
        showLogInArea();
        showNotification("Error", 'Log in process failed');
        hideGroupSpinner();
      }

      // Buttons Header
      $("#InputPassword").focus(function () {
        ShowButtonLogin();
      });

      $(".dropdown-toggle").click(function () {
        $(".dropdown-menu").toggleClass("acive");
      });

			$('#goto-website').click(function () {
				window.open("https://plus.premast.com/", "_blank");
      });
      
			$('#goto-community').click(function () {
        window.open("https://premast.com/blog/", "_blank");
      });
      
			$('#goto-support').click(function () {
				window.open("https://premast.com/contact-us/", "_blank");
      });
      
      $('#goto-terms').click(function () {
        window.open("https://plus.premast.com/privacy-policy/", "_blank");
      });
      
			$('#goto-signout').click(function () {
        hideMainArea();
        showLogInArea();
				ClearCredentials();
			});


      // Nav Bar Header 
      $("body").on("click", ".term-link", function () {
        var term_id = $(this).attr("data-id");
        var column = $(this).attr("data-column");
        var per_page = $(this).attr("data-number");
        $('.term-link').removeClass('active');
        $(this).addClass('active');
        $('#TextSearch').val("");
        GetContent(term_id, column, per_page);
      });

      // Search
      $("body").on("click", "#submitSearch", function () {
        var search_text = $('#TextSearch').val();
        var term_id = $('.item a.active').data('id');
        var column = $('.item a.active').data('column');
        GetSearchContent(search_text, term_id, column);
      });
      

      $('#TextSearch').bind("enterKey", function (e) {
        var search_text = $('#TextSearch').val();
        var term_id = $('.item a.active').data('id');
        var column = $('.item a.active').data('column');
        GetSearchContent(search_text, term_id, column);
      });

      $('#TextSearch').keyup(function (e) {
        if (e.keyCode == 13) {
          $(this).trigger("enterKey");
        }
      });


      // 2. Search for graphics
      var typingTimer;                //timer identifier
      var doneTypingInterval = 1200;  //time in ms
      var searchBoxControl = $('#TextSearch');
      $(searchBoxControl).on("keyup", function () {
        var search_text = $('#TextSearch').val();
        var term_id = $('.item a.active').data('id');
        var column = $('.item a.active').data('column');
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function () {GetSearchContent(search_text, term_id, column)}, doneTypingInterval);
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
            if (i == 0) {
              GetContent(data[i].id);
            }
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
              var active = "";
              if(i == 0) {
                active = "active";
              }
              var name = data[i].name;
              var id = data[i].id;
              var icon = data[i].icon;
              var column = data[i].column;
              var number = data[i].pre_page;

              if (column === null || column === undefined) {
                column = 2;
              }

              var item_term = "<li class='item'><a href='#' class='term-link " + active + "' data-id='" + id + "' data-column='" + column + "' data-number='" + number + "'>" +
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
      function GetContent(Term_id, column, number) {
        var id = Term_id;
        var column_nu = column;
        var per_page = number;
        $.ajax({
          type: 'GET',
          url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GetContent + id + ppGraphicsInjectorConfigurationData.Per_page,
          contentType: requestContentType.JSON,
          dataType: '',
          beforeSend: function () {
            showSpinner();
          },
          success: function (response) {
            hideSpinner();
            var data = response.data
            let container = $('#pagination');
            container.pagination({
              dataSource: data,
              pageSize: per_page,
              callback: function (data, pagination) {
                var dataHtml = '<ul class="column-' + column_nu +'">';
                $.each(data, function (index, item) {
                  dataHtml += '<li><a href="#" data-type="' + item.Type + '" data-url="' + item.Content + '" class="clickToInsert"><span><img title="' + item.Name + '" alt="' + item.Name + '" src="' + item.PreviewImage + '" /></span></a></li>';
                });
                dataHtml += '</ul>';
                $("#data-container").html(dataHtml);
              }
            })
          },
          error: function () {
            hideSpinner();
            showNotification("error", "Loding Filed 404");
          }
        });
      }

      // 5.Get Search Items
      function GetSearchContent(search_text, term_id, column) {
        var search_text = search_text;
        var term_id = term_id;
        var column_nu = column;
        $.ajax({
          type: 'GET',
          url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GetSearch + search_text + ppGraphicsInjectorConfigurationData.WithCategory + term_id ,
          contentType: requestContentType.JSON,
          dataType: '',
          beforeSend: function () {
            showSpinner();
            $("#data-container").html();
          },
          success: function (response) {
            hideSpinner();
            var data = response.data
            if (data) {
              let container = $('#pagination');
              container.pagination({
                dataSource: data,
                callback: function (data, pagination) {
                  var dataHtml = '<ul class="column-' + column_nu + '">';
                  $.each(data, function (index, item) {
                    dataHtml += '<li><a href="#" data-type="' + item.Type + '" data-url="' + item.Content + '" class="clickToInsert"><span><img title="' + item.Name + '" alt="' + item.Name + '" src="' + item.PreviewImage + '" /></span></a></li>';
                  });
                  dataHtml += '</ul>';
                  $("#data-container").html(dataHtml);
                }
              })
            } else {
              showNotification("No Pen found for", search_text);
            }
            
          },
          error: function () {
            hideSpinner();
            showNotification("error", "Loding Filed 404");
          }
        });
      }

      // 5. Insrt Items
      $("body").on("click", ".clickToInsert", function () {
        var src = $(this).attr("data-url");
        var type = $(this).attr("data-type");
        var coercionTypeOfItem = '';
        
        if (type == 'jpg' || type == 'png') {
          $.ajax({
            type: requestMethod.GET,
            url: src,
            xhrFields: {
              responseType: 'blob'
            },
            beforeSend: function () {
              showSpinner();
            },
            success: function (data) {
              hideSpinner();
              var reader = new FileReader();
              reader.readAsDataURL(data);
              reader.onloadend = function () {
              var dataUrl = reader.result;
                  if (dataUrl.indexOf("base64,") > 0) {
                    var startIndex = dataUrl.indexOf("base64,");
                    var copyBase64 = dataUrl.substr(startIndex + 7);

                    Office.context.document.setSelectedDataAsync(
                      copyBase64,
                      {
                        coercionType: Office.CoercionType.Image
                      },
                      function (asyncResult) {
                        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                          console.log(asyncResult.error.message);
                        }
                      }
                    );
                  } else {
                    PowerPoint.createPresentation(dataUrl);
                  }
              };
            },
            error: function (data) {
              hideSpinner();
              console.log("runRequests Error", "user", arguments);
            }
          });

        } else if (type == 'pptx') {

          coercionTypeOfItem = "pptmplt";
          $.ajax({
            type: requestMethod.GET,
            url: src,
            xhrFields: {
              responseType: 'blob'
            },
            success: function (data) {
              var reader = new FileReader();
              reader.readAsDataURL(data);
              reader.onloadend = function () {
                var dataUrl = reader.result;
                if (dataUrl.indexOf("base64,") > 0) {
                  var startIndex = dataUrl.indexOf("base64,");
                  var copyBase64 = dataUrl.substr(startIndex + 7);
                  PowerPoint.createPresentation(copyBase64);
                } else {
                  PowerPoint.createPresentation(dataUrl);
                }
              };
            },
            error: function (data) {
              console.log("runRequests Error", "user", arguments);
              hideGroupSpinner();
              hideTempSpinner();
            }
          });

        } else if (type == 'svg') {
          coercionTypeOfItem = Office.CoercionType.XmlSvg;
          $.ajax({
            type: requestMethod.GET,
            url: src,
            success: function (data) {
              var grContent = new XMLSerializer().serializeToString(data.documentElement);
              Office.context.document.setSelectedDataAsync(grContent, { coercionType: coercionTypeOfItem },
                function (asyncResult) {
                  if (asyncResult.status === "failed") {
                    showNotification("Error", "Failed to insert selected text. " + asyncResult.error.message);
                  }
                });
            },
            error: function (data) {
              console.log("runRequests Error", "user", arguments);
              hideGroupSpinner();
              hideTempSpinner();
            }
          });
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
        CallWS(type, url, contentType, dataType, JSON.stringify(data), logInUserSuccessCallback, logInUserErrorCallback, null);
      }

    });
  

  // end Office
  };


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

  console.log(email);
  

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