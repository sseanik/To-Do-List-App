import React, { useEffect, useState } from 'react';
import './App.css';

import { Container } from '@material-ui/core';
import Card from '@material-ui/core/Card';

import Header from './Components/Header';
import Tasks from './Components/Tasks';
import TaskForm from './Components/TaskForm';


// Check if the search task state is populated
function chooseTaskList(tasks, searchTasks) {
  if (searchTasks.length > 0) {
    return searchTasks
  } else {
    return tasks
  }
}

function App() {
  
  // Once we get data from the api, we transfer it into state
  const [tasks, setTasks] = useState([]);
  const [searchTasks, setSearchTasks] = useState([]);

  // Make Api call to Flask Server and render tasks (React Hooks)
  // Only called when component first mounts
  // URL is set in package.json with a Proxy (to prevent problems with CORS)
  // UseEffect cannot use async/await
  useEffect(() => {
    fetch("/getTasks").then(response =>
      response.json().then(data => {
        setTasks(data.tasks);
      })
    );
  }, []);

  return (
    <div className="App">
    <Header
      onSearchTask = {query => {
        if (query.length === 0) {
          setSearchTasks(searchTasks => [])
        } else {
          setSearchTasks(tasks
            .filter(item => item.description.toLowerCase().includes(query.toLowerCase()))
            .map(item => item)
          )
        }
        /*
        setSearchTasks(tasks.map((item) => {
          // If the search query is empty
          if (query.length === 0) {
            return item
          }
          // Otherwsie check if search query is a substring in each task
          else if (item.description.toLowerCase().includes(query.toLowerCase())) {
            return item;
          } 
        }))
        */
      }}
    >
    </Header>
    <Container maxWidth="md" style={{marginBottom: 16}} >
      <TaskForm 
        // Add created task to state list
        // Prop passed in to the task, called whenever there is a new task
        onNewTask = {taskToAdd => 
          // Adding new task onto the end (opposite order to add to start)
          setTasks(currentTasks => [...currentTasks, taskToAdd])
        }
      >
      </TaskForm>
      <Card>
      <Tasks 
        tasks={chooseTaskList(tasks, searchTasks)}
        // Find the task that has been edited and update state list
        onEditTask = {task => {
          setTasks(tasks.map((item) => {
            // Edited task found
            if (item.id === task.id) {
              return task;
            } else {
              return item;
            }
          }))
        }}
        // Update the task if edit action was done while search query was active
        onEditSearchTask = {task => {
          setSearchTasks(searchTasks.map((item) => {
            // Edited task found
            if (item !== undefined && item.id === task.id) {
              return task;
            } else {
              return item;
            }
          }))
        }}
        // Remove deleted task from state list
        onDeleteTask = {task => 
          setTasks(currentTasks => [...currentTasks.filter(x => x !== task)])
        }
        // Remove deleted task from search state list
        onDeleteSearchTask = {task => 
          setSearchTasks(currentTasks => [...currentTasks.filter(x => x !== task)])
        }
      />
      </Card>
    </Container>
    </div>
  );
}

export default App;
