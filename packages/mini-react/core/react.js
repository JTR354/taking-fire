import { TEXT_ELEMENT } from "./constants.js";

let wipRoot = null;
let currentRoot = null;
let nextUnitOfWork = null;
requestIdleCallback(workLoop);

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

export function render(vnode, el) {
  wipRoot = {
    dom: el,
    props: {
      children: [vnode],
    },
  };
  nextUnitOfWork = wipRoot;
}
export function update() {
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  };
  nextUnitOfWork = wipRoot;
}

function workLoop(idleDeadline) {
  let shouldYield = false;
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performanceUnitWork(nextUnitOfWork);

    shouldYield = idleDeadline.timeRemaining() < 1;
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

function commitRoot() {
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  if (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom);
    }
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDOM(fiber.type));
    updateProps(dom, fiber.props);
  }
  const children = fiber.props.children;
  reconcileChildren(fiber, children);
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
function updateProps(dom, nextProps, prevProps = {}) {
  // 1. the older exist and the newer not exist, need remove
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });
  // 2. the older not exist and the newer exist, need add
  // 3. the older exist and the newer exist, need update

  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (prevProps[key] !== nextProps[key]) {
        if (key.startsWith("on")) {
          const evenType = key.slice(2).toLowerCase();
          dom.removeEventListener(evenType, prevProps[key]);
          dom.addEventListener(evenType, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  });
}

function createDOM(type) {
  return type === TEXT_ELEMENT
    ? document.createTextNode("")
    : document.createElement(type);
}

function reconcileChildren(fiber, children) {
  let prevChild = null;
  let olderFiber = fiber.alternate?.child;
  children.forEach((child, index) => {
    const isSameFiber = olderFiber && olderFiber.type === child.type;
    let newFiber = null;
    if (isSameFiber) {
      newFiber = {
        sibling: null,
        child: null,
        parent: fiber,
        type: child.type,
        props: child.props,
        dom: olderFiber.dom,
        alternate: olderFiber,
        effectTag: "update",
      };
    } else {
      newFiber = {
        sibling: null,
        child: null,
        parent: fiber,
        type: child.type,
        props: child.props,
        dom: null,
        effectTag: "placement",
      };
    }
    if (olderFiber) {
      olderFiber = olderFiber.sibling;
    }
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}
