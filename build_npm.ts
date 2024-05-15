import { build, emptyDir } from "https://deno.land/x/dnt@0.40.0/mod.ts";

const version = Deno.args[0];

if (!version) {
  console.log("Run this script with a version argument.")
  Deno.exit(1)
}

await emptyDir("./npm");
await build({
  entryPoints: ["./src/mod.ts"],
  packageManager: "pnpm",
  outDir: "./npm",
  compilerOptions: {
    target: "ES2022",
  },
  scriptModule: false,
  shims: {
    deno: true,
  },
  package: {
    name: "vento-plugin-trim-self",
    version: version,
    description: "Remove a trailing newline and indent around each template tag.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/hedyhli/vento-plugin-trim-self.git",
    },
    bugs: {
      url: "https://github.com/hedyhli/vento-plugin-trim-self/issues",
    },
  },
  mappings: {
    "https://deno.land/x/vento@v0.12.5/src/environment.ts": {
      name: "ventojs",
      version: "^0.12.5",
      peerDependency: true,
      subPath: "src/environment.js",
    },
    "https://deno.land/x/vento@v0.12.5/src/tokenizer.ts": {
      name: "ventojs",
      version: "^0.12.5",
      peerDependency: true,
      subPath: "src/tokenizer.js",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "./npm/LICENSE");
    Deno.copyFileSync("README.md", "./npm/README.md");
  },
});
