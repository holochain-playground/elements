import { css } from 'lit-element';

export const sharedStyles = css`
  .row {
    display: flex;
    flex-direction: row;
  }
  .column {
    display: flex;
    flex-direction: column;
  }
  .fill {
    flex: 1;
  }

  .center-content {
    align-items: center;
    justify-content: center;
  }

  h3 {
    margin-block-start: 0;
  }

  .title {
    font-size: 20px;
  }

  .placeholder {
    color: grey;
  }

  .flex-scrollable-parent {
    position: relative;
    display: flex;
    flex: 1;
  }

  .flex-scrollable-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .flex-scrollable-y {
    max-height: 100%;
    overflow-y: auto;
  }
`;
