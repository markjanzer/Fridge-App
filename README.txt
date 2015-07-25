README

TO RUN:

Run using
$ node app.js
Listening on port 3000
Best viewed on FireFox (Chrome buttons are large).

TO USE:

This app was created in memory of multiple packages of expired lettuce.

I wanted to create an app that would let me keep track of what is going to expire so I no longer have to throw away briefly-forgotten letucce. 

Input a food item and expiration date and it will be added to your current list of food (which is sorted chronologically by expiration date). If the food is within 3 days of expiring, the text will show up green. If the food has passed the expiration date, the text will show up red.

If you eat a food product or it goes bad, you can click either the "Ate" or "Spoiled" button below the item. This adds to a counter to keep track of how many food items you have eaten or let spoil. 

If you were to have multiples of the same food product with different expiration dates, name them different things (ex. "bread", "Bread", "BREEAAAAD", etc.) Or if you want to change the expiration date for an item, create a "new item" using the same name and it'll overwrite the expiration date. 

NOTES:

This structure was created using the express generator followed by heavy pruning of things I didn't understand/think were necessary. 

Here is an alternate definition of the function "all". This is meant to determine if all of the values of an object pass a test which is defined by a callback function.

---------------------------------------

function forEach(object, callback) {
  if (object.isArray)
    for (var i = 0; i < object.length; i++)
      callback(object[i]);
  else 
    for (var key in object)
      callback(object[key]);
  
}

function all(obj, parameter) {
  var str = ""
  forEach(obj, function (a) {
    if (parameter(a) === false)
      str = "f";  
  });
  if (str === "f")
    return false;
  else 
    return true;
} 

---------------------------------------

If you have any questions or comments you can reach me at mark.janzer@gmail.com

Cheers,
Mark