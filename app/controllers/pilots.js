module.exports.about = function(application, req, res) {
  var http = require("http");

  var opcoes = {
    hostname: "177.104.61.17",
    port: 1026,
    path: "/v2/entities/urn:ngsi-ld:Farm:001",
    json: true,
    headers: {
      Accept: "application/json",
      "fiware-service": "openiot",
      "fiware-service-path": "/"
    }
  };

  var response = [];
  var jsonResponse = {};

  var req = http.request(opcoes, function(res) {
    res.on("data", function(pedaco) {
      response.push(pedaco);
    });
    res.on("end", function(res) {
      jsonResponse = JSON.parse(response);
    });
  });

  req.end();
  res.render("pilots-about", { info: { jsonResponse } });
};
