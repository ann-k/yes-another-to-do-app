import { css } from "@emotion/react";

export const globalStyles = css`
  :root {
    --color-bg: #fff;
    --color-task: #dce8ff;
    --color-task-done: #b7f5c4;
    --color-accent: #4a9960;
    --color-border: #c0d0e8;
    --color-muted: #a0a0a0;
    --color-danger: #e05050;
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: system-ui, -apple-system, sans-serif;
    background: var(--color-bg);
    min-height: 100vh;
    padding: 40px;
  }
`;
