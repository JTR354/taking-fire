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

function performanceUnitWork(work) {
  const isFunctionComponent = (type) => typeof type === "function";
  // 1. create dom
  if (!isFunctionComponent(work.type)) {
    if (!work.dom) {
      const dom = (work.dom = createDOM(work.type));
      // 2. update props
      updateProps(work.props, dom);
      // work.parent.dom.append(dom);
    }
  }
  // 3. transform vnode to fiber
  const children = isFunctionComponent(work.type)
    ? [work.type(work.props)]
    : work.props.children;
  initialChildren(work, children);
  // 4. return next work
  if (work.child) {
    return work.child;
  }

  let nextWork = work;
  while (nextWork) {
    if (nextWork.sibling) return nextWork.sibling;
    nextWork = nextWork.parent;
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
