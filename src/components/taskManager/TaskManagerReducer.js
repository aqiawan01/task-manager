import React, { useEffect, useReducer, useRef, useState } from 'react';
import "./TaskManager.css";
import Task from './Task';
import useLocalStorage from 'use-local-storage';
import Alert from '../alert/Alert';
import Confirm from '../confirm/Confirm';

const taskReducer = (state, action) => {
    if(action.type === "EMPTY_FIELD"){
        return {
            ...state,
            isAlertOpen: true,
            alertContent: "Please enter name and date",
            alertClass: "danger"
        }
    }
    if(action.type === "CLOSE_ALERT"){
        return {...state, isAlertOpen: false };
    }
    return state;
};

const TaskManagerReducer = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [tasks, setTasks] = useLocalStorage("tasks", [])

  const initialState = {
    tasks,
    taskID: null,
    isEditing: false,
    isAlertOpen: false,
    alertContent: "This is an alert",
    alertClass: "danger"
  }

  const [state, dispatch] = useReducer(taskReducer, initialState);

  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current.focus();
  });

  const closeAlert = () => {
    dispatch({
        type: "CLOSE_ALERT"
    })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name || !date) {
        dispatch({
            type: "EMPTY_FIELD"
        })
    }
  };

  const editTask = (id) => {
    const thisTask = tasks.find((task) => task.id === id)
    state.isEditing(true);
    state.taskID(id);
    setName(thisTask.name)
    setDate(thisTask.date)
  }

  const deleteTask = (id) => {
    if(window.confirm("Delete this task") === true ){
        const newTasks = tasks.filter((task) => task.id !== id);
        setTasks(newTasks);
    }
  }

  const completeTask = (id) => {
    setTasks(
        tasks.map((task) => {
            if(task.id === id) {
                return {...task, complete: true}
            }
            return task;
        })
    )
  }

  return (
    <div className="--bg-primary">
        {state.isAlertOpen && <Alert alertContent={state.alertContent} alertClass={state.alertClass} onCloseAlert={closeAlert}   /> }
        {/* <Alert /> */}
        {/* <Confirm /> */}
        <h1 className="--text-center --text-light">Task Manager Reducer</h1>
        <div className="--flex-center --p">
            <div className="--card --bg-light --width-500px --p --flex-center">
                <form onSubmit={handleSubmit} className="form --form-control ">
                    <div>
                        <label htmlFor="name">Task:</label>
                        <input ref={nameInputRef} type="text" placeholder="Task Name" name="name" 
                          value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="date">Date:</label>
                        <input type="date" placeholder="mm/dd/yyyy" name="date"
                         value={date} onChange={(e) => setDate(e.target.value)}  />
                    </div>
                    <button className="--btn --btn-success --btn-block">{state.isEditing ? "Edit Task" : "Save Task"}</button>
                </form>
            </div>
        </div>

        {/*  Display Task */}
        <article className="--flex-center --my2">
            <div className="--width-500px --p">
                <h2 className="--text-light">Task List</h2>
                <hr style={{ background: "#fff"}} />
                {tasks.length === 0 ? (
                   <p className="--text-light">No Task added...</p>
                ) : (
                  <div>
                  {tasks.map((task) => {
                     return <Task {...task} editTask={editTask} deleteTask={deleteTask} completeTask={completeTask} />;
                  })}
                  </div>  
                )}
            </div>
        </article>
    </div>

  )
}

export default TaskManagerReducer