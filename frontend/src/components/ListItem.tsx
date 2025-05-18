import React, { useState, useEffect } from "react";
import { Task } from "../interfaces/Task";

interface ListItemProps {
  task: Task;
}

const ListItem: React.FC<ListItemProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.description);

  useEffect(() => {
    console.log("Editing task:", isEditing);
  }, [isEditing]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleCancelEdit = () => {
    setEditText(task.description);
    setIsEditing(!isEditing);
  };

  const handleEditState = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/todos/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: task.state === "INCOMPLETE" ? "COMPLETE" : "INCOMPLETE",
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Task state edited sucessfully");
    } catch (error: any) {
      console.error("Error editing task state:", error);
    }
  };

   const handleEditClick = async () => {
    if (isEditing) {
      // TODO: not reached
      await handleEditDescription();
      setIsEditing(!isEditing);
    } else {
      setIsEditing(!isEditing);
    }
  };

  const handleEditDescription = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/todos/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: editText,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Task description edited sucessfully");
    } catch (error: any) {
      console.error("Error editing task description:", error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/todos/${task.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Task deleted sucessfully");
    } catch (error: any) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <li>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.state === "COMPLETE"}
        onChange={handleEditState}
      />
      {isEditing ? (
        <input
          type="text"
          className="task-edit-input"
          value={editText}
          onChange={handleInputChange}
          onBlur={handleCancelEdit}
        />
      ) : (
        <span className="task-description">{task.description}</span>
      )}
      <button
        className="task-actions"
        disabled={task.state === "COMPLETE"}
        onClick={handleEditClick}
      >
        {isEditing ? "Save" : "Edit"}
      </button>
      <button
        className="task-actions"
        disabled={isEditing}
        onClick={handleDeleteTask}
      >
        Delete
      </button>
    </li>
  );
};

export default ListItem;
