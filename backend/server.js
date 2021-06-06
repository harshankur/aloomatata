const fs        = require('fs');
const express   = require('express');
const scissors  = require('scissors');


app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


