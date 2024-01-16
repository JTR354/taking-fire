import { TEXT_ELEMENT } from "./constants.js";

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

export function createTextNode(nodeValue) {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue,
      children: [],
    },
  };
}

let root = null;
export function render(vnode, el) {
  nextUnitOfWork = {
    dom: el,
    props: {
      children: [vnode],
    },
  };
  root = nextUnitOfWork;
}

let nextUnitOfWork = null;
function workLoop(idleDeadline) {
  let shouldYield = false;
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performanceUnitWork(nextUnitOfWork);
    if (!nextUnitOfWork && root) {
      commitRoot();
    }

    shouldYield = idleDeadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}

function commitRoot() {
  commitWork(root.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  if (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

requestIdleCallback(workLoop);

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  initialChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDOM(fiber.type));
    updateProps(fiber.props, dom);
  }
  const children = fiber.props.children;
  initialChildren(fiber, children);
}

function performanceUnitWork(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  // 4. return next work
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

export default {
  createElement,
  render,
};
function updateProps(props, dom) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function createDOM(type) {
  return type === TEXT_ELEMENT
    ? document.createTextNode("")
    : document.createElement(type);
}

function initialChildren(fiber, children) {
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      sibling: null,
      child: null,
      parent: fiber,
      type: child.type,
      props: child.props,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}
