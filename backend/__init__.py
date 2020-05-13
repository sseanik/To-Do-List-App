from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Helper function for adding, editing and deleting from database
def databaseExecute(query, parameters):
    try:
        con = sqlite3.connect('database/database.db')
        cur = con.cursor()
        cur.execute(query, parameters)
        con.commit()
        con.close()
        return True
    except:
        return False

@app.route('/getTasks', methods=['GET'])
def getTasks():
    # Connect to the database
    con = sqlite3.connect('database/database.db')
    cur = con.cursor()
    # Extract all tasks
    cur.execute("SELECT * FROM tasks")
    tasks = cur.fetchall()
    con.close()
    return jsonify({'tasks': tasks})


@app.route('/addTask', methods=['POST'])
def addTask():
    # Collect the description
    description = request.form.get('description')
    # Add new task to database
    query = "INSERT INTO tasks (checked, description) VALUES (?, ?)"
    result = databaseExecute(query, (False, description))
    return jsonify(success=result)

@app.route('/editTask', methods=['PUT'])
def editTask():
    # Collect the id and description of current task
    id = request.form.get('id')
    # Change the specified task's description
    query = "UPDATE tasks SET description = ? WHERE id = ?"
    result = databaseExecute(query, (description, id))
    return jsonify(success=result)

@app.route('/checkTask', methods=['PUT'])
def checkTask():
    # Collect the id of a current task
    id = request.form.get('id')
    checked = request.form.get('checked')
    # Set the specified task to completed or not completed
    query = "UPDATE tasks SET checked = ? WHERE id = ?"
    result = databaseExecute(query, (checked, id))
    return jsonify(success=result)

@app.route('/deleteTask', methods=['DELETE'])
def deleteTask():
    # Collect the id of a current task
    id = request.form.get('id')
    # Delete task
    query = "DELETE FROM tasks WHERE id = ?"
    result = databaseExecute(query, id)
    return jsonify(success=result)

if __name__== "__main__":
    app.run()

