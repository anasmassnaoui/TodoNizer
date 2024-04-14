import {initializeApp} from "firebase-admin/app";

import addTask from "./commands/add-task";
import addExtraTask from "./commands/add-extra-task";
import tasks from "./commands/tasks";
import todayTasks from "./commands/today-tasks";
import completeTask from "./commands/complete-task";
import deleteTask from "./commands/delete-task";
import moveToTasks from "./commands/move-to-tasks";
import moveToExtra from "./commands/move-to-extra";
import help from "./commands/help";
import install from "./routes/install";

initializeApp();

export {
  addTask,
  addExtraTask,
  tasks,
  todayTasks,
  completeTask,
  deleteTask,
  moveToTasks,
  moveToExtra,
  help,
  install,
};


