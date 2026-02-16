import prettier from "prettier";

export async function formatCode(code) {
  return await prettier.format(code, {
    parser: "babel",
    singleQuote: true,
  });
}
