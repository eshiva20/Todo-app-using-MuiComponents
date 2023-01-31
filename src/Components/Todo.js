import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Input from "@mui/material/Input";
import { useEffect, useState } from "react";
import axios from "axios";

function Todo() {
  const [todos, setTodos] = useState([{}]);
  const [todoInput, setTodoInput] = useState({
    id: "",
    todo: "",
  });
  const [todoId, setTodoId] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get("http://localhost:8080/data")
      .then((res) => setTodos(res.data))
      .catch((err) => console.log("get Error", err));
  };
  console.log(todoInput)
  const handleSubmit = async () => {
    if (todoInput.todo=="") {
      alert("Cannot add Empty todo");
    } else {
      if (!editMode) {
        await axios
          .post("http://localhost:8080/data", todoInput)
          .then((res) => getData())
          .catch((err) => console.log("post err", err));
        todoInput.todo = "";
      } else {
        await axios
          .put(`http://localhost:8080/data/${todoId}`, todoInput)
          .then((res) => getData())
          .catch((err) => console.log("Edit err", err));
        todoInput.todo = "";
        setEditMode(false);
        setTodoId("");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to Delete ?")) {
      await axios
        .delete(`http://localhost:8080/data/${id}`)
        .then((res) => getData())
        .catch((err) => console.log("Delete err", err));
    }
  };

  const handleEdit = (id) => {
    const singleTodo = todos.find((elem) => elem.id == id);
    setTodoInput({ ...singleTodo });
    setTodoId(id);
    setEditMode(true);
  };

  return (
    <Box sx={{ width: 600, px: 4, py: 1, margin: "auto" }}>
      <Box
        sx={{
          padding: "10px 20px",
          background: "#251749",
          margin: "10px 0px",
          borderRadius: "10px",
          display:"flex",
          gap:"0px 20px"
        }}
      >
        <Input
          placeholder="Add todo"
          onChange={(e) => setTodoInput({ todo: e.target.value })}
          value={todoInput.todo}
          type="text"
          sx={{ padding: "0px 20px", color:"white", width: "500px", fontSize: "1.5rem" }}
        />
        <Fab color="primary" aria-label="Delete">
          {!editMode ? (
            <AddIcon onClick={handleSubmit} />
          ) : (
            <EditIcon onClick={handleSubmit} />
          )}
        </Fab>
      </Box>
      <TableContainer sx={{background: "#263159",color:"white"}} component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{color:"white",fontWeight:'700',fontSize:"1rem"}}>Todos </TableCell>
              <TableCell sx={{color:"white",fontWeight:'700',fontSize:"1rem"}} align="right">Action (Edit)</TableCell>
              <TableCell sx={{color:"white",fontWeight:'700',fontSize:"1rem"}} align="right">Action (Delete)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todos.map((elem) => (
              <TableRow key={elem.id}>
                <TableCell sx={{color:"white"}}>{elem.todo}</TableCell>
                <TableCell align="right">
                  <Fab color="secondary" aria-label="Edit">
                    <EditIcon onClick={() => handleEdit(elem.id)} />
                  </Fab>
                </TableCell>
                <TableCell align="right">
                  <Fab color="primary" aria-label="Delete">
                    <DeleteIcon onClick={() => handleDelete(elem.id)} />
                  </Fab>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Todo;
