import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3000";

function App() {
  const [todos, setTodos] = useState([]);
  const [popUpActive, setPopUpActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error("Error: ", error));
  };

  useEffect(() => {
    GetTodos();
  }, []);

  const completeTodo = async (id) => {
    const data = await fetch(API_BASE + "/todos/complete/" + id)
      .then((res) => res.json())
      .catch((error) => console.log(error));

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }

        return todo;
      })
    );
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(API_BASE + "/todos/delete/" + id, {
        method: "DELETE",
      });

      setTodos((todos) => todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = async () => {
    const data = await fetch(API_BASE + "/todos/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newTodo }),
    }).then((res) => res.json());

    setTodos([...todos, data]);
    setPopUpActive(false);
    setNewTodo("");
  };

  return (
    <div className="App">
      <h1>Welcome, Daniel!</h1>
      <h4>Your Tasks</h4>
      <div className="todos">
        {todos.map((todo) => (
          <div
            className={"todo " + (todo.complete ? "is-complete" : "")}
            key={todo._id}
            onClick={() => completeTodo(todo._id)}>
            <div className="checkbox"></div>
            <div className="text">{todo.text}</div>
            <div
              className="delete-todo"
              onClick={() => {
                deleteTodo(todo._id);
              }}>
              x
            </div>
          </div>
        ))}
      </div>

      <div className="addPopup" onClick={() => setPopUpActive(true)}>
        +
      </div>

      {popUpActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopUpActive(false)}>
            x
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
