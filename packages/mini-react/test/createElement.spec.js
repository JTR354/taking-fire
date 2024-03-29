import { describe, it, expect } from "vitest";
import { createElement } from "../core/react";

describe("createElement", () => {
  it("should be return vnode", () => {
    const el = createElement("div", { id: "id", className: "red" }, "hi");

    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hi",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
          "className": "red",
          "id": "id",
        },
        "type": "div",
      }
    `);
  });

  it("should be empty children", () => {
    const el = createElement("div", null);
    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [],
        },
        "type": "div",
      }
    `);
  });

  it("should be return multi children", () => {
    const el = createElement("div", null, "mini-", "react");
    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "mini-",
              },
              "type": "TEXT_ELEMENT",
            },
            {
              "props": {
                "children": [],
                "nodeValue": "react",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
        },
        "type": "div",
      }
    `);
  });
});
