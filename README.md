# To Do List App

## Live Demo: http://todo.seanik.codes/

A single page To Do List application built using React, Flask and SQLite3. The frontend was implemented using ReactJS with Material UI. The backend web server was built using Flask and a SQLite3 server to store the tasks. Docker was used to containerize the application to test out hosting two servers that need to communicated with each other. Nginx was used as a reverse proxy.

**Functionality**:

* A user can add a task
* A user can check or uncheck a task
* They can edit a task
* They can remove a task
* They can also search for a task based on text filtering

**Build**:

Database: ```sqlite3 database.db < schema.sql```

Docker: ```docker-compose up --build```
