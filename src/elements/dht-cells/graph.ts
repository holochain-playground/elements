export const layoutConfig = {
  name: 'circle',
  startAngle: (4 / 2) * Math.PI,
  ready: (e) => {
    e.cy.resize();
  },
};

const demon =
  '<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" fill="yellow"></path></svg>';

export const graphStyles = `
  node {
    background-color: lightblue;
    border-color: black;
    border-width: 2px;
    label: data(label);
    font-size: 20px;
    width: 50px;
    height: 50px;
  }
  
  .selected {
    border-width: 4px;
    border-color: black;
    border-style: solid;
  }

  .highlighted {
    background-color: yellow;
  }

  edge {
    width: 1;
  }

  .network-request {
    target-arrow-shape: triangle;
    label: data(label);
  }

  .neighbor-edge {
    line-style: dotted;
  }

  .far-neighbor-edge {
    line-style: dotted;
    opacity: 0.2;
  }

  .network-request {
    width: 10px;
    height: 10px;
    background-color: grey;
    border-width: 0px;
  }

`;
