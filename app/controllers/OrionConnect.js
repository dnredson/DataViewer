const fetch = require("node-fetch");
const getEntityById = async url => {
  const response = await fetch(url, {
    method: "GET",
    headers: { "fiware-service": "openiot", "fiware-servicepath": "/" }
  });
  const json = await response.json();
  return json;
};

module.exports.getEntity = function(application, req, res, pilots) {
  if (pilots == "guaspari") {
    url = "http://177.104.61.48:2019/v0/SoilProbe";
  }
  if (pilots == "matopiba") {
    url = "http://177.104.61.52:2019/v0/SoilProbe";
  }
  Promise.all([getEntityById(url)])
    .then(function(result1) {
      //  console.log(result1[0][0].entityId);

      if (pilots == "guaspari") {
        res.render("pilots-about", { entity: result1 });
      }
      if (pilots == "matopiba") {
        res.render("pilots-about-matopiba", { entity: result1 });
      }
      //res.render("pilots-about", { entity: result1 });
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports.probes = function(application, req, res, pilots) {
  res.render("pilots-probes");
};

module.exports.pilotsec = function(application, req, res) {
  res.render("pilots-ec");
};

module.exports.probesMatopiba = function(application, req, res, pilots) {
  res.render("pilots-probes-matopiba");
};

module.exports.pilotsecm = function(application, req, res) {
  res.render("pilots-ec-matopiba");
};

module.exports.probesCartagena = function(application, req, res, pilots) {
  res.render("pilots-probes-cartagena");
};

module.exports.pilotsAboutCartagena = function(application, req, res) {
  res.render("pilots-about-cartagena");
};
