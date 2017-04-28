# jQuery - Quiz Match

jQuery Quiz Match is a greater level jQuery plugin. It is not a common used plugin as it is meant for a particular case that is the match in a Quiz. I got the idea while I was working on an online learning system. The aim of this plugin is to learn CSS3, HTML5 drag & drop and jQuery plugin. If it just meets your needs for some quiz project, trying to use it or customizing it might be a good choice as the infrastructure of a match action is already there.

## Technical Features
- CSS3
- HTML5 drag & drop
- jQuery Plugin registered as an AMD
- Customizable
- Cross browser support
- Html template support
- Responsive UI

## Basic usage

This library requires jQuery and [jQuery template engine](https://github.com/codepb/jquery-template) 
- Create a div in your html
- Set class to 'quizMatch-container' which is defined in the quiz match native css.
- Pass JSON data as part of the options of quiz match to init the UI
```
     <div id='test' class="quizMatch-container"></div>
          $('#test').aylquizmatch({
           data: matchData
     });
     
     var matchedData = $('#test').aylquizmatch('getData');
```
The data structure:
```
var data = [{
    leftItem: {
        key: 1,
        label: 'question1',
        refRight: []
    },
    rightItem: {
        key: 1,
        label: 'answer1 answer1 answer1 answer1'
    }
},{
    leftItem: {
        key: 2,
        label: 'question2 question2 question2 question2',
        refRight: []
    },
    rightItem: {
        key: 2,
        label: 'answer2 answer2 answer2 answer2 answer2  '
    }
}]
```
The result of plugin is like:
![alt tag](https://github.com/yasirliu/jquery-quizmatch/blob/master/src/test/result.PNG)

## Options

Options can be accessed by $.fn.aylquizmatch.default

- template (currently the plugin is always using html templates)
  - enable: enable or disable html template engine in plugin
  - leftItem: define the html of left item or set the template relative path if enable is true
  - rightItem: define the html of right item or set the template relative path if enable is true
- data: accept data in JSON format to initiate plugin.
- action: 
  - draggable: default is true.
  - droppable: default is true.
  - onbeforedrop : default is null.
  - onafterdrop：default is null.
  - status: it is used to track the position of the draggable elements
    - enalbe: default is true.
    - pre: object is used by internal track system in the plugin. defulat is {}. inner objects of the object are named by the value of the keys in data. for instance pre['001'].containerId. containerId is the only property of each of the inner objects. it represents the previous position of one draggable element. for instance pre['001'] = 'div001' means the element 001 was in div with id 'div001'.
    - cur: similar as pre. it represents the current position of one draggable element.
    
## Methods
- getData(): retrieve the match data from plugin. The structure of the data is same as the data which is passed in.

## Customizable
1. If you want to choose another template engin for the plugin, you are able to use your own logic to load templates by overwriting method $.fn.aylquizmatch.default.utilities.loadTemplates. 
2. If you want to use drag and drop API provided by 3rd party, for instance jQueryUI, overwrite $.fn.aylquizmatch.draggable and $.fn.aylquizmatch.droppable in order to execute your own binding for the two events.

## TODO
1. make template option work
2. use Gulp to complie and release it
3. add animation features
