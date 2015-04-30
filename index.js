#!/usr/bin/env node

'use strict';
/* jslint node: true */

var express = require('express');
var app = express();
var markdownCompiler = require(__dirname + '/lib/markdownCompiler');

app.get('/markdown.css', function (request, response) {
  response.sendFile(__dirname + '/static/markdown.css');
});

app.use(markdownCompiler(process.cwd(), process.env.MDWIKI_TITLE));
app.use(express.static(process.cwd()));

app.listen(process.env.PORT || 80);
