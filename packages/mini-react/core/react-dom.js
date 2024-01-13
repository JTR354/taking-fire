import { TEXT_ELEMENT } from "./constants.js";

function render(vnode, el) {
  // function component
  if (typeof vnode.type === "function") {
    render(vnode.type(vnode.props), el);
    return;
  }
  const dom =
    vnode.type === TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(vnode.type);

  Object.keys(vnode.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = vnode.props[key];
    }
  });

  vnode.props.children.forEach((child) => {
    render(child, dom);
  });

  el.append(dom);
}

export default {
  createRoot(domNode, options) {
    return {
      render(reactNode) {
        render(reactNode, domNode);
      },
    };
  },
};
