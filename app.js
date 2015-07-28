var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// This app.use for bodyParser was taken from express generator.
app.use(bodyParser.urlencoded({ extended: false })); 
app.set('view engine', 'ejs');                       

var food = [];
var eaten = 0;
var spoiled = 0; 
var congratulate = false;
var foodWDaysLeft = [];

app.get('/', function (req, res) { 
  res.render('index', {eaten: eaten, spoiled: spoiled, congratulate: congratulate, 
    foodWDaysLeft: foodWDaysLeft
  });
});

//---------- Below are functions I wrote to help the app process the POST requests

function forEach (obj, callback) {
  if (obj.isArray) {
    for (var i = 0; i < obj.length; i++) {
      callback(obj[i]);
    }
  } else {
    for (var key in obj) {
      callback(obj[key]);
    }
  }
}

// This is inspired by the higher order "all" property that I saw in Javascript Koans. This tests if all
// of the values in an object pass a test, while "any" sees if any of them do.
function all(object, test) {    
  var bool = true;
  forEach(object, function (objValue) {
    if (!test(objValue)) {
      bool = false;
    }
  });
  return bool;
}

function any(object, test) {
  var bool = false;
  forEach(object, function (objValue) {
    if (test(objValue)) {
      bool = true;
    }
  });
  return bool;
}

// This gets a date object and returns the number of days till expiration
function getDaysTillExpiration (expirationDate) {  
  var now = new Date();
  var exp = new Date(expirationDate);
  var left = exp.getTime() - now.getTime();
  return (Math.ceil(left/(1000 * 60 * 60 * 24)))
}

// Finds and removes an item from food.
function removeItem (removeFood) {
  for (var i = 0; i < food.length; i++) {
    if (food[i].fName === foodName) {
      food.splice(i, i + 1);
    }
  }
}

// This is used to define the boolean 'congratulate.' Congratulates the user if no food is spoiled,
// but there also has to be food in the fridge. 
function getCongratulate (foodArray) {
  var noSpoiled = (all(foodArray, function (foodItem) {
    return (foodItem.daysTillExp >= 0);
  }));
  var notEmpty = (food.length > 0);
  return (noSpoiled && notEmpty);
} 

// This is used to define foodWDaysLeft, a copy of food that has days left rather than expiration dates. 
// This is the object that is passed to index.ejs rather than the original food array.
function getFoodWDaysLeft () {
  var newFoodArr = [];
  forEach(food, function (foodItem) {
    return newFoodArr.push({fName: foodItem.fName, daysTillExp: getDaysTillExpiration(foodItem.eDate)});
  });
  return newFoodArr;
}


//----------------

app.post('/', function (req, res) {
  // This checks if the POST is from a submitted food item
  if (req.body.fName && req.body.eDate) {  
    // This changes the name of the submitted fooditem until the name is unique
    while (any(food, function (foodItem) {
      return (foodItem.fName === req.body.fName);
    })) {
      req.body.fName += "*"; 
    }
    food.push(req.body);
  } else if (req.body.Status === "Ate") { 
    removeItem(req.body.fName);
  	eaten += 1; 
  } else if (req.body.Status === "Spoiled") {
  	removeItem(req.body.fName);
    spoiled += 1;
  }
  //This sorts the food array using the .sort method. It sorts by expiration date in
  // from earliest to latest. 
  food.sort(function (a, b) {
    return (getDaysTillExpiration(a.eDate) - getDaysTillExpiration(b.eDate));
  });
  // Use these to define the variables foodWDaysLeft and congratulate
  var foodWDaysLeft = getFoodWDaysLeft();
  var congratulate = getCongratulate(foodWDaysLeft);
  console.log(foodWDaysLeft);
  res.render('index', {food: food, foodWDaysLeft: foodWDaysLeft, eaten: eaten, 
    spoiled: spoiled, congratulate: congratulate});
});

var server = app.listen(3000, function() {
  console.log("Listening on port 3000");
});
