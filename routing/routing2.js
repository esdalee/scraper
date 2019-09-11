var express = require("express");
var router2 = express.Router();

// module.exports = function (app) {

    router.get("/", function (req, res) {
        res.render("index");
    });

    // app.get("/", function (req, res) {
    //     res.render("index");
    // });

    router.get("/index", function (req, res) {
        res.render("index");
    });

// }

module.exports = router2;