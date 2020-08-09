var messageBanner;
var isUserLoggedIn = false;
var xhrRequest;

(function () {
  "use strict";

  /**
   * Login With Keep Rememeber Me
   * check checed input RememberMe after click button
   * add expires string (email - password hash and time)
   * add local Storng items
   * requestMethod Post.
  */
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


  /**
    * document Js
    * Login Keep & login (Validate)
    * Get Terms Items in login screen Home
    * Get item by search
    * get item by category
    * get navbar Items
  */
  $(document).ready(function () {
    /**
      * Login validate keep.
      * check login keep.
      * check today not equle expires day.
      * @params email & password from localStorage.
      * requestMethod POST.
    */
    var GetKeep = JSON.parse(localStorage.getItem("UserKeep"));
    var today = new Date();
    if (GetKeep) {
      if (today != GetKeep.expires) {
        var valResult = validateLogInKeep(GetKeep.email, GetKeep.password);
        if (valResult) {
          var decodedString = atob(GetKeep.password);
          logInUserKeep(GetKeep.email, decodedString);
        }
      }
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

    function logInUserSuccessCallbackKeep(response) {
      if (response.data.IsSuccess) {
        hideSpinner();
        hideLogInArea();
        showMainArea();
        GetNavBar();
        isUserLoggedIn = true;
        $(".Notification").hide();
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
    }


    /**
      * Validate sign up and log in, on click and handle actions.
      * check login.
      * @params email & password.
      * requestMethod POST.
    */

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


    $('input#InputPassword').bind("enterLogin", function (e) {
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

    $('input#InputPassword').keyup(function (e) {
      if (e.keyCode == 13) {
        $(this).trigger("enterLogin");
      }
    });


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

    function logInUserSuccessCallback(response) {
      if (response.data.IsSuccess) {
        hideSpinner();
        hideLogInArea();
        showMainArea();
        GetNavBar();
        isUserLoggedIn = true;
        $(".Notification").hide();
      } else {
        isUserLoggedIn = false;
        showLogInArea();
        hideSpinner();
        showNotification("failed", response.message);
      }
    }

    function logInUserErrorCallback(response) {
      showLogInArea();
      showNotification("Error", 'Log in process failed');
    }


    /**
      * Get Category navbar for screen Home.
      * @params term_id.
      * @result get all term (id - name - icon - column - pre_page - sources).
      * requestMethod GET.
    */

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
        $(".Notification").hide();
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


    /**
      * Get General Settings. 
      * @result (Logo - version - links - scripts).
      * requestMethod GET
    */

    $.ajax({
      type: 'GET',
      url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GeneralSettings,
      contentType: requestContentType.JSON,
      dataType: '',
      beforeSend: function () {
        $(".warp").hide();
        $(".help-center").hide();
        showSpinner();
      },
      success: function (response) {
        var data = response.data
        var scripts = data.scripts;
        var logo = data.logo;
        var version = data.version;
        var links = data.links;
        $("head").append(scripts);
        $("#logo").attr("src", logo);
        $("#version").append(version);
        var len = links.length;
        for (var i = 0; i < len; i++) {
          console.log(links[i]);
          var dropdown = "<a class='dropdown-item' target='_blank' href='"+links[i].link+"'>"+links[i].text+"</a>";
          $("#links").append(dropdown);
        }
        
        $(".warp").show();
        $(".help-center").show();
        hideSpinner();
      },
      error: function () {
        showNotification("error", "404");
      }
    });



    /**
      * actions get main item for term id
      * @params term_id - column - Per_page - Sources.
      * @result get items (view - content).
      * requestMethod GET.
    */
    $("body").on("click", ".term-link", function () {
      var term_id = $(this).attr("data-id");
      var column = $(this).attr("data-column");
      var per_page = $(this).attr("data-number");
      var sources = $(this).attr("data-sources");
      var parent = $(this).attr("data-parent");
      var name = $(this).attr("data-name");

      $('.term-link').removeClass('active');
      $(this).addClass('active');
      $('#TextSearch').val("");
      $("#data-container").animate({
        opacity: 0,
        left: "-100%",
        }, 100, function () {
        GetContent(term_id, column, per_page, sources, parent, name);
      });
    });


    /**
      * actions get main items for child
      * @params term_id - column - Per_page - Sources.
      * @result get items (view - content).
      * requestMethod GET.
    */
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
      }, 100, function () {
        GetContent(term_id, column, per_page, sources, parent, name);
      });
    });


    /**
      * actions get main item for back term
      * @params term_id - column - Per_page - Sources.
      * @result get items (view - content).
      * requestMethod GET.
    */
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
      }, 100, function () {
        GetContent(term_id, column, per_page, sources);
      });
    });


    /**
      * actions get Get icons
      * @params term_id - column - Per_page - Sources.
      * @result get items (view - content).
      * requestMethod GET.
    */
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
      }, 100, function () {
          GetIcons(post_id, column, per_page, sources, term, name);
      });
    });



    /**
      * actions get Get Insert Popup
      * @params post_id
      * @result get item (title - content - keywords).
      * requestMethod GET.
    */
    $("body").on("click", ".overlay", function () {
      var post_id = $(this).attr("data-id");
      GetInsert(post_id);
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
          $(".Notification").hide();
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

            var item_term = "<li class='item'><a href='#' class='term-link " + active + "' data-sources='" + sources + "' data-id='" + id + "' data-column='" + column + "' data-number='" + number + "' data-name='" + name + "'>" +
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
            $(".Notification").hide();
            $('.search .term-link').remove();
            var data = response.data
            let container = $('#pagination');
            container.pagination({
              dataSource: data,
              pageSize: per_page,
              callback: function (data, pagination) {
                var dataHtml = '<ul class="column-' + column_nu + '">';
                $.each(data, function (index, item) {
                  dataHtml += '<li><a href="#" data-name="' + item.name + '" data-parent="' + item.parent_id + '" data-id="' + item.id + '" data-id="' + item.id + '" data-column="' + item.column + '" data-number="' + item.pre_page + '" class="GetItems ' + item.Category + '"><span><img title="' + item.name + '" alt="' + item.name + '" src="' + item.icon + '" /></span></a></li>';
                });
                dataHtml += '</ul>';
                $("#data-container").animate({
                  opacity: 1,
                  left: "0"
                }, 100, function () {
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
            $(".Notification").hide();
            
            var data = response.data
            let container = $('#pagination');
            container.pagination({
              dataSource: data,
              pageSize: per_page,
              callback: function (data, pagination) {

                var dataHtml = '<div class="Collocations">';
                $.each(data, function (index, item) {
                  dataHtml += '<ul class="column-icons">';
                  dataHtml += '<a class="GetIcons overlayIcon" href="#" data-name="' + item.Name + '" data-term="' + id + '" data-id="' + item.Id + '" data-column="' + column_nu + '" data-number="' + per_page + '" data-source="' + source + '"></a>';
                  dataHtml += '<li class="headline">' + item.Name + ' <a class="GetIcons" href="#" data-name="' + item.Name + '" data-term="' + id + '" data-id="' + item.Id + '" data-column="' + column_nu + '" data-number="' + per_page + '" data-source="' + source + '"><span>More ...</span></a></li>';
                  var i = 0;
                  $.each(item.Collocations, function (index, icon) {
                    i++;
                    if (i < 5 ){
                      dataHtml += '<li><a href="#" data-type="' + icon.file_icon.subtype + '" data-url="' + icon.file_icon.url + '" class="clickToInsert ' + item.Category + '"><span><img title="' + icon.file_icon.name + '" alt="' + icon.file_icon.name + '" src="' + icon.file_icon.url + '" /></span></a></li>';
                    }
                  });
                  dataHtml += '</ul>';
                });
                dataHtml += '</div>';
                
                $("#data-container").animate({
                  opacity: 1,
                  left: "0"
                }, 100, function () {
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
            $(".Notification").hide();

            var data = response.data
            let container = $('#pagination');
            container.pagination({
              dataSource: data,
              pageSize: per_page,
              callback: function (data, pagination) {
                var dataHtml = '<ul class="column-' + column_nu + ' term-' + parent_name + '">';

                $.each(data, function (index, item) {
                  dataHtml += '<li><span class="overlay item-' + parent_name + '" data-id="' + item.Id + '"><img alt="info item" title="'+item.Name+'" src="Images/info.png" /></span><a href="#"><span><img title="' + item.Name + '" alt="' + item.Name + '" src="' + item.PreviewImage + '" /></span></a></li>';
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
                }, 100, function () {
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



    function GetInsert(post_id) {
      var id = post_id;
      $.ajax({
        type: 'GET',
        url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GetIcons + id,
        contentType: requestContentType.JSON,
        dataType: '',
        beforeSend: function () {
          showSpinner();
        },
        success: function (response) {
          hideSpinner();
          $(".Notification").hide();
          $('#exampleModal').modal('show');

          var data  = response.data
          var title = data[0].Name;
          var link  = '<a href="#" data-type="' + data[0].Type + '" data-url="' + data[0].Content + '" class="clickToInsert"><img src="Images/chevron-white.png" alt="Use Item" title="' + title + '" /> Use this item</a>';
          var view = '<img src="' + data[0].PreviewImage + '" alt="'+title+'" title="'+title+'"/>';

          $("#exampleModal .modal-title").html(title);
          $("#exampleModal .modal-footer").html(link);
          $("#exampleModal .modal-body .view").html(view);

          var tags = data[0].Tags;
          var dataHtml = '<ul class="tags-list"> <h4>Keywords</h4>';
          $.each(tags, function (index, item) {
            dataHtml += '<li>'+item+'</li>';
          });
          dataHtml += '</ul>';

          $("#exampleModal .modal-body .tags").html(dataHtml);
          
        },
        error: function () {
          hideSpinner();
          showNotification("error", "Loding Filed 404");
        }
      });
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
          $(".Notification").hide();

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
              }, 100, function () {
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
          $(".Notification").hide();

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
              $(".Notification").hide();

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
              $(".Notification").hide();

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
            }
          });

        } else if (type == 'svg' || type == 'svg+xml') {
          coercionTypeOfItem = Office.CoercionType.XmlSvg;
          $.ajax({
            type: requestMethod.GET,
            url: src,
            success: function (data) {
              $(".Notification").hide();
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
            }
          });
        }
      });
    });
  };
})();

