const layoutConfig = {
    name: 'circle',
    padding: 60,
    ready: (e) => {
        e.cy.resize();
        e.cy.fit();
        e.cy.center();
    },
};
const graphStyles = `
  node {
    background-color: lightblue;
    border-color: black;
    border-width: 2px;
    label: data(label);
    font-size: 20px;
    width: 50px;
    height: 50px;
  }
  
   .desktop{
      background-image: url("assets/desktop_windows-outline-white-36dp.svg");
    }
  
   .laptop{
      background-image: url("assets/laptop-outline-white-36dp.svg");
   }
  

  .selected {
    border-width: 4px;
    border-color: black;
    border-style: solid;
  }

  .smartphone{
    background-image: url("assets/smartphone-outline-white-36dp.svg");
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

export { graphStyles, layoutConfig };
//# sourceMappingURL=graph.js.map
