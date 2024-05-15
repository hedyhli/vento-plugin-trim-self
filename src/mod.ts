import type { Token } from "https://deno.land/x/vento@v0.12.5/src/tokenizer.ts";
import type { Environment } from "https://deno.land/x/vento@v0.12.5/src/environment.ts";

export default function () {
  return (env: Environment) => {
    env.tokenPreprocessors.push((_, tokens) => trimSelf(tokens));
  };
}

const transformTags = [
  ">",
  "#",
  "set",
  "/set",
  "if",
  "/if",
  "else",
  "for",
  "/for",
  "function",
  "async",
  "/function",
  "export",
  "/export",
  "import",
];

export function trimSelf(tokens: Token[]) {
  for (let i = 0; i < tokens.length; i++) {
    const
      prev = tokens[i-1],
      [type, token] = tokens[i],
      next = tokens[i+1];

    if (type === "tag" && transformTags.find((t) => token.startsWith(t))) {
      // If it's a tag on a line of its own...
      if (
        prev && /\n[ \t]*$/.test(prev[1])     // Indent, and a \n on the left
          && (next === undefined
            || /^(?:\r\n|^\n)/.test(next[1])) // Nothing else on the right
      ) {
        // ... then remove leading indent
        prev[1] = prev[1].replace(/\n[ \t]*$/, "\n");
      }

      // Special case: this might happen due to previous trimming by this plugin
      if (prev) {
        prev[1] = prev[1].replace(/^[ \t]+$/, "");
      }

      // Remove trailing newline. Does *not* remove trailing whitespace. That's
      // the job of the programmer's editor/tooling.
      if (next) {
        tokens[i+1][1] = next[1].replace(/^(?:\r\n|^\n)/, "");
      }
    }
  }
}
