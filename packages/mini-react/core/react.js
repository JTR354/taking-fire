import { TEXT_ELEMENT } from "./constants.js";

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "string" ? createTextNode(child) : child;
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

function createFiber(vnode, parent = null) {
  if (typeof vnode.type === "function") {
    vnode = vnode.type(vnode.props);
  }
  return {
    child: null,
    sibling: null,
    parent,
    type: vnode.type,
    props: vnode.props,
  };
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
  fiber.parent.dom.append(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

requestIdleCallback(workLoop);

function performanceUnitWork(work) {
  // 1. create dom
  if (!work.dom) {
    const dom = (work.dom = createDOM(work.type));
    // 2. update props
    updateProps(work.props, dom);
    // work.parent.dom.append(dom);
  }
  // 3. transform vnode to fiber
  initialChildren(work);
  // 4. return next work
  if (work.child) {
    return work.child;
  }
  if (work.sibling) {
    return work.sibling;
  }
  return work.parent?.sibling;
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

function initialChildren(work) {
  let prevChild = null;
  work.props.children.forEach((child, index) => {
    const fiber = createFiber(child, work);
    if (index === 0) {
      work.child = fiber;
    } else {
      prevChild.sibling = fiber;
    }
    prevChild = fiber;
  });
}
