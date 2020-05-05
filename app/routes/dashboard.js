module.exports = function (application) {
  application.get("/dash", function (req, res) {
    application.app.controllers.dashboard.dash(application, req, res);
  });
  application.get("/blank", function (req, res) {
    application.app.controllers.dashboard.blank(application, req, res);
  });
  application.get("/card", function (req, res) {
    application.app.controllers.dashboard.card(application, req, res);
  });
  application.get("/grapheditor", function (req, res) {
    application.app.controllers.dashboard.grapheditor(application, req, res);
  });
};
