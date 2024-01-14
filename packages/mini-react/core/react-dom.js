import React from "./react";

export default {
  createRoot(domNode, options) {
    return {
      render(reactNode) {
        React.render(reactNode, domNode);
      },
    };
  },
};
