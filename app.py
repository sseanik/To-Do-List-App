from flask import Flask, request, jsonify, send_from_directory
import sqlite3
import os

app = Flask(__name__, static_folder="frontend/build/")

# Helper function for adding, editing and deleting from database


def databaseExecute(query, parameters):
    try:
        con = sqlite3.connect("database/database.db")
        cur = con.cursor()
        cur.execute(query, parameters)
        con.commit()
        con.close()
        return True
    except:
        return False


def getAutoID(task):
    con = sqlite3.connect("database/database.db")
    cur = con.cursor()
    cur.execute("SELECT * FROM tasks WHERE description = ?", (task,))
    ids = cur.fetchall()
    con.commit()
    con.close()
    return max(ids)[0]


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(f"{app.static_folder}/{path}"):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


@app.route("/api/getTasks", methods=["GET"])
def getTasks():
    # Connect to the database
    con = sqlite3.connect("database/database.db")
    cur = con.cursor()
    # Extract all tasks
    cur.execute("SELECT * FROM tasks")
    listOfTuples = cur.fetchall()
    con.close()
    tasks = []
    for tup in listOfTuples:
        tasks.append(
            {
                "id": tup[0],
                "checked": tup[1],
                "description": tup[2],
            }
        )
    return jsonify({"tasks": tasks})


@app.route("/api/addTask", methods=["POST"])
def addTask():
    # Collect the description
    description = request.get_json()["description"]
    # Add new task to database
    query = "INSERT INTO tasks (checked, description) VALUES (?, ?)"
    result = databaseExecute(query, (False, description))
    newID = getAutoID(description)
    return jsonify({"id": newID})


@app.route("/api/editTask", methods=["PUT"])
def editTask():
    # Collect the id and description of current task
    id = request.get_json()["id"]
    description = request.get_json()["description"]
    # Change the specified task's description
    query = "UPDATE tasks SET description = ? WHERE id = ?"
    result = databaseExecute(query, (description, id))
    return jsonify(success=result)


@app.route("/api/checkTask", methods=["PUT"])
def checkTask():
    # Collect the id of a current task
    id = request.get_json()["id"]
    checked = request.get_json()["checked"]
    # Set the specified task to completed or not completed
    query = "UPDATE tasks SET checked = ? WHERE id = ?"
    result = databaseExecute(query, (checked, id))
    return jsonify(success=result)


@app.route("/api/deleteTask", methods=["DELETE"])
def deleteTask():
    # Collect the id of a current task
    taskID = int(request.get_json()["id"])
    # Delete task
    query = "DELETE FROM tasks WHERE id = ?"
    result = databaseExecute(query, (taskID,))
    return jsonify(success=result)