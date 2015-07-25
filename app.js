var express = require('express');
var app = express();
var routes = require('./routes/index');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false })); //this was taken from express generator.
app.set('view engine', 'ejs');                       

var food = {};
var eaten = 0;
var spoiled = 0; //Declared all necessary variables.

app.get('/', function (req, res) { // For the initial calling of the page
  res.render('index', {food: food, eaten: eaten, spoiled: spoiled});
});

//---------- Below are functions I wrote to help the app process the POST requests

function daysToGo (a) {  //This gets a date object and returns the # days till expiration
  var now = new Date();
  var exp = new Date(a);
  var left = exp.getTime() - now.getTime();
  return (Math.ceil(left/(1000 * 60 * 60 * 24)))
}

function firstValue(obj) { // I was having difficulty calling the first property in the req 
  for (var key in obj)     // object, so this was needed for creating buttons unique to 
    return key;            // each food item.
}

//The following two functions are created for the sort function. The sort function takes the
//food object and reorders it's properties based on their values. 

function all(object, callback) {   //This is inspired by the higher order all property that 
  if (object.isArray) {            // I saw in javascript Koans. I defined it with a 
    for (i = 0; i < object.length; i++) {  //forEach function I created (you can find it in 
      if (!callback(object[i]))     // the ReadMe), but this way seems more concise. It works 
        return false;              //for arrays too, just incase. 
    }
    return true;
  }
  else 
    for (var key in object) {
      if (!callback(object[key]))
        return false;
    }
    return true;
};

function objLength (obj) {  //Finds the length of an object. I needed this so I could 
  var counter = 0;          // determine when the object was empty, as 
  for (var keys in obj)     //  obj === {} does not work. 
    counter++;
  return counter;
};

function sort (obj) {  //while the original object is not empty, this function searches
  var newObj = {};     // through that object and if it finds a property with the lowest
  while (objLength(obj) > 0) {  //value it will push it to newObj and remove it from the 
    for (var key in obj) {      //original. When original is empty, it returns newObj.
      var temp = obj[key];
      if (all(obj, function (a) {return (a >= temp)})) {
        newObj[key] = obj[key];
        delete obj[key];
      }
    }	
  }
  return newObj;
};

//----------------

app.post('/', function (req, res) {
  if (req.body.fName) {  //if Post is fName, it adds the property and value to the food array,
    food[req.body.fName] = daysToGo(req.body.expDate); //and then sorts the array.
    food = sort(food); }
  else if (req.body[firstValue(req.body)] === "Ate") { //I use firstValue to find the value to
  	delete food[firstValue(req.body)];  //identify whether it is ate or spoiled, then delete 
  	eaten += 1; }                       //from food and add one to the appropriate counter.
  else if (req.body[firstValue(req.body)] === "Spoiled") {
  	delete food[firstValue(req.body)];
  	spoiled += 1; }
  res.render('index', {food: food, eaten: eaten, spoiled: spoiled});
});

var server = app.listen(3000, function() {
  console.log("Listening on port 3000");
})
