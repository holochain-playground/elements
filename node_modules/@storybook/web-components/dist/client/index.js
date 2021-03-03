"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "storiesOf", {
  enumerable: true,
  get: function get() {
    return _preview.storiesOf;
  }
});
Object.defineProperty(exports, "setAddon", {
  enumerable: true,
  get: function get() {
    return _preview.setAddon;
  }
});
Object.defineProperty(exports, "addDecorator", {
  enumerable: true,
  get: function get() {
    return _preview.addDecorator;
  }
});
Object.defineProperty(exports, "addParameters", {
  enumerable: true,
  get: function get() {
    return _preview.addParameters;
  }
});
Object.defineProperty(exports, "configure", {
  enumerable: true,
  get: function get() {
    return _preview.configure;
  }
});
Object.defineProperty(exports, "getStorybook", {
  enumerable: true,
  get: function get() {
    return _preview.getStorybook;
  }
});
Object.defineProperty(exports, "forceReRender", {
  enumerable: true,
  get: function get() {
    return _preview.forceReRender;
  }
});
Object.defineProperty(exports, "raw", {
  enumerable: true,
  get: function get() {
    return _preview.raw;
  }
});
Object.defineProperty(exports, "getCustomElements", {
  enumerable: true,
  get: function get() {
    return _customElements.getCustomElements;
  }
});
Object.defineProperty(exports, "setCustomElements", {
  enumerable: true,
  get: function get() {
    return _customElements.setCustomElements;
  }
});
Object.defineProperty(exports, "isValidComponent", {
  enumerable: true,
  get: function get() {
    return _customElements.isValidComponent;
  }
});
Object.defineProperty(exports, "isValidMetaData", {
  enumerable: true,
  get: function get() {
    return _customElements.isValidMetaData;
  }
});

var _preview = require("./preview");

var _customElements = require("./customElements");

// TODO: disable HMR and do full page loads because of customElements.define
if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}