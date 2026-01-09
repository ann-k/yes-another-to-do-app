/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import type { Task } from "./useTasks";

type TaskCardProps = {
  task: Task;
  isEditMode: boolean;
  isEditing: boolean;
  isExpanded: boolean;
  onToggleCompleted: () => void;
  onToggleExpanded: () => void;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onUpdateText: (text: string) => void;
  onDelete: () => void;
};

const isLongText = (text: string): boolean => text.length > 80;

export function TaskCard({
  task,
  isEditMode,
  isEditing,
  isExpanded,
  onToggleCompleted,
  onToggleExpanded,
  onStartEditing,
  onStopEditing,
  onUpdateText,
  onDelete,
}: TaskCardProps) {
  return (
    <div
      css={css`
        background: ${task.completed && !isEditMode
          ? "var(--color-task-done)"
          : "var(--color-task)"};
        border-radius: 8px;
        padding: 12px 16px;
        display: flex;
        align-items: flex-start;
        gap: 8px;
        min-width: 120px;
        max-width: 400px;
        flex-shrink: 0;
      `}
    >
      {!isEditMode && (
        <div
          onClick={onToggleCompleted}
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border: 2px solid
              ${task.completed ? "var(--color-accent)" : "var(--color-border)"};
            border-radius: 50%;
            cursor: pointer;
            flex-shrink: 0;
            margin-top: 2px;
            background: ${task.completed
              ? "var(--color-accent)"
              : "transparent"};
            transition: all 0.15s ease;
            &:hover {
              border-color: var(--color-accent);
            }
          `}
        >
          <span
            css={css`
              color: white;
              font-size: 12px;
              font-weight: bold;
              opacity: ${task.completed ? 1 : 0};
            `}
          >
            ✓
          </span>
        </div>
      )}

      {isEditMode ? (
        isEditing ? (
          <input
            autoFocus
            value={task.text}
            placeholder="Task text..."
            onChange={(e) => onUpdateText(e.target.value)}
            onBlur={onStopEditing}
            onKeyDown={(e) => {
              if (e.key === "Enter") onStopEditing();
            }}
            css={css`
              flex: 1;
              border: none;
              background: transparent;
              font-size: inherit;
              font-family: inherit;
              outline: none;
              min-width: 100px;
              &::placeholder {
                color: var(--color-muted);
              }
            `}
          />
        ) : (
          <span
            onClick={onStartEditing}
            css={css`
              flex: 1;
              word-break: break-word;
              line-height: 1.4;
              cursor: pointer;
              ${!isExpanded &&
              `
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
              `}
            `}
          >
            {task.text || "Click to edit..."}
          </span>
        )
      ) : (
        <span
          css={css`
            flex: 1;
            word-break: break-word;
            line-height: 1.4;
            ${!isExpanded &&
            `
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
            `}
          `}
        >
          {task.text}
        </span>
      )}

      {!isEditMode && isLongText(task.text) && (
        <button
          onClick={onToggleExpanded}
          css={css`
            background: none;
            border: none;
            color: var(--color-muted);
            cursor: pointer;
            padding: 0;
            font-size: 14px;
            flex-shrink: 0;
            align-self: flex-end;
            &:hover {
              color: var(--color-accent);
            }
          `}
        >
          {isExpanded ? "↑≡" : "↓≡"}
        </button>
      )}

      {isEditMode && (
        <button
          onClick={onDelete}
          css={css`
            background: none;
            border: none;
            color: var(--color-muted);
            cursor: pointer;
            padding: 0;
            font-size: 16px;
            flex-shrink: 0;
            &:hover {
              color: var(--color-danger);
            }
          `}
        >
          🗑
        </button>
      )}
    </div>
  );
}
