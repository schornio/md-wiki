'use strict';
/* jslint node: true */

var fs = require('fs');
var md = require('markdown-it')();

var header = '<html>\n<head>\n<title>{{title}}</title>\n<link rel="stylesheet" href="/markdown.css" charset="utf-8"></head>\n<body>\n<div class="markdown-body">';
var footer = '</div></body></html>';

function markdownCompiler(path, title) {
  return function (request, response, next) {
    var rawPath = path + request.url;
    var rawPathComponents;
    var markdownPath;

    rawPath = rawPath.replace(/\/$/, '/index.html');
    rawPathComponents = rawPath.match(/(.*)\.html$/);
    if(!rawPathComponents) {
      return next();
    }

    markdownPath = rawPathComponents[1] + '.md';

    fs.access(markdownPath, function (error) {
      if(error) {
        return next();
      }

      fs.readFile(markdownPath, function (error, markdownFile) {
        var htmlFile = '';

        if(error) {
          return next(error);
        }

        htmlFile += header.replace('{{title}}', title || 'Wiki') + '\n';
        htmlFile += md.render(markdownFile.toString());
        htmlFile += footer;

        response.send(htmlFile);
      });
    });
  };
}

module.exports = markdownCompiler;
