import React, { useEffect, useState } from 'react';
import './App.css';

import { Container } from '@material-ui/core';
import Card from '@material-ui/core/Card';



import { Header } from './Components/Header';
import Tasks from './Components/Tasks';
import TaskForm from './Components/TaskForm';

function chooseTaskList(tasks, searchTasks) {
  if (searchTasks.length > 0) {
    return searchTasks
  } else {
    return tasks
  }

}

function App() {
  const [tasks, setTasks] = useState([]);

  const [searchTasks, setSearchTasks] = useState([]);

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
          setSearchTasks(tasks.map((item) => {
            if (query.length === 0) {
              return item
            }
            else if (item.description.toLowerCase().includes(query.toLowerCase())) {
              return item;
            } 
          }))
        }}

      >
      </Header>
      <Container maxWidth="md" style={{marginBottom: 16}} >
        <TaskForm 
          onNewTask = {taskToAdd => 
            setTasks(currentTasks => [...currentTasks, taskToAdd])
          }
        >
        </TaskForm>
        <Card>
          <Tasks 
            tasks={chooseTaskList(tasks, searchTasks)}

            onEditTask = {task => {
              setTasks(tasks.map((item) => {
                if (item.id === task.id) {
                  return task;
                } else {
                  return item;
                }
              }))
            }}

            onEditSearchTask = {task => {
              setSearchTasks(searchTasks.map((item) => {
                if (item !== undefined && item.id === task.id) {
                  return task;
                } else if (item !== undefined) {
                  return item;
                }
              }))
            }}
            onDeleteTask = {task => 
              setTasks(currentTasks => [...currentTasks.filter(x => x !== task)])
            }

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
