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

function check(checkNum) {
    if (checkNum === 0) {
        return false
    }
    return true
}

const Tasks = ({ tasks, onDeleteTask, onEditTask, onEditSearchTask, onDeleteSearchTask }) => {

  const [checks, setChecks] = useState([]);

  const [taskToEdit, setNewTask] = useState('');

  const [newTaskDescription, setNewDescription] = useState('');

  const [open, setOpen] = useState(false);

  const handleTask = (value) => {
    setNewTask(value)
    setNewDescription(value.description)
    setOpen(true);
  };



  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
    <List>
        {tasks.map(task => {
            if (task !== undefined) {
            return (
                <ListItem key={task.id}>
                    <Checkbox
                        onChange={async() => {
                            if (task.checked === 0) {
                                task.checked = 1
                            } else {
                                task.checked = 0
                            }
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
                                return setChecks([])
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
                            const res = await fetch('/deleteTask', {
                                method: 'DELETE',
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({'id': task.id})                   
                            });
                            if (res.ok) {
                                onDeleteTask(task);
                                onDeleteSearchTask(task);
                            }
                        }} 
                    >
                        <DeleteOutlined />
                    </IconButton>
                </ListItem>
            )
}})}
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
                                setOpen();
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
