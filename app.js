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
var foodDays = [];

app.get('/', function (req, res) { 
  res.render('index', {eaten: eaten, spoiled: spoiled, congratulate: congratulate, 
    foodDays: foodDays
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

// This is inspired by the higher order "all" property that I saw in Javascript Koans.
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
function daysTillExpiration (expirationDate) {  
  var now = new Date();
  var exp = new Date(expirationDate);
  var left = exp.getTime() - now.getTime();
  return (Math.ceil(left/(1000 * 60 * 60 * 24)))
}

// Finds and removes an item from food.
function removeItem (foodName) {
  var index = undefined;
  for (var i = 0; i < food.length; i++) {
    if (food[i].fName === foodName) {
      food.splice(i, i + 1);
    }
  }
}

/* This defines the boolean 'congratulate.' Congratulates the user if no food is spoiled,
but there also has to be food in the fridge. 
*/
function doWeCongratulate () {
  var noSpoiled = all(foodDays, function (foodItem) {
    return (foodItem.eDate >= 0);
  });
  var notEmpty = (food.length > 0);
  congratulate = (noSpoiled && notEmpty);
} 

/* Copying arrays and the objects within the arrays was a little difficult. I couldn't do 
foodDays = food, so I push all of the objects into foodDays. However, objects also are tricky
to copy. I found this way with JSON on the internet and it seems to work great. After I copy 
the array (in a way that won't affect the original), I change the eDate value to be days until
the expiration. index.ejs will use this array instead of the original 'food' array. */
function defineFoodDays () {
  foodDays = [];
  forEach(food, function (foodItem) {
    return foodDays.push((JSON.parse(JSON.stringify(foodItem))));
  });
  forEach(foodDays, function (foodItem) {
    foodItem.eDate = daysTillExpiration(foodItem.eDate);
  });
}


//----------------

app.post('/', function (req, res) {
  // This checks if the POST is from a submitted food item
  if (req.body.fName && req.body.eDate) {  
    // This changes the name with a "*" until the name is unique
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
  /* This sorts the food array using the .sort method. It sorts by expiration date in
   from earliest to latest. */
  food.sort(function (a, b) {
    return (daysTillExpiration(a.eDate) - daysTillExpiration(b.eDate));
  });
  // Use these to define the variables foodDays and congratulate
  defineFoodDays();
  doWeCongratulate();
  res.render('index', {food: food, foodDays: foodDays, eaten: eaten, spoiled: spoiled, 
    congratulate: congratulate});
});

var server = app.listen(3000, function() {
  console.log("Listening on port 3000");
})
