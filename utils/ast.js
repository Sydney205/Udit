import { parse } from "@babel/parser";

import { traverse } from "@babel/types";

// import traverse from "@babel/traverse";
import { generate } from "@babel/generator";
import * as t from "@babel/types";

export function injectMetadata(code, filePath) {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx"],
  });

  traverse(ast, {
    jSXOpeningElement(path) {
      const location = path.node.loc?.start;

      if (!location) return;

      path.node.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("data-source-file"),
          t.stringLiteral(filePath)
        )
      );

      path.node.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("data-source-line"),
          t.stringLiteral(String(location.line))
        )
      );
    },
  });

  return generate(ast, {}, code).code;
}

export function updateClassName(code, targetLine, newClass) {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx"],
  });

  traverse(ast, {
    jSXOpeningElement(path) {
      const line = path.node.loc?.start.line;

      if (line !== targetLine) return;

      const classAttr = path.node.attributes.find(
        (attr) => t.isJSXAttribute(attr) && attr.name.name === "className"
      );

      if (classAttr) {
        classAttr.value = t.stringLiteral(newClass);
      }
    },
  });

  return generate(ast, {}, code).code;
}
