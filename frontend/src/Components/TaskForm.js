import React, { useState } from "react";
import { TextField, Paper, Button, Grid } from "@material-ui/core";


const TaskForm = ({ onNewTask, onNewSearchTask }) => {

  // State to store new task details
  const [taskToAdd, setDescription] = useState('');

    return (
      <Paper style={{ marginTop: 16, marginBottom: 16,padding: 16 }}>
      <Grid container>
      <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
      <TextField
        placeholder="Add Task Here"
        fullWidth
        value = {taskToAdd}
        onChange={e => setDescription(e.target.value)}
      />
      </Grid>
      <Grid xs={2} md={1} item>
      <Button onClick={async() => {
        // Ignore empty submissions
        if (taskToAdd.length === 0) {
          return
        } else {
          // Create new task
          let newTask = {
            'checked': 0,
            'description': taskToAdd,
          }
          const res = await fetch('/api/addTask', {
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(newTask)                   
          });
          if (res.ok) {
            // Add new task to state
            res.json().then(data => {
              onNewTask({
                'checked': 0,
                'description': taskToAdd,
                'id': data.id,
              });
            })
            setDescription('')
          }
        }
      }}>
      Submit
      </Button>
      </Grid>
      </Grid>
      </Paper>
  )
}

export default TaskForm;
