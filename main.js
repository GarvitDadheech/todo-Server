const express = require('express');
  const bodyParser = require('body-parser');
  const fs = require('fs');
  const app = express();
  
  app.use(bodyParser.json());
  
  let todos = [];
  const DATA_FILE = './todos.json';
  
  // Helper function to read todos from the file
  const loadTodos = () => {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE);
      todos = JSON.parse(data);
    }
  };
  
  // Helper function to save todos to the file
  const saveTodos = () => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
  };
  
  // Load todos on server start
  loadTodos();
  
  // Generate unique ID for new todo
  const generateId = () => {
    return todos.length > 0 ? Math.max(todos.map(todo => todo.id)) + 1 : 1;
  };
  
  // GET /todos - Retrieve all todo items
  app.get('/todos', (req, res) => {
    res.status(200).json(todos);
  });
  
  // GET /todos/:id - Retrieve a specific todo item by ID
  app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      res.status(200).json(todo);
    } else {
      res.status(404).send('Todo not found');
    }
  });
  
 // POST /todos - Create a new todo item
 app.post('/todos', (req, res) => {
    const { title, description } = req.body;
    if (title && description) {
      const newTodo = { id: generateId(), title, description };
      todos.push(newTodo);
      saveTodos();
      res.status(201).json({ id: newTodo.id });
    } else {
      res.status(400).send('Invalid request');
    }
  });

  // PUT /todos/:id - Update an existing todo item by ID
  app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { title, description } = req.body;
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      todos[index] = { id, title, description };
      saveTodos();
      res.status(200).send('Todo updated');
    } else {
      res.status(404).send('Todo not found');
    }
  });

  // DELETE /todos/:id - Delete a todo item by ID
  app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      saveTodos();
      res.status(200).send('Todo deleted');
    } else {
      res.status(404).send('Todo not found');
    }
  });
  
  // Handle undefined routes
  app.use((req, res) => {
    res.status(404).send('Not Found');
  });
  
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
  module.exports = app;