export const layoutConfig = {
  name: 'circle',
  startAngle: (4 / 2) * Math.PI,
  ready: (e) => {
    const nodes = e.cy.nodes();
    e.cy.resize();
    e.cy.fit(nodes, nodes.length < 3 ? 170 : 0);
    e.cy.center();
  },
};

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

  .cell {
    
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

  .network-request {
    width: 10px;
    height: 10px;
    background-color: grey;
    border-width: 0px;
  }
`;
