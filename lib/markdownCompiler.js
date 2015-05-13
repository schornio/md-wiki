'use strict';
/* jslint node: true */

var fs = require('fs');
var md = require('markdown-it')();

var header = '<html>\n<head>\n<title>{{title}}</title>\n<link rel="stylesheet" href="/markdown.css" charset="utf-8"></head>\n<body><div class="markdown-header">{{nav}}</div>\n<div class="markdown-body">';
var footer = '</div></body></html>';
var nav = '<nav>&gt; {{path}}</nav>';

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

        htmlFile += header.replace('{{title}}', title || 'Wiki').replace('{{nav}}', createNavbar(request.url, title || 'Wiki')) + '\n';
        htmlFile += md.render(markdownFile.toString());
        htmlFile += footer;

        response.send(htmlFile);
      });
    });
  };
}

function createNavbar(path, title) {
  var pathFragments = path.split('/');
  var breadcrumbPath = '/';
  var breadcrumb = '<a href="/">' + title + '</a>';

  for (var i = 1; i < pathFragments.length - 1; i++) {
    breadcrumbPath += pathFragments[i] + '/';
    breadcrumb += '/<a href="' + breadcrumbPath + '">' + pathFragments[i] + '</a>';
  }

  return nav.replace('{{title}}', title).replace('{{path}}', breadcrumb);
}

module.exports = markdownCompiler;
