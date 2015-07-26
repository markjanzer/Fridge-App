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

If you create multiple items with the same name, the duplicates will have "*" added to their names.

NOTES:

This structure was created using the express generator followed by heavy pruning of things I didn't understand/think were necessary. 

--I might just use this code instead to show off more? I'm not sure.  

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
  var str = "";
  var bool = true;
  forEach(obj, function (a) {
    if (parameter(a) === false)
      bool = false;
  });
  return bool;
} 

---------------------------------------

If you have any questions or comments you can reach me at mark.janzer@gmail.com

Cheers,
Mark