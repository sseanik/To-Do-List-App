import React, { useState } from "react";

import {
  List,
  ListItem,
  Checkbox,
  IconButton,
  ListItemText,
} from "@material-ui/core";
import EditIconOutlined from '@material-ui/icons/Edit';
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


// Determine if the checked attribute is true/false
function check(checkNum) {
  if (checkNum === 0) {
    return false
  } return true
}

// Take in a prop tasks
const Tasks = ({ tasks, onDeleteTask, onEditTask, onEditSearchTask, onDeleteSearchTask }) => {

  const [checks, setChecks] = useState([]);
  const [taskToEdit, setNewTask] = useState('');
  const [newTaskDescription, setNewDescription] = useState('');
  const [open, setOpen] = useState(false);

  // Open Dialog modal
  const handleTask = (value) => {
    setNewTask(value)
    setNewDescription(value.description)
    setOpen(true);
  };

  // Close Dialog modal
  const handleClose = () => {
    setOpen(false);
  };

  // Pass in tasks variable as a prop
  return (
    <div>
    <List>
      {// For each task we want to return a list item, use the id (unique) as a key
      tasks.map(task => {
        // Render each task as a list item
        return (
          <ListItem key={task.id}>
          <Checkbox
            onChange={async() => {
              // Determine if task will be checked or unchecked
              if (task.checked === 0) {
                task.checked = 1
                console.log(checks);
              } else {
                task.checked = 0
              }
              // Update task as checked/not checked
              const res = await fetch('/checkTask', {
                method: 'PUT',
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  'id': task.id,
                  'checked': task.checked
                })                   
              });
              if (res.ok) {
                // Update state task as checked/not checked
                return setChecks([]);
              }                         
            }}
            checked={check(task.checked)}
          />
          <ListItemText>
            {task.description}
          </ListItemText>
          <IconButton aria-label="Edit Task" 
            onClick={() => handleTask(task)}
          >
          <EditIconOutlined />      
          </IconButton>    
          <IconButton aria-label="Delete Task"
            onClick={async() => {
              // Delete task
              const res = await fetch('/deleteTask', {
                method: 'DELETE',
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({'id': task.id})                   
              });
              if (res.ok) {
                // Delete task from state list and search state list
                onDeleteTask(task);
                onDeleteSearchTask(task);
              }
            }} 
          >
          <DeleteOutlined />
          </IconButton>
          </ListItem>
        )
      })}
    </List>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Task</DialogTitle>
      <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="New Description"
        type="email"
        fullWidth
        defaultValue ={taskToEdit.description}
        onChange={e => setNewDescription(e.target.value)}
      />
      </DialogContent>
      <DialogActions>
      <Button onClick={handleClose} color="primary">
        Cancel
      </Button>
      <Button onClick={async() => {
        // Update task with new description
        const res = await fetch('/editTask', {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            'id': taskToEdit.id,
            'description': newTaskDescription
          })                   
        });
        if (res.ok) {
          // Update state list task and state list task
          onEditTask({
            'id': taskToEdit.id,
            'description': newTaskDescription,
            'checked': taskToEdit.checked
          });
          onEditSearchTask({
            'id': taskToEdit.id,
            'description': newTaskDescription,
            'checked': taskToEdit.checked
          });
          setOpen(false);
        }
      }} color="primary">
      Submit
      </Button>
      </DialogActions>
    </Dialog>
    </div>
  );
};

export default Tasks;
