README

TO RUN:

Download the modules in the package.json
Run using: $ node app.js
It runs at http://localhost:3000/
Best viewed on FireFox (Chrome buttons are large).

TO USE:

This app was created in memory of multiple packages of expired lettuce.

I wanted to create an app that would let me keep track of what is going to expire so I no longer have to throw away briefly-forgotten letucce. 

Input a food item and expiration date and it will be added to your current list of food (which is sorted chronologically by expiration date). If the food is within 3 days of expiring, the text will show up green. If the food has passed the expiration date, the text will show up red.

If you eat a food product or it goes bad, you can click either the "Ate" or "Spoiled" button below the item. This adds to a counter to keep track of how many food items you have eaten or let spoil. 

If you create multiple items with the same name, the duplicates will have "*" added to their names.

If you have at least one item in your fridge and nothing is currently spoiled, you will be congratulated!

NOTES:

Currently everything is stored in memory, so if you lose the browser, you lose all of the data. My next step is to add a database so the data is saved. 



If you have any questions or comments you can reach me at mark.janzer@gmail.com

Cheers,
Mark