#!/usr/bin/env node

var fs = require('fs'),
  co = require('co'),
  prompt = require('co-prompt');

co(function *(){
  var component = {}

  component.name = yield prompt('Write component name: ');

  if ( fs.existsSync(component.name) ) {
    console.log('Component directory already exists, delete or choose another name.');
    return false;
  }

  component.module = yield prompt('Are you need a module? [Y,n]: ');
  component.service = yield prompt('Are you need a service? [Y,n]: ');
  component.controller = yield prompt('Are you need a controller? [Y,n]: ');
  return component;

}).then(function (data) {

  var name,
    componentDirectory,
    componentFiles;

  if ( !data ) {
    process.stdin.pause();
    return;
  }

  name = data.name;
  componentDirectory = './' + name;

  componentFiles = [{
      name: 'module',
      file: data.module === 'Y' ? name + '.module.js' : false
    }, {
      name: 'service',
      file: data.service === 'Y' ? name + '.service.js' : false
    }, {
      name: 'controller',
      file: data.controller === 'Y' ? name + '.controller.js' : false
    }, {
      name: 'component',
      file: name + '.component.js'
    },    
    {
      name: 'html',
      file: name + '.html'
    }];

  fs.mkdirSync(componentDirectory);

  componentFiles.forEach(function(element, index) {      
    if ( element.file ) {
      var template = fs.readFileSync( __dirname + '/templates/' + element.name + '.txt' , 'utf8');      
      fs.writeFile(componentDirectory + '/' + element.file, template, function() {
        console.log(element.file + ' created!');
      });
    }      
  }); 
  
  process.stdin.pause();

});