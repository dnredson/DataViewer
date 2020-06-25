module.exports = function (application) {
  application.get("/sad", function (req, res) {
    application.app.controllers.tools.sad(application, req, res);
  });
};
module.exports = function (application) {
  application.get("/news", function (req, res) {
    application.app.controllers.tools.letter(application, req, res);
  });
};
