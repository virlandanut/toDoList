import express from "express";
import ViteExpress from "vite-express";
import mongoose from "mongoose";
import cors from "cors";
import Todo from "./models/Todo.js";

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/todo")
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.log(error));

app.get("/todos", async (request, response) => {
  const todos = await Todo.find();
  response.json(todos);
});

app.post("/todos/new", (request, response) => {
  const todo = new Todo({
    text: request.body.text,
  });

  todo.save();
  response.json(todo);
});

app.delete("/todos/delete/:id", async (request, response) => {
  const result = await Todo.findByIdAndDelete(request.params.id);
  response.json(result);
});

app.get("/todos/complete/:id", async (request, response) => {
  const todo = await Todo.findById(request.params.id);
  if (!todo) {
    return response.status(404).json({ error: "Todo not found" });
  }
  todo.complete = !todo.complete;
  todo.save();
  response.json(todo);
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
