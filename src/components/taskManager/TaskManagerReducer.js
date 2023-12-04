import React, { useEffect, useReducer, useRef, useState } from 'react';
import "./TaskManager.css";
import Task from './Task';
import useLocalStorage from 'use-local-storage';
import Alert from '../alert/Alert';
import Confirm from '../confirm/Confirm';
import { taskReducer } from "./taskReducer";

 
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
    alertClass: "danger",
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    modalTitle: "Delete Task",
    modalMsg: "You are about to delete this Task.",
    modalActionText: "OK"

  }

  const [state, dispatch] = useReducer(taskReducer, initialState);

  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current.focus();
  });
  const openDeleteModal = (id) => {
    dispatch({
        type: "OPEN_DELETE_MODAL",
        payload: id
    })
  }
  const openEditModal = (id) => {
    dispatch({
        type: "OPEN_EDIT_MODAL",
        payload: id
    })
  }
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
        });
    }
    if (name && date && state.isEditing) {
        const updatedTask = {
          id: state.taskID,
          name,
          date,
          complete: false,
        };
        dispatch({
          type: "UPDATE_TASK",
          payload: updatedTask,
        });
        setName("")
        setDate("")
        setTasks(
            tasks.map((task) => {
                if(task.id === updatedTask.id){
                    return {...task, name, date, complete: false}
                }
                return task;
            })
        )
        return;
      }

    if (name && date){
        const newTask = {
            id: Date.now(),
            name,
            date,
            complete: false
        }
        dispatch({
            type: "ADD_TASK",
            payload: newTask
        });
        setName("")
        setDate("")
        setTasks([...tasks, newTask]);
    }
  };

  const editTask = () => {
    console.log(state.taskID);
    const id = state.taskID;
    dispatch({
      type: "EDIT_TASK",
      payload: id,
    });
    const thisTask = state.tasks.find((task) => task.id === id);
    setName(thisTask.name);
    setDate(thisTask.date);
    closeModal();
    console.log(state.isEditing);
  }

  const deleteTask = () => {
    console.log(state.taskID);
    const id = state.taskID;
    dispatch({
      type: "DELETE_TASK",
      payload: id,
    });
    const newTask = tasks.filter((task) => task.id !== id);
    setTasks(newTask);
  }

  const completeTask = (id) => {
    dispatch({
        type: "COMPLETE_TASK",
        payload: id
    });

    setTasks(
        tasks.map((task) => {
            if(task.id === id){
                return{...state, complete: true}
            }
            return task;
        })
    )
  }

  const closeModal = () => {
      dispatch({
        type: "CLOSE_MODAL"
      })
  }

  return (
    <div className="--bg-primary">
        {state.isAlertOpen && <Alert alertContent={state.alertContent} alertClass={state.alertClass} onCloseAlert={closeAlert}   /> }
        {/* <Alert /> */}
        {state.isEditModalOpen && (
            <Confirm
            modalTitle={state.modalTitle}
            modalMsg={state.modalMsg}
            modalActionText={state.modalActionText}
            modalAction={editTask}
            onCloseModal={closeModal}
            />
        )}
         {state.isDeleteModalOpen && (
            <Confirm
            modalTitle={state.modalTitle}
            modalMsg={state.modalMsg}
            modalActionText={state.modalActionText}
            modalAction={deleteTask}
            onCloseModal={closeModal}
            />
        )}
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
                {state.tasks.length === 0 ? (
                   <p className="--text-light">No Task added...</p>
                ) : (
                  <div>
                  {state.tasks.map((task) => {
                     return <Task  key={task.id} {...task} editTask={openEditModal} deleteTask={openDeleteModal} completeTask={completeTask} />;
                  })}
                  </div>  
                )}
            </div>
        </article>
    </div>

  )
}

export default TaskManagerReducer