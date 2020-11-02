// myAzure : https://ppgraphicsinjectorweb20190430052958.azurewebsites.net/
// premast Azure: https://premast.azurewebsites.net/
// localhost: https://localhost:44319/
// premast base AWS url:  "https://premast.com/wp-json/wp/api/"

var ppGraphicsInjectorConfigurationData = {
  "pageSize": 4,
  "env": "api",
  "googleClientID": "",
  "msClientID": "",
  "baseUrl": "https://plus.test/wp-json/wp/api/",
  "logInUrl": "users/login/",
  "GetCategory": "graphics/GetCategory",
  "GetContent": "graphics/GetGraphics/?category=",
  "GetIcons": "graphics/GetGraphics/?post_id=",
  "GetSubCategory": "graphics/GetSubCategory/?parent_id=",
  "GetSearch": "graphics/GetGraphics/?searchText=",
  "GeneralSettings": "GeneralSettings",
  "UserRegister": "users/register/?email=",
  "Password": "&password=",
  "Per_page": "&per_page=-1",
  "WithCategory": "&category=",
  "useStaticData": false,
  "usePaging": false
};



var LogItems = {
  "baseUrl": "https://plus.premast.com/wp-json/wp/api/",
  "LogDownload": "log/download/",
  "LogSearch": "log/search/",
};


var KitBrand = {
  "baseUrl" : "https://premastplus.bubbleapps.io/",
  "version" : "version-test/api/1.1/wf/brands?email="
}
