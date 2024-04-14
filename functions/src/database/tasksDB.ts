import {getFirestore} from "firebase-admin/firestore";
import CONSTANTS from "../utils/constants";

const TaskDB = {
  createTeam: async (teamId: string, teamName: string, accessToken: string) => {
    await getFirestore()
      .collection(CONSTANTS.TEAM_COLLECTION)
      .doc(teamId)
      .set({
        teamId,
        teamName,
        accessToken,
      });
  },
  addTask: async (
    teamId: string,
    userId: string,
    task: string,
    priority: number
  ) => {
    await getFirestore()
      .collection(CONSTANTS.TEAM_COLLECTION)
      .doc(teamId)
      .collection(CONSTANTS.TODO_COLLECTION)
      .add({
        task,
        priority,
        userId,
        completed: false,
        creationDate: new Date(),
      });
  },
  getTasks: async (teamId: string, userId: string, priority: number):
        Promise<string[]> => {
    const tasks = await getFirestore()
      .collection(CONSTANTS.TEAM_COLLECTION)
      .doc(teamId)
      .collection(CONSTANTS.TODO_COLLECTION)
      .where("userId", "==", userId)
      .where("completed", "==", false)
      .where("priority", "==", priority)
      .orderBy("priority", "asc")
      .orderBy("creationDate", "asc")
      .get();
    return tasks.docs.map((doc) => doc.data().task);
  },
  getTask: async (
    teamId: string,
    userId: string,
    taskNumber: number
  ): Promise<{ text: string, id: string } | undefined> => {
    const tasks = await getFirestore()
      .collection(CONSTANTS.TEAM_COLLECTION)
      .doc(teamId)
      .collection(CONSTANTS.TODO_COLLECTION)
      .where("userId", "==", userId)
      .where("completed", "==", false)
      .orderBy("priority", "asc")
      .orderBy("creationDate", "asc")
      .get();
    const task = tasks.docs[taskNumber];
    if (!task) {
      return undefined;
    }
    return {
      text: task.data().task,
      id: task.id,
    };
  },
  markTaskAsComplete: async (teamId: string, taskId: string): Promise<void> => {
    await getFirestore()
      .collection(CONSTANTS.TEAM_COLLECTION)
      .doc(teamId)
      .collection(CONSTANTS.TODO_COLLECTION)
      .doc(taskId)
      .set({completed: true, completedDate: new Date()});
  },
  changeTaskPriority: async (
    teamId: string,
    taskId: string,
    priority: number
  ): Promise<void> => {
    await getFirestore()
      .collection(CONSTANTS.TEAM_COLLECTION)
      .doc(teamId)
      .collection(CONSTANTS.TODO_COLLECTION)
      .doc(taskId)
      .set({priority, creationDate: new Date()});
  },
  deleteTask: async (teamId: string, taskId: string): Promise<void> => {
    await getFirestore()
      .collection(CONSTANTS.TEAM_COLLECTION)
      .doc(teamId)
      .collection(CONSTANTS.TODO_COLLECTION)
      .doc(taskId)
      .delete();
  },
};

export default TaskDB;
