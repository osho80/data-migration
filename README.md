# data-migration

This backend server is a part of a cyclist web application.
The application provides data for the users about single tracks in Israel.
In order to renew the application, the customer wished, among other things, 1. to add an admin feature 2. to use a non-relational database instead of the former SQL.

This Backend application supports these required changes.
It contains a migration function which is in charge of colleting data from a mySQL database,
and transfering it to a non-relational Mongo database.

There are five main object structures that are necessary for the app: 1. Area: geographical areas in Israel 2. Site: A more specific geographical area containing one or more singles 3. Single: An object describing a single track containing all of the info a user needs.
This is the most complex object structure of the app.
It includes gps pionts (gpx and kml files), description, images and so on. 4. Article: the web app also introduces articles about cycling. 5. Video: the app also contains inspirational videos.

Each of the above was modeled with Mongoose (refer to models folder)
The data is collected and then saved to the new Mongo database.
Images and tracks are stored on an AWS storage.
