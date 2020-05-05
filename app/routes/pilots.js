module.exports = function(application) {
  application.get("/pilots-about", function(req, res) {
    pilot = "guaspari";
    application.app.controllers.OrionConnect.getEntity(
      application,
      req,
      res,
      pilot
    );
  });
  application.get("/pilots-about-matopiba", function(req, res) {
    pilot = "matopiba";
    application.app.controllers.OrionConnect.getEntity(
      application,
      req,
      res,
      pilot
    );
  });
  application.get("/pilots-probes-matopiba", function(req, res) {
    pilot = "matopiba";
    application.app.controllers.OrionConnect.probesMatopiba(
      application,
      req,
      res,
      pilot
    );
  });
  application.get("/pilots-ec-matopiba", function(req, res) {
    pilot = "matopiba";
    application.app.controllers.OrionConnect.pilotsecm(
      application,
      req,
      res,
      pilot
    );
  });
  application.get("/pilots-probes", function(req, res) {
    pilot = "guaspari";
    application.app.controllers.OrionConnect.probes(
      application,
      req,
      res,
      pilot
    );
  });
  application.get("/pilots-ec", function(req, res) {
    pilot = "guaspari";
    application.app.controllers.OrionConnect.pilotsec(
      application,
      req,
      res,
      pilot
    );
  });
  application.get("/pilots-probes-cartagena", function(req, res) {
    pilot = "guaspari";
    application.app.controllers.OrionConnect.probesCartagena(
      application,
      req,
      res,
      pilot
    );
  });
  application.get("/pilots-about-cartagena", function(req, res) {
    pilot = "cartagena";
    application.app.controllers.OrionConnect.pilotsAboutCartagena(
      application,
      req,
      res,
      pilot
    );
  });
};
