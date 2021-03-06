var messageBanner;
var isUserLoggedIn = false;
var xhrRequest;

var isPremium = false;



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
        var UserKeep = {
          'email': email,
          'password': encodedString,
          'expires': expires
        };
        localStorage.setItem('UserKeep', JSON.stringify(UserKeep));
      }

      localStorage.setItem('KitEmail', email);
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
     * check mode theme.
     * @params mode localStorage.
     */
    var Mode = localStorage.getItem("ThemeMode");
    if (Mode == 'dark') {
      $("body").addClass("dark-mode");
      $('#Switch').text('Switch to light mode');
    } else {
      $('#Switch').text('Switch to dark mode');
    }

    
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
      localStorage.setItem('KitEmail', Getemail);

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
        TheFeaturesUserPremium(response.data.IsPremium);
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
     **/
    $('#ButtonLogin').click(function () {
      var email = GetLoginEmail();
      localStorage.setItem('KitEmail', email);

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
        TheFeaturesUserPremium(response.data.IsPremium);
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
     **/
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
          var column = data[i].column;
          var number = data[i].pre_page;
          var sources = data[i].sources;
          if (i == 0) {
            GetContent(data[i].id, column, number, sources);
          }
        }
      },
      error: function () {
        hideSpinner();
        showNotification("error", "Loding Filed 404");
      }
    });

    /**
     * Sign Up From.
     * @params Password - email.
     * @result user id (success -  error).
     * requestMethod POST.
     **/
    $('#ButtonSingUp').click(function () {
      var email = $('#InputEmailSingUp').val();
      var password = $('#InputPasswordSingUpConf').val();
      $.ajax({
        type: 'POST',
        url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.UserRegister + email + ppGraphicsInjectorConfigurationData.Password + password,
        contentType: requestContentType.JSON,
        dataType: '',
        beforeSend: function () {
          showSpinner();
        },
        success: function (response) {
          var data = response.data
          hideSpinner();
          $(".Notification").hide();

          if (data.signup === true) {
            $('#ThankYou').show();
            $('#signUp').hide();
          } else {
            showNotification("info", data.message);
          }
        },
        error: function () {
          hideSpinner();
          showNotification("error", "Sign Up 404");
        }
      });
    });

    /**
     * Get General Settings.
     * @result (Logo - version - links - scripts).
     * requestMethod GET
     **/
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

        var Local_version = localStorage.getItem("version");

        if (Local_version != version) {
          localStorage.setItem('version', version);
          $.ajax({
            url: "",
            context: document.body,
            success: function (s, x) {

              $('html[manifest=saveappoffline.appcache]').attr('content', '');
              $(this).html(s);
            }
          });
        }


        var len = links.length;
        for (var i = 0; i < len; i++) {
          var dropdown = "<a class='dropdown-item' target='_blank' href='" + links[i].link + "'>" + links[i].text + "</a>";
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
     **/
    $("body").on("click", ".term-link", function () {

      $("#myTabContent").animate({
        opacity: 1,
      }, 100, function () {
        $('#myTabContent').show();
        $('#BrandPremium').hide();        
        $('#BrandFolder').hide();
        $(".search").show();
      });

      var term_id = $(this).attr("data-id");
      var column = $(this).attr("data-column");
      var per_page = $(this).attr("data-number");
      var sources = $(this).attr("data-sources");
      var parent = $(this).attr("data-parent");
      var name = $(this).attr("data-name");

      $('#view').hide();
      $(".dropdown-menu").removeClass("acive");
      $('.term-link').removeClass('active');

      $(this).addClass('active');
      $('#TextSearch').val("");
      $("#data-container").animate({
        opacity: 0,
        left: "-100%",
      }, 100, function () {
        if (name === 'background' || name === 'Images' || name === 'images') {
          GetUnImages();
        } else {
          GetContent(term_id, column, per_page, sources, parent, name);
        }

      });
    });

    /**
     * actions get main items for child
     * @params term_id - column - Per_page - Sources.
     * @result get items (view - content).
     * requestMethod GET.
     **/
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
     **/
    $("body").on("click", ".back-link", function () {
      var term_id = $(this).attr("data-id");
      var column = $(this).attr("data-column");
      var per_page = $(this).attr("data-number");
      var sources = $(this).attr("data-sources");
      $('#TextSearch').val("");
      $('#view').hide();

      $(this).remove();

      $('div#data-container').removeClass("list-item");
      $('#view #grid').addClass('active');
      $('#view #list').removeClass('active');

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
     * function get Get Insert Popup
     * @params post_id
     * @result get item (title - content - keywords).
     * requestMethod GET.
     */
    $("body").on("click", ".overlay", function () {
      var post_id = $(this).attr("data-id");
      var sources = $(this).attr("data-sources");
      var name = $(this).attr("data-name");
      var url = $(this).attr("data-url");
      var thumb = $(this).attr("data-thumb");
      var links = $(this).attr("data-links");
      var term = $(this).attr("data-term");
      if (sources === 'unsplash') {
        GetInsertUnsplash(post_id, name, url, thumb, links);
      } else {
        GetInsert(post_id, term);
      }
    });

    /**
     * function Search actions for items bsaed click or keyup or entr
     * @params post_id
     * @result get item (title - content - keywords).
     * requestMethod GET.
     */
    $("body").on("click", "#submitSearch", function () {
      var search_text = $('#TextSearch').val();
      var term_id = $('.item a.active').data('id');
      var column = $('.item a.active').data('column');
      if (search_text === '') {
        return false;
      }
      GetSearchContent(search_text, term_id, column);
    });

    $('#TextSearch').bind("enterKey", function (e) {
      var search_text = $('#TextSearch').val();
      var term_id = $('.item a.active').data('id');
      var column = $('.item a.active').data('column');
      if (search_text === '') {
        return false;
      }
      GetSearchContent(search_text, term_id, column);
    });

    $('#TextSearch').keyup(function (e) {
      if (e.keyCode == 13) {
        $(this).trigger("enterKey");
      }
    });

    // var typingTimer;
    // var doneTypingInterval = 1200;
    // var searchBoxControl = $('#TextSearch');
    // $(searchBoxControl).on("keyup", function () {
    //   var search_text = $('#TextSearch').val();
    //   var term_id = $('.item a.active').data('id');
    //   var column = $('.item a.active').data('column');
    //   clearTimeout(typingTimer);
    //   typingTimer = setTimeout(function () {
    //     GetSearchContent(search_text, term_id, column)
    //   }, doneTypingInterval);
    // });

    /**
     * function Get NavBar.
     * @params getCategory
     * @result getTerms (title - id - column - number - sources).
     * requestMethod GET.
     */

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
            if (i == 0) {
              active = "active";
            }
            var name = data[i].name;
            var id = data[i].id;
            var column = data[i].column;
            var number = data[i].pre_page;
            var sources = data[i].sources;

            if (column === null || column === undefined) {
              column = 2;
            }

            var item_term = "<li class='item'><a href='#' class='term-link " + active + "' data-sources='" + sources + "' data-id='" + id + "' data-column='" + column + "' data-number='" + number + "' data-name='" + name + "'>" +
              "<span class='icon icon-" + name + "'></span>" +
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

    /**
     * function GetContent Items based term_id.
     * @params getCategory
     * @result getTerms (title - id - column - number - sources).
     * requestMethod GET.
     */
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
            $("#pagination").html("");

            hideSpinner();
            $(".Notification").hide();
            $('.search .term-link').remove();
            var data = response.data
            let container = $('#pagination');
            container.pagination({
              dataSource: data,
              pageSize: per_page,
              callback: function (data, pagination) {
                var dataHtml = '<ul class="column-' + column_nu + ' cloumn-custom-card">';
                $.each(data, function (index, item) {
                  dataHtml += '<li><a href="javascript:void(0);" data-name="' + item.name + '" data-parent="' + item.parent_id + '" data-id="' + item.id + '" data-id="' + item.id + '" data-column="' + item.column + '" data-number="' + item.pre_page + '" class="GetItems ' + item.Category + '"><span><img title="' + item.name + '" alt="' + item.name + '" src="' + item.icon + '" /></span></a></li>';
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
            $("#pagination").html("");
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
                  dataHtml += '<a class="GetIcons overlayIcon" href="javascript:void(0);" data-name="' + item.Name + '" data-term="' + id + '" data-id="' + item.Id + '" data-column="' + column_nu + '" data-number="' + per_page + '" data-source="' + source + '"></a>';
                  dataHtml += '<li class="headline">' + item.Name + ' <a class="GetIcons" href="javascript:void(0);" data-name="' + item.Name + '" data-term="' + id + '" data-id="' + item.Id + '" data-column="' + column_nu + '" data-number="' + per_page + '" data-source="' + source + '"><span>More</span></a></li>';
                  var i = 0;
                  $.each(item.Collocations, function (index, icon) {
                    i++;
                    if (i < 5) {
                      dataHtml += '<li><a href="javascript:void(0);" data-title="' + icon.file_icon.name + '" data-id="'+item.Id+'" data-type="' + icon.file_icon.subtype + '" data-url="' + icon.file_icon.url + '" class="clickToInsert ' + item.Category + '"><span><img title="' + icon.file_icon.name + '" alt="' + icon.file_icon.name + '" src="' + icon.file_icon.url + '" /></span></a></li>';
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
            $("#pagination").html("");
            hideSpinner();
            $(".Notification").hide();

            GetAds('#banner-1', 1);

            var data = response.data

            var currPage = 0;

            if (parent_id == 3 || parent_id == 4) {
              $("#view").show("slow");
            } else {
              $("#view").hide("slow");
              $('div#data-container').removeClass("list-item");
              $('#view #grid').addClass('active');
              $('#view #list').removeClass('active');
            }


            let container = $('#pagination');
            container.pagination({
              dataSource: data,
              pageSize: per_page,

              callback: function (data, pagination) {

                ++currPage;

                var dataHtml = '<ul class="column-' + column_nu + ' term-' + parent_name + '">';

                $.each(data, function (index, item) {
                  dataHtml += '<li><span class="overlay" data-title="' + item.Name + '" item-' + parent_name + '" data-term="' + item.Category + '" data-id="' + item.Id + '"><img alt="info item" title="' + item.Name + '"src="Images/info.png" /></span><a href="javascript:void(0);" data-title="'+item.Name+'" data-id="'+item.Id+'"  data-type="' + item.Type + '" data-url="' + item.Content + '" class="clickToInsert"><span><img title="' + item.Name + '" alt="' + item.Name + '" src="' + item.PreviewImage + '" /></span></a></li>';
                });

                dataHtml += '<div id="banner-' + currPage + '"></div>';
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
                        databack += "<a href='#' class='back-link' data-sources='" + item.sources + "' data-id='" + item.id + "' data-column='" + item.column + "' data-number='" + item.pre_page + "'><i class='fa fa-times-circle' aria-hidden='true'></i></a>";
                      });
                      $('.search .input-group').append(databack);
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
              },

              afterNextOnClick: function () {
                GetAds('#banner-' + currPage, currPage);
              },

            })



          },
          error: function () {
            hideSpinner();
            showNotification("error", "Loding Filed 404");
          }
        });

      }
    }


    /**
     * function For Ads.
     * @params ads id - ads number
     * @result getTerms (ads in templates).
     * requestMethod GET.
     */

    function GetAds(id, number) {
      var ads_id = number;
      var ads_nu = number - 1;

      $.ajax({
        type: 'GET',
        url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GeneralSettings,
        contentType: requestContentType.JSON,
        dataType: '',
        beforeSend: function () { },
        success: function (response) {
          var data = response.data
          var loop = data.advertisement[ads_nu];

          var ads = "<a class='advertisement-item' target='_blank' href='" + loop.advertisement_link + "'><img src='" + loop.advertisement_image + "' title='advertisement' alt='advertisement'/></a>";

          $("#banner-" + ads_id).html(ads);

        },
        error: function () {
          showNotification("error", "404");
        }
      });
    }

    /**
     * function Get unsplash images.
     * @params url unsplash api.
     * @result items images - user.
     * requestMethod GET.
    */
    function GetUnImages(search_text) {

      if (search_text) {
        var url = 'https://api.unsplash.com/search/photos/';
      } else {
        var url = 'https://api.unsplash.com/photos';
      }

      $("#data-container").html("");
      $("#pagination").html("");
      $(".Notification").hide();

      var client_id = 'SqQU7CUehQAQhsHKri59zF2pXZ8xMtVUZwp8ZQIj0MY';
      var limit = 20;

      function unsplash(more) {
        $.ajax({
          url: url,
          type: 'GET',
          dataType: 'json',
          data: {
            client_id: client_id,
            page: more,
            per_page: limit,
            query: search_text
          },
          success: function (data) {

            if (search_text) {
              var items = data.results;
            } else {
              var items = data;
            }

            if (items != '') {
              var dataHtml = '<ul class="column-2">';
              $.each(items, function (i, item) {
                dataHtml += '<li><span class="overlay" data-sources="unsplash" data-links="' + item.user.links.html + '" data-name="' + item.user.name + '" data-thumb="' + item.urls.regular + '" data-url="' + item.urls.full + '" data-id="' + item.id + '"><img alt="info item" title="' + item.alt_description + '" src="Images/info.png" /></span><a href="javascript:void(0);" data-title="'+item.id+'" data-id="unsplash" data-type="jpg" data-url="' + item.urls.full + '" class="clickToInsert"><span><img title="' + item.alt_description + '" alt="' + item.alt_description + '" src="' + item.urls.small + '" /></span></a></li>';
              });
              dataHtml += '</ul>';
              $("#data-container").animate({
                opacity: 1,
                left: "0"
              }, 100, function () {
                $("#data-container").append(dataHtml).show("slow");
              });

              var paginationjs = '<div class="paginationjs"><div class="paginationjs-pages"><li class="paginationjs-page paginationjs-next"><a href="' + more + '" class="more"></a></li></div></div>'
              $("#pagination").html(paginationjs);
            } else {
              showNotification("Nothing found for that search.", "How about checking this collections");
            }

          }
        });
      }


      /**
        * function pagination unsplash.
        * @params page number.
      */
      $("body").on("click", ".more", function () {
        var page = $("#pagination .more").attr('href');
        page++;
        unsplash(page);
        return false;
      });
      $("#pagination .more").change(unsplash(1));

    }


    /**
      * function Insert images unsplash.
      * @params name url thumbnail links users.
    */
    function GetInsertUnsplash(post_id, name, url, thumb, links) {
      var item_name = name;
      var item_url = url;
      var item_thum = thumb;
      var item_links = links;

      $('#UnsplashModal').modal('show');

      var popup_name = '<img src="Images/unsplash.png" alt="Unsplash" title="Unsplash" /> Photo by Unsplash | <a target="_blank" href="' + item_links + '">' + item_name + '</a>';
      var link = '<a href="javascript:void(0);" data-title="'+item_name+'" data-id="Unsplash" data-type="jpg" data-url="' + item_url + '" class="clickToInsert"><i class="fa fa-chevron-left" aria-hidden="true"></i> Use this photo</a>';
      var view = '<img src="' + item_thum + '" alt="' + item_name + '" title="' + item_name + '"/>';

      $("#UnsplashModal .modal-title").html(popup_name);
      $("#UnsplashModal .modal-footer").html(link);
      $("#UnsplashModal .modal-body .view").html(view);

    }


    /**
      * function Insert all.
      * @params name url thumbnail links users.
    */
    function GetInsert(post_id, term) {
      var id = post_id;
      var name = term;
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

          var data = response.data

          console.log(data);

          var AuthorLink = data[0].AuthorLink;
          var AuthorName = data[0].AuthorName;

          var title = data[0].Name;
          var link = '<a href="javascript:void(0);" data-title="' + data[0].Name + '"  data-type="' + data[0].Type + '" data-url="' + data[0].Content + '" class="clickToInsert"><i class="fa fa-chevron-left" aria-hidden="true"></i> Use this item</a>';
          var view = '<img src="' + data[0].PreviewImage + '" alt="' + title + '" title="' + title + '"/>';

          if (name === 'templates') {
            name = "template";
          } else if (name === 'graphics') {
            name = "graphic";
          }

          if (AuthorName) {
            var author = '<img src="img"> <a target="_blank" href="' + AuthorLink + '">' + AuthorName + '</a>';
          } else {
            $("#exampleModal .modal-body .author").html(name + " by <a target='_blank' href='http://plus.premast.com/'>premast</a>");
          }

          $("#exampleModal .modal-title").html(title);
          $("#exampleModal .modal-footer").html(link);
          $("#exampleModal .modal-body .author").html(author);
          $("#exampleModal .modal-body .view").html(view);

          var tags = data[0].Tags;
          var dataHtml = '<ul class="tags-list"> <h4>Keywords</h4>';
          $.each(tags, function (index, item) {
            dataHtml += '<li>' + item + '</li>';
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


    /**
      * function loop icons Collocations.
      * @params post_id, column, number, sources, term, name.
      * @result min Collocations icons.
    */
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
          $("#pagination").html("");
          hideSpinner();
          $(".Notification").hide();

          var data = response.data
          let container = $('#pagination');
          container.pagination({
            dataSource: data,
            pageSize: per_page,
            callback: function (data, pagination) {

              $.ajax({
                type: 'GET',
                url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GetContent + parent_id + ppGraphicsInjectorConfigurationData.Per_page,
                contentType: requestContentType.JSON,
                dataType: '',
                beforeSend: function () {
                  showSpinner();
                },
                success: function (response) {
                  hideSpinner();
                  var data = response.data;
                  var dataHtml = '<div class="dropdown"> <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> ' + parent_name + ' </a>';
                    dataHtml += '<div class="dropdown-menu" id="dropdown-list" aria-labelledby="dropdownMenuLink">';
                    dataHtml += '<li class="list-all"><i class="fa fa-th" aria-hidden="true"></i> View All Icons</li><ul class="mian-list">';
                    $.each(data, function (index, item) {
                      if (item.PreviewImage) {
                        dataHtml += '<a class="dropdown-item GetIcons" class="GetIcons" href="javascript:void(0);" data-name="' + item.Name + '" data-term="' + parent_id + '" data-id="' + item.Id + '" data-column="' + column_nu + '" data-number="' + per_page + '" data-source="collection"><img src="' + item.PreviewImage + '" /> ' + item.Name + ' </a>';
                      } else {parent_id
                        dataHtml += '<a class="dropdown-item GetIcons" class="GetIcons" href="javascript:void(0);" data-name="' + item.Name + '" data-term="' + parent_id + '" data-id="' + item.Id + '" data-column="' + column_nu + '" data-number="' + per_page + '" data-source="collection">' + item.Name + ' </a>';
                      }
                    });
                    dataHtml += '</ul></div></div>';
                  $("#list-icons").append(dataHtml).show("slow");
                },
                error: function () {
                  hideSpinner();
                }
              });

              var icons = data[0].Collocations;

              var dataHtml = '<div id="list-icons"></div>';
              dataHtml += '<ul class="column-' + column_nu + '">';
              $.each(icons, function (index, item) {
                dataHtml += '<li><a href="javascript:void(0);" data-title="' + item.file_icon.name + '" data-id="'+data[0].Id+'" data-type="' + item.file_icon.subtype + '" data-url="' + item.file_icon.url + '" class="clickToInsert"><span><img title="' + item.file_icon.name + '" alt="' + item.file_icon.name + '" src="' + item.file_icon.url + '" /></span></a></li>';
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
                      databack += "<a href='#' class='back-link' data-sources='" + item.sources + "' data-id='" + item.id + "' data-column='" + item.column + "' data-number='" + item.pre_page + "'><i class='fa fa-times-circle' aria-hidden='true'></i></a>";
                    });
                    $('.search .input-group').append(databack);
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


    /**
      * function get content for search.
      * @params search_text, term_id, column.
      * @result loop for search.
    */
    function GetSearchContent(search_text, term_id, column) {
      var search_text = search_text;
      var term_id = term_id;
      var column_nu = column;


      if(term_id == 4) {
        var sources = "children";
      } else if (term_id == 10) {
        var sources = "default";
      } else if (term_id == 25) {
        var sources = "collection"
      } else {
        var sources = "default";
      }

      var databack = "<a href='#' class='back-link' data-sources='" + sources + "' data-id='" + term_id + "' data-column='" + column_nu + "'><i class='fa fa-times-circle' aria-hidden='true'></i></a>";
      $('.search .input-group').append(databack);


      if (term_id === 23 || term_id === 25) {
        $.ajax({
          type: 'GET',
          url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GetSearch + search_text + ppGraphicsInjectorConfigurationData.WithCategory + term_id + ppGraphicsInjectorConfigurationData.Per_page,
          contentType: requestContentType.JSON,
          dataType: '',
          beforeSend: function () {
            showSpinner();
            $("#data-container").html("");
          },
          success: function (response) {
            hideSpinner();
            $("#data-container").html("");
            $(".Notification").hide();
            $("#pagination").html("");


            if (response.status === false) {
              results = "no. of results";
              showNotification("Nothing found for that search.", "How about checking this collections", "is-search");
            } else {
              results = "yes. of results";
            }

            var results = "";
            var data = response.data
            if (data) {
              var dataHtml = '<ul class="column-' + column_nu + ' blockSearch">';
              $.each(data, function (index, item) {
                dataHtml += '<li><a href="javascript:void(0);" data-title="'+item.Name+'" data-id="'+item.Id+'" data-type="svg" data-url="' + item.links + '" class="clickToInsert"><span><img src="' + item.links + '" /></span></a></li>';
              });
              dataHtml += '</ul>';
              $("#data-container").append(dataHtml);
            } else {
              showNotification("Nothing found for that search.", "How about checking this collections");
            }

            $.ajax({
              type: requestMethod.POST,
              url: LogItems.baseUrl + LogItems.LogSearch,
              dataType: 'json',
              data: {
                keyword: search_text,
                term_id: term_id,
                user: GetKeep.email,
                results: results,
              },
              beforeSend: function () {

              },
              success: function (response) {
                console.log(response);
              },
              error: function (response) {
                console.log(response);
              }
            });


          },
          error: function () {
            hideSpinner();
            showNotification("error", "Loding Filed 404");
          }
        });
      } else if (term_id === 42 || term_id === 15) {
        GetUnImages(search_text);

        $.ajax({
          type: requestMethod.POST,
          url: LogItems.baseUrl + LogItems.LogSearch,
          dataType: 'json',
          data: {
            keyword: search_text,
            term_id: term_id,
            user: GetKeep.email,
            results:"unsplash",
          },
          beforeSend: function () {

          },
          success: function (response) {
            console.log(response);
          },
          error: function (response) {
            console.log(response);
          }
        });

      } else {
        $.ajax({
          type: 'GET',
          url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GetSearch + search_text + ppGraphicsInjectorConfigurationData.WithCategory + term_id + ppGraphicsInjectorConfigurationData.Per_page,
          contentType: requestContentType.JSON,
          dataType: '',
          beforeSend: function () {
            showSpinner();
            $("#data-container").html("");
          },
          success: function (response) {
            hideSpinner();
            $("#data-container").html("");
            $(".Notification").hide();

            var results = "";

            if (response.status === true) {
              results = "no. of results";
              showNotification("Nothing found for that search.", "How about checking this collections", "is-search");
            } else {
              results = "yes. of results";
            }

            var data = response.data
            if (data) {
              let container = $('#pagination');
              container.pagination({
                dataSource: data,
                callback: function (data, pagination) {
                  var dataHtml = '<ul class="column-' + column_nu + '">';
                  $.each(data, function (index, item) {
                    dataHtml += '<li><a href="javascript:void(0);" data-title="'+item.Name+'" data-id="'+item.Id+'" data-type="' + item.Type + '" data-url="' + item.Content + '" class="clickToInsert"><span><img title="' + item.Name + '" alt="' + item.Name + '" src="' + item.PreviewImage + '" /></span></a></li>';
                  });
                  dataHtml += '</ul>';
                  $("#data-container").append(dataHtml);
                }
              })
            } else {
              results = "no. of results";
              showNotification("Nothing found for that search.", "How about checking this collections");
            }

            $.ajax({
              type: requestMethod.POST,
              url: LogItems.baseUrl + LogItems.LogSearch,
              dataType: 'json',
              data: {
                keyword: search_text,
                term_id: term_id,
                user: GetKeep.email,
                results: results,
              },
              beforeSend: function () {

              },
              success: function (response) {
                console.log(response);
              },
              error: function (response) {
                console.log(response);
              }
            });

          },
          error: function () {
            hideSpinner();
            showNotification("error", "Loding Filed 404");
          }
        });
      }
    }



    /**
      * function CallWS.
      * @params type, url, contentType, dataType, data, successCallBack, errorCallback, failureCallback, params.
      * @result successCallBack or failureCallback or errorCallback.
    */
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



    function sendLogAjax(URL_address, ID, title, user){
      $.ajax({
        type: requestMethod.POST,
        url: URL_address,
        dataType: 'json',
        data: {
          item_id: ID,
          item_title: title,
          user: user,
        },
        beforeSend: function () {

        },
        success: function (response) {
          console.log('done');
        },
        error: function (response) {
        }
      });
    };

    /**
     * function add log download file.
     */
    $("body").on("click", ".clickToInsert", function () {
      var ID = $(this).attr("data-id");
      var title = $(this).attr("data-title");
      if (GetKeep) {
        var user = GetKeep.email;
      } else {
        var user = GetLoginEmail();
      }
      
      var urlLogDownload = LogItems.baseUrl + LogItems.LogDownload;

      sendLogAjax(urlLogDownload, ID, title, user);

      $.ajax({
        type: 'GET',
        url: ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.GeneralSettings,
        contentType: requestContentType.JSON,
        dataType: '',
        beforeSend: function () {
        },
        success: function (response) {
          var data = response.data
          sendLogAjax(data.notification, ID, title, user);
        },
        error: function () {
        }
      });
    });



    /**
      * function TheFeaturesUserPremium.
      * @params isPremium true - false
      * @result run functions user Premium
    */

    $("body").on("click", "#myBrand", function () {

      $(".dropdown-menu").removeClass("acive");
      $('.term-link').removeClass('active');


      $("#myTabContent").animate({
        opacity: 0,
        left: "-100%",
      }, 100, function () {
        $("#myTabContent").css({
          display: "none",
        });
        $(".search").css({
          display: "none",
        });
        $('#BrandPremium').css({
          opacity: 1,
          left: "0",
          display: "block",
        });
      });
      
    });



    /**
    * function add log download file.
    */
    $("body").on("click", ".kit-overlay", function () {

      var email = localStorage.getItem("KitEmail");
      
      var Brand_ID = $(this).attr("data-id");
      var Brand_Name = $(this).attr("data-name");

      showSpinner();

      var name   = email.substring(0, email.lastIndexOf("@"));

      $('#ShareName').html(Brand_Name);
      $('#LogoList').html('');
      $('#ColorsList').html('');
      $('#TypographyList').html('');
      $('#ImagesList').html('');
      

      $("#BrandPremium").animate({
        opacity: 0,
        left: "-100%",
      }, 100, function () {
        $("#BrandPremium").css({
          display: "none",
        });
        $('#BrandFolder').css({
          opacity: 1,
          left: "0",
          display: "block",
        });
      });
      


      $.ajax({
        type: 'POST',
        url: KitBrand.baseUrl + KitBrand.version + email,
        contentType: requestContentType.JSON,
        dataType: '',
        beforeSend: function () {
          showSpinner();
        },

        success: function (response) {
          hideSpinner();
          var data = response.response;
          $.each(data, function (index, items) {
            $.each(items, function (index, item) {
              if(item._id === Brand_ID) {

                var data_logo = item.Logo;
                if(data_logo) {
                  let LogoPagination = $('#LogoPagination');
                  LogoPagination.pagination({
                    dataSource: data_logo,
                    pageSize: 4,
                    callback: function (data_logo, pagination) {
                      var logos = '<ul class="logos-list">';
                      $.each(data_logo, function (index, logo) {
                        var Type = logo.split('.').pop();
                        logos  += '<li>';
                        logos  += '<a href="javascript:void(0);"  data-type="' + Type + '" data-url="' + logo + '" class="clickToInsert"><img src="'+logo+'" alt="logo"/></a>';
                        logos  += '</li>';
                      });
  
                      logos  += '</ul>';
                      $("#LogoList").append(logos);
                    }
                  });
                } else {
                  $("#collapseLogo").hide();
                }

                // List Colors
                var data_color = item.Colors;
                if(data_color) {
                  var Colors = '<ul class="colors-list">';
                  $.each(data_color, function (index, color) {

                    var regexp = /#(\S)/g;
                    var post = color.replace(regexp, '$1');
                    var id = color.replace(color, "'"+color+"'");
                    var copy = 'onclick="copyToClipboard('+id+')"';

                    Colors  += '<li class="colorPicker" id="li_'+post+'"> <span class="ColorView" style="background:'+color+'"></span>';
                    Colors  += '<a href="javascript:void(0);" class="ColorType toRgb" data-event="hex" data-color="'+color+'">hex <i class="fa fa-retweet" aria-hidden="true"></i></a>';
                    Colors  += '<a href="javascript:void(0);" class="ColorType toHex" style="display:none;" data-event="rbg" data-color="'+color+'">rgb <i class="fa fa-retweet" aria-hidden="true"></i></a>';
                    Colors  += '<span class="ColorCode" id="'+post+'" data-toggle="tooltip" data-placement="top" title="copied">'+color+'</span>';
                    Colors  += '<button class="ColorCopy" '+copy+'>copy</button>';
                    Colors  += '</li>';

                  });
                  Colors  += '</ul>';
                  $("#ColorsList").append(Colors);
                } else {
                  $("#collapseColor").hide();
                }

                // List Fonts
                var data_fonts = item.fonts;
                if(data_fonts) {
                  var fonts = '<ul class="fonts-list">';
                  $.each(data_fonts, function (index, font) {
                    var name = font.split('/').pop();
                    fonts  += '<a href="'+font+'" class="font" download><span><img src="Images/file.svg" class="file"></span>'+name+'</a>';
                  });
                  fonts  += '</ul>';
                  $("#TypographyList").append(fonts);
                } else {
                  $("#collapseTypography").hide();
                }

                // List Image
                var data_images = item.Images;
                if(data_images) {
                  var Images = '<ul class="imgs-list">';
                  $.each(data_images, function (index, img) {
                    var Type = img.split('.').pop();

                    if (Type === 'jpg' || Type === 'png' || Type === 'svg' ) {
                      var _Type = Type ;
                    } else {
                      var _Type =  'jpg';
                    }

                    Images  += '<a href="javascript:void(0);"  data-type="' + _Type + '" data-url="'+img+'" class="clickToInsert"><span><img src="'+img+'" alt="img"/></span></a>';
                  });
                  Images  += '</ul>';
                  $("#ImagesList").append(Images);
                } else {
                  $("#collapseImage").hide();
                }

              }
            });
          });
        },
        error: function () {
        }
      });


    });


    $("body").on("click", "#backListBrand", function () {
      $("#BrandFolder").animate({
        opacity: 0,
        left: "-100%",
      }, 100, function () {
        $("#BrandFolder").css({
          display: "none",
        });
        $('#BrandPremium').css({
          opacity: 1,
          left: "0",
          display: "block",
        });
      });
    });

    

    function TheFeaturesUserPremium(isPremium) {


      if (isPremium) {

        var email = localStorage.getItem("KitEmail");

        $.ajax({
          type: 'POST',
          url: KitBrand.baseUrl + KitBrand.version + email,
          contentType: requestContentType.JSON,
          dataType: '',
          beforeSend: function () {
            showSpinner();
          },

          success: function (response) {

            $("#ListKit").html("");

            $("#pagination").html("");
            hideSpinner();
            var data = response.response

            if(data) {
              let container = $('#KitPagination');
            
              container.pagination({
                dataSource: data.brands,
                pageSize: 10,
  
                callback: function (data, pagination) {
  
                var dataHtml = '<ul class="card-kit">';
                  $.each(data, function (index, item) {

                    var name   = email.substring(0, email.lastIndexOf("@"));

                    dataHtml  += '<li class="share-kit"><a class="MoreKit" href="#"><img src="Images/more.png" alt="more"></a>';
                    dataHtml  += '<span class="brendImg" style="background-image:url('+item.icon+')"></span>';
                    dataHtml  += '<h5>'+item.name+'</h5>';
                    dataHtml  += '<p>shared by <span>'+name+'</span></p>';
                    dataHtml  += '<a class="kit-overlay" data-name="'+item.name+'" data-id="'+item._id+'"></a>';
                    dataHtml  += '</li>';
                  });
                dataHtml  += '</ul>';
  
                $("#ListKit").append(dataHtml);
  
                }
              })
            } else {
              var dataHtml   = '<div class="empty-kit">';
                  dataHtml  += '<img src="Images/rafiki.svg" alt="more">';
                  dataHtml  += '<h2>Your brand kit is currently <br> empty..</h2>';
                  dataHtml  += '<a class="NewBrand" href="#" target="_blank">Create new brand</a>';
                  dataHtml  += '</div>';
              $("#ListKit").append(dataHtml);
              $("#ShareIt").hide();
            }
          },
          error: function () {
          }
        });
      } else {
        var dataHtml   = '<div class="empty-kit">';
            dataHtml  += '<img src="Images/rafiki.svg" alt="more">';
            dataHtml  += '<h2>Your brand kit is currently <br> empty..</h2>';
            dataHtml  += '<a class="NewBrand" href="#" target="_blank">Create new brand</a>';
            dataHtml  += '</div>';
        $("#ListKit").append(dataHtml);
        $("#ShareIt").hide();
      }
    }






  });


  /**
    * function initialize office.
    * @params reason.
    * @result Insrt Items in power points.
  */
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
                    copyBase64, {
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
            beforeSend: function( data ) {
              showSpinner();
            },
            success: function (data) {
              $(".Notification").hide();
              

              var reader = new FileReader();
              reader.readAsDataURL(data);
              reader.onloadend = function () {
                hideSpinner();
                var dataUrl = reader.result;
                if (dataUrl.indexOf("base64,") > 0) {
                  var startIndex = dataUrl.indexOf("base64,");
                  var copyBase64 = dataUrl.substr(startIndex + 7);
                  PowerPoint.InsertSlideFormatting(copyBase64);
                } else {
                  PowerPoint.InsertSlideFormatting(dataUrl);
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
              Office.context.document.setSelectedDataAsync(grContent, {
                coercionType: coercionTypeOfItem
              },
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

  // End JS
})();
