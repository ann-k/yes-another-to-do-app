import { useState, useEffect } from "react";

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  subtaskId: string | null;
};

const STORAGE_KEY = "todo-tasks";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const getRootTasks = (): Task[] => {
    const subtaskIds = new Set(tasks.map((t) => t.subtaskId).filter(Boolean));
    return tasks.filter((t) => !subtaskIds.has(t.id));
  };

  const getChain = (taskId: string): Task[] => {
    const chain: Task[] = [];
    let currentId: string | null = taskId;

    while (currentId) {
      const task = tasks.find((t) => t.id === currentId);
      if (!task) break;
      chain.push(task);
      currentId = task.subtaskId;
    }

    return chain;
  };

  const toggleCompleted = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const updateTaskText = (taskId: string, text: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, text } : t)));
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.subtaskId === taskId ? { ...t, subtaskId: null } : t
      );
      return updated.filter((t) => t.id !== taskId);
    });
  };

  const addRootTask = (): string => {
    const newTask: Task = {
      id: generateId(),
      text: "",
      completed: false,
      subtaskId: null,
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask.id;
  };

  const addSubtask = (parentId: string): string => {
    const newTask: Task = {
      id: generateId(),
      text: "",
      completed: false,
      subtaskId: null,
    };
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === parentId ? { ...t, subtaskId: newTask.id } : t
      );
      return [...updated, newTask];
    });
    return newTask.id;
  };

  return {
    tasks,
    getRootTasks,
    getChain,
    toggleCompleted,
    updateTaskText,
    deleteTask,
    addRootTask,
    addSubtask,
  };
}
