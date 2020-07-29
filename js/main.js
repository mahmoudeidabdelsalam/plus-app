var messageBanner;
var isUserLoggedIn = false;
var xhrRequest;

(function () {
  "use strict";

  // Login With Keep Rememeber Me
  $(function () {
    $('#ButtonLogin').click(function () {
      if ($('input#RememberMe').is(':checked')) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (10 * 24 * 60 * 60 * 1000));
        var email = GetLoginEmail();
        var password = GetLoginPassword(); 
        var encodedString = btoa(password);
        var UserKeep = { 'email': email, 'password': encodedString, 'expires': expires };
        localStorage.setItem('UserKeep', JSON.stringify(UserKeep));
      }
    });
  });

  // document
  $(document).ready(function () {

    var GetKeep = JSON.parse(localStorage.getItem("UserKeep"));
    var today = new Date();
    if (GetKeep) {
      if (today != GetKeep.expires) {
        var valResult = validateLogInKeep(GetKeep.email, GetKeep.password);
        if (valResult) {
          var decodedString = atob(GetKeep.password);
          logInUserKeep(GetKeep.email, decodedString);

          var expires = new Date();
          expires.setTime(expires.getTime() + (10 * 24 * 60 * 60 * 1000));
          var UserKeep = { 'email': GetKeep.email, 'password': GetKeep.password, 'expires': expires };
          localStorage.setItem('UserKeep', JSON.stringify(UserKeep));
        }
      }
    }

    function logInUserSuccessCallbackKeep(response) {
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
        showNotification("Login Keep Error", response.message);
      }
    }

    function logInUserErrorCallbackKeep(response) {
      showLogInArea();
      showNotification("Error", 'Log in process failed');
      hideGroupSpinner();
    }

    function logInUserKeep(Getemail, GetPassword) {
      var type = requestMethod.POST;
      var url = ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.logInUrl;
      var data = {
        email: Getemail,
        password: GetPassword
      };
      var contentType = requestContentType.JSON;
      var dataType = '';
      CallWS(type, url, contentType, dataType, JSON.stringify(data), logInUserSuccessCallbackKeep, logInUserErrorCallbackKeep, null);
    }

    // 1. Validate sign up and log in, on click and handle actions
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


    // 1.1 Get Terms Items in login screen Home
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
          var column = data[i].column;
          var number = data[i].pre_page;
          var sources = data[i].sources;
          if (i == 0) {
            GetContent(data[i].id, column, number, sources);
          }
          var tr_str = "<li>" +
            "<span class='icon'><img class='m-auto d-block img-fluid' src='" + icon + "' alt='logo plus'></span>" +
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


    // 2. actions get main item for term id
    $("body").on("click", ".term-link", function () {
      var term_id = $(this).attr("data-id");
      var column = $(this).attr("data-column");
      var per_page = $(this).attr("data-number");
      var sources = $(this).attr("data-sources");
      $('.term-link').removeClass('active');
      $(this).addClass('active');
      $('#TextSearch').val("");
      $("#data-container").animate({
        opacity: 0,
        left: "-100%",
        }, 300, function () {
        GetContent(term_id, column, per_page, sources);
      });
    });

    
    // 2.1 actions get main items for child
    $("body").on("click", ".GetItems", function () {
      var term_id = $(this).attr("data-id");
      var column = $(this).attr("data-column");
      var per_page = $(this).attr("data-number");
      var sources = $(this).attr("data-sources");
      var parent = $(this).attr("data-parent");
      var name = $(this).attr("data-name");
      

      $("#data-container").animate({
        opacity: 0,
        left: "-100%",
      }, 300, function () {
        GetContent(term_id, column, per_page, sources, parent, name);
      });

    });

    // 3. actions get main item for back term
    $("body").on("click", ".back-link", function () {
      var term_id = $(this).attr("data-id");
      var column = $(this).attr("data-column");
      var per_page = $(this).attr("data-number");
      var sources = $(this).attr("data-sources");
      $('#TextSearch').val("");

      $(this).remove();

      $("#data-container").animate({
        opacity: 0,
        left: "-100%",
      }, 300, function () {
        GetContent(term_id, column, per_page, sources);
      });
    });


    // 3.1 actions get main item for back term
    $("body").on("click", ".GetIcons", function () {
      var post_id = $(this).attr("data-id");
      var column = $(this).attr("data-column");
      var per_page = $(this).attr("data-number");
      var sources = $(this).attr("data-sources");
      var term = $(this).attr("data-term");
      var name = $(this).attr("data-name");

      $("#data-container").animate({
        opacity: 0,
        left: "-100%",
      }, 300, function () {
          GetIcons(post_id, column, per_page, sources, term, name);
      });
    });


    // 4. Search actions for items bsaed click or keyup or entr
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


    
    // 5. function GetNavBar Items
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
            var sources = data[i].sources;

            if (column === null || column === undefined) {
              column = 2;
            }

            var item_term = "<li class='item'><a href='#' class='term-link " + active + "' data-sources='" + sources +"' data-id='" + id + "' data-column='" + column + "' data-number='" + number + "'>" +
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









    // 6. function GetContent Items based term_id
    function GetContent(Term_id, column, number, sources, parent, name) {
      var id = Term_id;
      var column_nu = column;
      var per_page = number;
      var source = sources;
      var parent_id = parent;
      var parent_name = name;

      if (source === "children") {

        $.ajax({
          type: 'GET',
          url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GetSubCategory + id,
          contentType: requestContentType.JSON,
          dataType: '',
          beforeSend: function () {
            showSpinner();
          },
          success: function (response) {
            $("#data-container").html("");
            hideSpinner();
            $('.search .term-link').remove();
            var data = response.data
            let container = $('#pagination');
            container.pagination({
              dataSource: data,
              pageSize: per_page,
              callback: function (data, pagination) {
                var dataHtml = '<ul class="column-' + column_nu + '">';
                $.each(data, function (index, item) {
                  dataHtml += '<li><a href="#" data-name="'+ item.name +'" data-parent="' + item.parent_id + '" data-id="' + item.id + '" data-id="' + item.id + '" data-column="' + item.column + '" data-number="' + item.pre_page + '" class="GetItems"><span><img title="' + item.name + '" alt="' + item.name + '" src="' + item.icon + '" /></span></a></li>';
                });
                dataHtml += '</ul>';
                $("#data-container").animate({
                  opacity: 1,
                  left: "0"
                }, 300, function () {
                  $("#data-container").append(dataHtml).show("slow");
                });                
              }
            })
          },
          error: function () {
            showNotification("error", "Loding Filed 404");
            hideSpinner();
          }
        });

      } else if (source === "collection") {

        $.ajax({
          type: 'GET',
          url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GetContent + id + ppGraphicsInjectorConfigurationData.Per_page,
          contentType: requestContentType.JSON,
          dataType: '',
          beforeSend: function () {
            showSpinner();
          },
          success: function (response) {
            $("#data-container").html("");
            hideSpinner();

            var data = response.data
            let container = $('#pagination');
            container.pagination({
              dataSource: data,
              pageSize: per_page,
              callback: function (data, pagination) {
                var dataHtml = '<ul class="column-' + column_nu + '">';

                $.each(data, function (index, item) {
                  dataHtml += '<li><a href="#" data-name="'+ item.Name +'" data-term="' + id + '" data-id="' + item.Id + '" data-column="' + column_nu + '" data-number="' + per_page + '" data-source="'+ source +'" class="GetIcons"><span><img title="' + item.Name + '" alt="' + item.Name + '" src="' + item.PreviewImage + '" /></span></a></li>';
                });
                dataHtml += '</ul>';

                $("#data-container").animate({
                  opacity: 1,
                  left: "0"
                }, 300, function () {
                  $("#data-container").append(dataHtml).show("slow");
                });
              }
            })
          },
          error: function () {
            hideSpinner();
            showNotification("error", "Loding Filed 404");
          }
        });

      } else {

        $.ajax({
          type: 'GET',
          url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GetContent + id + ppGraphicsInjectorConfigurationData.Per_page,
          contentType: requestContentType.JSON,
          dataType: '',
          beforeSend: function () {
            showSpinner();
          },
          success: function (response) {
            $("#data-container").html("");
            hideSpinner();

            var data = response.data
            let container = $('#pagination');
            container.pagination({
              dataSource: data,
              pageSize: per_page,
              callback: function (data, pagination) {
                var dataHtml = '<ul class="column-' + column_nu + '">';

                $.each(data, function (index, item) {
                  dataHtml += '<li><a href="#" data-type="' + item.Type + '" data-url="' + item.Content + '" class="clickToInsert"><span><img title="' + item.Name + '" alt="' + item.Name + '" src="' + item.PreviewImage + '" /></span></a></li>';
                });
                dataHtml += '</ul>';

                if (parent_id) {
                  $.ajax({
                    type: 'GET',
                    url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GetCategory + '?term_id=' + parent_id,
                    contentType: requestContentType.JSON,
                    dataType: '',
                    success: function (response) {
                      $('.search .term-link').remove();
                      $('input#TextSearch').val(parent_name);
                      var data = response.data
                      var databack = "";
                      $.each(data, function (index, item) {                        
                        databack += "<a href='#' class='back-link' data-sources='" + item.sources + "' data-id='" + item.id + "' data-column='" + item.column + "' data-number='" + item.pre_page + "'><img src='Images/reset.png' /></a>";
                      });
                      $('.search').append(databack);
                    }
                  });
                } else {
                  $('.search .back-link').remove();
                }
                $("#data-container").animate({
                  opacity: 1,
                  left: "0"
                }, 300, function () {
                  $("#data-container").append(dataHtml).show("slow");
                });
              }
            })
          },
          error: function () {
            hideSpinner();
            showNotification("error", "Loding Filed 404");
          }
        });

      }
    }




    // 6.1 function Geticons Item based post_id
    function GetIcons(post_id, column, number, sources, term, name) {
      var id = post_id;
      var column_nu = column;
      var per_page = number;
      var parent_id = term;
      var parent_name = name;

      $.ajax({
        type: 'GET',
        url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GetIcons + id,
        contentType: requestContentType.JSON,
        dataType: '',
        beforeSend: function () {
          showSpinner();
        },
        success: function (response) {
          $("#data-container").html("");
          hideSpinner();

          var data = response.data
          let container = $('#pagination');
          container.pagination({
            dataSource: data,
            pageSize: per_page,
            callback: function (data, pagination) {

              var icons = data[0].Collocations;
              var dataHtml = '<ul class="column-' + column_nu + '">';

              $.each(icons, function (index, item) {
                dataHtml += '<li><a href="#" data-type="' + item.file_icon.subtype + '" data-url="' + item.file_icon.url + '" class="clickToInsert"><span><img title="' + item.file_icon.name + '" alt="' + item.file_icon.name + '" src="' + item.file_icon.url + '" /></span></a></li>';
              });

              dataHtml += '</ul>';

              if (parent_id) {
                $.ajax({
                  type: 'GET',
                  url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GetCategory + '?term_id=' + parent_id,
                  contentType: requestContentType.JSON,
                  dataType: '',
                  success: function (response) {
                    $('.search .term-link').remove();
                    $('input#TextSearch').val(parent_name);
                    var data = response.data
                    var databack = "";
                    $.each(data, function (index, item) {
                      databack += "<a href='#' class='back-link' data-sources='" + item.sources + "' data-id='" + item.id + "' data-column='" + item.column + "' data-number='" + item.pre_page + "'><img src='Images/reset.png' /></a>";
                    });
                    $('.search').append(databack);
                  }
                });
              } else {
                $('.search .back-link').remove();
              }
              $("#data-container").animate({
                opacity: 1,
                left: "0"
              }, 300, function () {
                $("#data-container").append(dataHtml).show("slow");
              });
            }
          })
        },
        error: function () {
          hideSpinner();
          showNotification("error", "Loding Filed 404");
        }
      });
    }

    // 7. function GetSearch Items based search_text & term_id
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
            showNotification("Nothing found for that search.", "How about checking this collections");
          }
          
        },
        error: function () {
          hideSpinner();
          showNotification("error", "Loding Filed 404");
        }
      });
    }

  });

  

  Office.initialize = function (reason) { 
    $(document).ready(function () { 
      // 8. Insrt Items
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
    });
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
    $('.col-header').text(header);
    $('.col-content').text(content);
    $("#Notification").toggle();
  }





})();

