module.exports = function (app) {

    app.get("/", function (req, res) {
        res.render("index");
    });

    app.get("/list", function (req, res) {
        res.render("saved");
    });

}