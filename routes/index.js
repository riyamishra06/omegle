const express = require("express");
const router = express.Router(); // Use 'router' here instead of 'app'

router.get("/", function(req, res) {
    res.render("index"); // Render the 'index' view
});

router.get("/chat", function(req, res) {
    res.render("chat"); // Render the 'index' view
});


module.exports = router; // Export the 'router' correctly
