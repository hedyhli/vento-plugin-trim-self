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
  let wasTrimmed = false;

  for (let i = 0; i < tokens.length; i++) {
    const
      prev = tokens[i-1],
      [type, token] = tokens[i],
      next = tokens[i+1];

    if (type === "tag" && transformTags.find((t) => token.startsWith(t))) {
      // Special case: this might happen due to previous trimming by this plugin
      if (prev && wasTrimmed) {
        prev[1] = prev[1].replace(/^[ \t]+$/, "");
      }
      wasTrimmed = false;

      // If it's a tag on a line of its own...
      if ((prev[1] === "" || /\n[ \t]*$/.test(prev[1]))   // [Indent], and a \n on the left
          && (next === undefined              // And newline on the right
            || next[1].startsWith("\r") || next[1].startsWith("\n"))
      ) {
        // ... then remove leading indent
        prev[1] = prev[1].replace(/\n[ \t]*$/, "\n");

        // and remove trailing newline. Does *not* remove trailing whitespace.
        if (next && (next[1].startsWith("\r") || next[1].startsWith("\n"))) {
          tokens[i+1][1] = next[1].replace(/^(?:\r\n|^\n)/, "");
          wasTrimmed = true;
        }
      }
    } else if (type == "tag") {
      wasTrimmed = false;
    }
  }
}
