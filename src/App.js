//importo REACT y los hooks de estado
import React, { useState, useEffect } from "react";
import { isEmpty, size } from "lodash";
import { addDocument, deleteDocument, getCollection, updateDocument } from "./backend";

function App() {
  //Estados
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState("");
  const [error, setError] = useState(null);

  //hook
  useEffect(() => {
    (async () => {
      const result = await getCollection("tasks");
      if (result.statusResponse) {
        setTasks(result.data);
      } 
    })()
  },[]);

  /* 
    Valida formulario
  */
  const validForm = () => {
    let isValid = true;
    setError(null);
    if (isEmpty(task)) {
      setError("Debes ingresar una tarea");
      isValid = false;
    }
    return isValid;
  };

  /* 
    Añade una tarea
  */
  const addTask = async(e) => {
    e.preventDefault();

    if (!validForm()) {
      return;
    }

    const result = await addDocument("tasks", {name: task});

    if (!result.statusResponse) {
      setError(result.error);
      return
    } 

    setTasks([...tasks, {id: result.data.id, name: task}]);
    setTask("");
  };

  /* 
    graba una tarea nueva
  */
  const saveTask = async(e) => {
    e.preventDefault();
    if (!validForm()) {
      return;
    }

    const result = await updateDocument("tasks", id, {name: task});
    if (!result.statusResponse) {
      setError(result.error);
      return;
    }

    const editedTasks = tasks.map((item) =>
      item.id === id ? { id, name: task } : item
    );
    setTasks(editedTasks);
    setEditMode(false);
    setTask("");
    setId("");
  };

  /* 
    Borra una tarea
  */
  const deleteTask = async(id) => {
    //llamo al metodo del backend
    const result = await deleteDocument("tasks", id);
    if (!result.statusResponse) {
      setError(result.error);
      return;
    }
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  };

  /* 
    Edita una tarea
  */
  const editTask = (theTask) => {
    setTask(theTask.name);
    setEditMode(true);
    setId(theTask.id);
  };

  return (
    <div className="container mt-5">
      <h1>Tareas:</h1>
      <hr />
      <div className="row">
        <div className="col-8">
          <h4 className="text-left">Lista de Tareas</h4>
          {size(tasks) === 0 ? (
            <li className="list-group-item mb-2">
              Aún no hay tareas programadas
            </li>
          ) : (
            <ul className="list-group">
              {tasks.map((task) => (
                <li className="list-group-item fs-3" key={task.id}>
                  <span className="lead">{task.name}</span>
                  <button
                    className="btn btn-danger btn-sm float-right mx-2"
                    onClick={() => deleteTask(task.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-warning btn-sm float-right"
                    onClick={() => editTask(task)}
                  >
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-4">
          <h4>{editMode ? "Modificar tarea" : "Agregar tarea"}</h4>
          <form onSubmit={editMode ? saveTask : addTask}>
            {error && <span className="text-danger mb-2">{error}</span>}
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Ingrese la tarea"
              onChange={(text) => setTask(text.target.value)}
              value={task}
            />
            <button
              className={
                editMode
                  ? "btn btn-warning btn-block"
                  : "btn btn-dark btn-block"
              }
              type="submit"
            >
              {editMode ? "Guardar" : "Agregar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
