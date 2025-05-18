import React, { useState, useEffect } from "react";
import { Task } from "../interfaces/Task";
import ListItem from "./ListItem";

const TaskList: React.FC = () => {
  const [items, setItems] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState<"ALL" | "INCOMPLETE">(
    "ALL"
  );
  const [showOrderedBy, setShowOrderedBy] = useState<
    "CREATED_AT" | "DESCRIPTION"
  >("CREATED_AT");
  const [showDirection, setShowDirection] = useState<"desc" | "asc">("desc");

  const listTasks = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/todos?filter=${showCompleted}&orderBy=${showOrderedBy}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json: Task[] = await response.json();
      showDirection === "desc" ? setItems(json) : setItems(json.reverse());
    } catch (error: any) {
      console.error("Error listing tasks:", error);
    }
  };

  useEffect(() => {
    listTasks();
  });

  const switchOrdererAndDirection = () => {
    if (showOrderedBy === "DESCRIPTION" && showDirection === "desc") {
      setShowDirection("asc");
    } else if (showOrderedBy === "DESCRIPTION" && showDirection === "asc") {
      setShowOrderedBy("CREATED_AT");
      setShowDirection("desc");
    } else {
      setShowOrderedBy("DESCRIPTION");
    }
  };

  return (
    <div>
      <button className="tasks-header" onClick={switchOrdererAndDirection}>
        Tasks
      </button>
      <ul className="tasks-list">
        {items.map((item) => (
          <ListItem key={item.id} task={item} />
        ))}
      </ul>
      <div className="hide-completed-section">
        <label>
          <b>Hide completed</b>
        </label>
        <input
          type="checkbox"
          className="hide-completed-checkbox"
          checked={showCompleted === "INCOMPLETE"}
          onChange={() => {
            setShowCompleted(showCompleted === "ALL" ? "INCOMPLETE" : "ALL");
          }}
        />
      </div>
    </div>
  );
};

export default TaskList;
