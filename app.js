var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// This app.use for bodyParser was taken from express generator.
app.use(bodyParser.urlencoded({ extended: false })); 
app.set('view engine', 'ejs');                       

var food = [];
var eaten = 0;
var spoiled = 0; 

// For the initial calling of the page
// I need help because I res.render "firstKey: firstKey" and the other functions did not 
// carry over to index.ejs
app.get('/', function (req, res) { 
  res.render('index', {food: food, eaten: eaten, spoiled: spoiled, 
    daysTillExpiration: daysTillExpiration, firstKey: firstKey, DTEFromItem: DTEFromItem
  });
});

//---------- Below are functions I wrote to help the app process the POST requests

// This gets a date object and returns the # days till expiration
function daysTillExpiration (expirationDate) {  
  var now = new Date();
  var exp = new Date(expirationDate);
  var left = exp.getTime() - now.getTime();
  return (Math.ceil(left/(1000 * 60 * 60 * 24)))
}

// I was having difficulty calling the first property in objects, so I made this
function firstKey(obj) {  
  for (var key in obj)      
    return key;            
}

//The prior two allow for this function: "Date Till Expiration From Item".
//The input is something like {Potato: July 26, 2015}
function DTEFromItem (foodItem) {
  return daysTillExpiration(foodItem[firstKey(foodItem)]);
}


// This is inspired by the higher order all property that I saw in javascript Koans. I first
// defined it using a forEach, but this is more efficient. I use this to congratulate the user
// if they have no expired food in their fridge.
function all(object, callback) {    
  if (object.isArray) {            
    for (i = 0; i < object.length; i++) {  
      if (!callback(object[i])) {    
        return false; }              
    }
  }
  else {
    for (var key in object) {
      if (!callback(object[key])) {
        return false; }
    }
  }
  return true;
};

// Finds the index of a food item. Needed for ate and spoiled buttons.
function returnIndexOf (foodName) {
  for (var i = 0; i < food.length; i++) {
    if (firstKey(food[i]) === foodName) {
      return i;
    }
  }
}

// Needed to identify if food
function checkIfInFood (foodName) {
  for (var i = 0; i< food.length; i++) {
    if (firstKey(food[i]) === foodName)
      return true;
  }
  return false;
}



//----------------

app.post('/', function (req, res) {
  // If Post is fName, it adds the property and value to the food array
  if (req.body.fName) {  
    // This changes the name with a "*" until the name is unique
    while (checkIfInFood(req.body.fName)) {
      req.body.fName += "*"; 
      console.log(req.body.fName);
    }
    //Creat the individual object to addd it to the array.
    var foodObject = {};
    foodObject[req.body.fName] = req.body.expDate;
    food.push(foodObject)
  }
    // If the req.body object has a key of Ate or Spoiled (if the buttons are pushed),
    // then one of these carries out. These find the index of the item that is to be
    // removed, uses it to splice and remove the object from the food array, and then
    // adds 1 to the correlating counter. 
  else if (req.body[firstKey(req.body)] === "Ate") { 
    var indexOfFoodItem = returnIndexOf(firstKey(req.body));
  	food.splice(indexOfFoodItem, indexOfFoodItem + 1);
  	eaten += 1; }                       
  else if (req.body[firstKey(req.body)] === "Spoiled") {
  	var indexOfFoodItem = returnIndexOf(firstKey(req.body));
    food.splice(indexOfFoodItem, indexOfFoodItem + 1);
    spoiled += 1;
  }
  // This sorts the food array using the .sort method. It sorts by expiration date in
  // from earliest to latest. 
  food.sort(function (a, b) {
    return (daysTillExpiration(a[firstKey(a)]) - daysTillExpiration(b[firstKey(b)]));
  });
  res.render('index', {food: food, eaten: eaten, spoiled: spoiled});
});

var server = app.listen(3000, function() {
  console.log("Listening on port 3000");
})
