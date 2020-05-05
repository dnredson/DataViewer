module.exports.dash = function (application, req, res) {
  res.render("dashboard");
};

module.exports.guaspari = function (application, req, res) {
  res.render("guaspari", { name: "Teste" });
};

module.exports.matopiba = function (application, req, res) {
  res.render("matopiba");
};

module.exports.card = function (application, req, res) {
  res.render("card");
};

module.exports.blank = function (application, req, res) {
  res.render("blank");
};
module.exports.grapheditor = function (application, req, res) {
  res.render("grapheditor");
};
