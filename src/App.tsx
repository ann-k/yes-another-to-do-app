/** @jsxImportSource @emotion/react */
import { useState, Fragment, useRef } from "react";
import { css, Global } from "@emotion/react";

import { globalStyles } from "./globalStyles";
import { useTasks, type Task } from "./useTasks";
import { TaskCard } from "./TaskCard";

function TaskChain({
  chain,
  isEditMode,
  editingTaskId,
  expandedTasks,
  onToggleCompleted,
  onToggleExpanded,
  onStartEditing,
  onStopEditing,
  onUpdateText,
  onDelete,
  onAddSubtask,
}: {
  chain: Task[];
  isEditMode: boolean;
  editingTaskId: string | null;
  expandedTasks: Set<string>;
  onToggleCompleted: (taskId: string) => void;
  onToggleExpanded: (taskId: string) => void;
  onStartEditing: (taskId: string) => void;
  onStopEditing: () => void;
  onUpdateText: (taskId: string, text: string) => void;
  onDelete: (taskId: string) => void;
  onAddSubtask: (parentId: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      css={css`
        display: flex;
        align-items: flex-start;
        gap: 16px;
        overflow-x: auto;
        padding-bottom: 8px;

        &::-webkit-scrollbar {
          height: 4px;
        }
        &::-webkit-scrollbar-track {
          background: var(--color-bg);
          border-radius: 2px;
        }
        &::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: 2px;
        }
      `}
    >
      {chain.map((task, index) => (
        <Fragment key={task.id}>
          {index > 0 && (
            <span
              css={css`
                color: var(--color-muted);
                font-size: 18px;
                flex-shrink: 0;
                align-self: center;
              `}
            >
              →
            </span>
          )}

          <TaskCard
            task={task}
            isEditMode={isEditMode}
            isEditing={editingTaskId === task.id}
            isExpanded={expandedTasks.has(task.id)}
            onToggleCompleted={() => onToggleCompleted(task.id)}
            onToggleExpanded={() => onToggleExpanded(task.id)}
            onStartEditing={() => onStartEditing(task.id)}
            onStopEditing={onStopEditing}
            onUpdateText={(text) => onUpdateText(task.id, text)}
            onDelete={() => onDelete(task.id)}
          />

          {isEditMode && !task.subtaskId && index === chain.length - 1 && (
            <>
              <span
                css={css`
                  color: var(--color-muted);
                  font-size: 18px;
                  flex-shrink: 0;
                  align-self: center;
                `}
              >
                →
              </span>
              <div
                onClick={() => onAddSubtask(task.id)}
                css={css`
                  background: transparent;
                  border: 2px dashed var(--color-border);
                  border-radius: 8px;
                  padding: 12px 16px;
                  min-width: 80px;
                  min-height: 44px;
                  flex-shrink: 0;
                  cursor: pointer;
                `}
              />
            </>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export function App() {
  const {
    getRootTasks,
    getChain,
    toggleCompleted,
    updateTaskText,
    deleteTask,
    addRootTask,
    addSubtask,
  } = useTasks();

  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const toggleExpanded = (taskId: string) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const handleAddRootTask = () => {
    const id = addRootTask();
    setEditingTaskId(id);
  };

  const handleAddSubtask = (parentId: string) => {
    const id = addSubtask(parentId);
    setEditingTaskId(id);
  };

  const rootTasks = getRootTasks();

  return (
    <>
      <Global styles={globalStyles} />
      <div
        css={css`
          max-width: 100%;
        `}
      >
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
          `}
        >
          <h1
            css={css`
              font-size: 24px;
              font-weight: 600;
            `}
          >
            To do
          </h1>

          <button onClick={() => setIsEditMode((prev) => !prev)}>
            {isEditMode ? "Save" : "Edit"}
          </button>
        </div>

        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 24px;
          `}
        >
          {rootTasks.map((rootTask) => (
            <TaskChain
              key={rootTask.id}
              chain={getChain(rootTask.id)}
              isEditMode={isEditMode}
              editingTaskId={editingTaskId}
              expandedTasks={expandedTasks}
              onToggleCompleted={toggleCompleted}
              onToggleExpanded={toggleExpanded}
              onStartEditing={setEditingTaskId}
              onStopEditing={() => setEditingTaskId(null)}
              onUpdateText={updateTaskText}
              onDelete={deleteTask}
              onAddSubtask={handleAddSubtask}
            />
          ))}

          {isEditMode && (
            <div
              css={css`
                display: flex;
                align-items: flex-start;
                gap: 16px;
                overflow-x: auto;
                padding-bottom: 8px;
              `}
            >
              <div
                onClick={handleAddRootTask}
                css={css`
                  background: transparent;
                  border: 2px dashed var(--color-border);
                  border-radius: 8px;
                  padding: 12px 16px;
                  min-width: 400px;
                  min-height: 44px;
                  flex-shrink: 0;
                  cursor: pointer;
                `}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
