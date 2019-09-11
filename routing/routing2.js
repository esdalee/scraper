var express = require("express");
var router2 = express.Router();

// module.exports = function (app) {

    router2.get("/", function (req, res) {
        res.render("index");
    });

    // app.get("/", function (req, res) {
    //     res.render("index");
    // });

    router2.get("/index", function (req, res) {
        res.render("index");
    });

// }

module.exports = router2;