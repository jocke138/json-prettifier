json-prettifier
===============

A jQuery plugin that renders json objects in html.

## Features
Color coded. Collapse/expand values. Some other stuff. 

## Background
I was comparing a new rest api with a lecay api that both responded with JSON and I wanted a quick and easy way manually overview the responses. 
## How to use

Include `json-prettifier.js` and `json-prettifier.css` in your HTML page (don't forget jQuery).
 
Use like this:

    $('#some-element').jsonPrettifier('render', {"a": "json", "object":});
    $('#some-element').jsonPrettifier('render', '{"or": "a stringified", "json object":}');

## Methods
### init
Optional. Initialize the json prettifier with options:

    jsonPrettifier('init', options);

- `options`: See below.

### render
Renders the json object in the html element. Takes an optional options object.

    jsonPrettifier('render', jsonString, options);

- `jsonString`: What is sounds like.
- `options`: Optional. See below.


## Options
Options are:

1. `tabSize`: How many spaces to indent with. Default: 4
2. `interceptCallback`: Provdie a callback to handle click events on links
3. `linkRegexp`: Regexp for deciding whether a string is a link or not. Default: /^[\w]+:\/\//
4. `proxies`: Key-value paris with links that are replaced in the click handler. This is only useful is you have a proxy setup on your webserver. Proxy example: `{ "someOtherDomain.com/some/path": "/proxiedPath/some/path" }`

## Screenshot
![Alt text](https://dl.dropbox.com/u/348075/json-prettifier.png)
