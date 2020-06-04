module.exports = function (application) {
  application.get("/sad", function (req, res) {
    application.app.controllers.tools.sad(application, req, res);
  });
};
