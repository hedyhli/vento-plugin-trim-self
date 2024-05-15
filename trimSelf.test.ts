import tmpl from "https://deno.land/x/vento@v0.12.5/mod.ts";
import trimSelf from "./src/mod.ts";
import { assertEquals } from "https://deno.land/std@0.205.0/assert/assert_equals.ts";

Deno.test("Indent", async () => {
  const code = `
    {{ echo "hi" }}
`;

  const env = tmpl();
  env.use(trimSelf());

  const result = await env.runString(code);
  assertEquals(result.content, "\n    hi\n");
});

Deno.test("Trailing with echo", async () => {
  const code = `
{{ echo "hi" }}    \n`;

  const env = tmpl();
  env.use(trimSelf());

  const result = await env.runString(code);
  assertEquals(result.content, "\nhi    \n");
});

Deno.test("More indent", async () => {
  const code = `
{{ if true }}
  {{ echo "hi" }}
{{ /if }}
`;

  const env = tmpl();
  env.use(trimSelf());

  const result = await env.runString(code);
  assertEquals(result.content, "\n  hi\n");
});

Deno.test("Middle - Don't trim", async () => {
  const code = `prefix  {{ echo "hi" }} suffix`;

  const env = tmpl();
  env.use(trimSelf());

  const result = await env.runString(code);
  assertEquals(result.content, "prefix  hi suffix");
});

Deno.test("Variables", async () => {
  const code = `{{ set a = "a" }}
  {{ a }}
`;

  const env = tmpl();
  env.use(trimSelf());

  const result = await env.runString(code);
  assertEquals(result.content, "  a\n");
});

Deno.test("Don't trim echo", async () => {
  const code = `{{ echo "a" }}

{{ echo "b" }}
`;

  const env = tmpl();
  env.use(trimSelf());

  const result = await env.runString(code);
  assertEquals(result.content, "a\n\nb\n");
});

Deno.test("Trailing without echo", async () => {
  const code = `{{ if true }}a{{ /if }}    \n`;

  const env = tmpl();
  env.use(trimSelf());

  const result = await env.runString(code);
  assertEquals(result.content, "a    \n");
});

Deno.test("Smart trim leading", async () => {
  const code = `
  {{ if true }}a{{ /if }}
`;

  const env = tmpl();
  env.use(trimSelf());

  const result = await env.runString(code);
  assertEquals(result.content, "\n  a");
});

Deno.test("autoTrim example + Smart trim leading", async () => {
  const code = `
{{ if true }}
  Hello, {{ name }}!
  {{ set variable = 10 }}
{{ /if }}`;

  const env = tmpl();
  env.use(trimSelf());

  const result = await env.runString(code, { name: "world" });
  assertEquals(result.content, "\n  Hello, world!\n");
});

Deno.test("Gemini demo", async () => {
  const code = `
# {{ title }}

Tags: {{ tags }}
{{ if date }}
Published: {{ date }}
{{ /if }}
`;

  const env = tmpl();
  env.use(trimSelf());

  const result = await env.runString(code, { title: "Title", tags: "post", date: "2000" });
  assertEquals(result.content, `
# Title

Tags: post
Published: 2000
`);
});

Deno.test("With many indents", async () => {
  const code = `
<p>
  {{ if true }}
    {{ set name = "world" }}
    Hello, {{ name }}!
  {{ /if }}
</p>
`;

  const env = tmpl();
  env.use(trimSelf());

  const result = await env.runString(code);
  assertEquals(result.content, `
<p>
    Hello, world!
</p>
`);
});

Deno.test("Sandwiched", async () => {
  const code = `{{ a }} {{ if true }}B{{ /if }} C`;

  const env = tmpl();
  env.use(trimSelf());

  const result = await env.runString(code, {a: 'A'});
  assertEquals(result.content, "A B C");
});

Deno.test("Sandwiched with previous trim", async () => {
  const code = `{{ set someTag = "A" }}
{{ someTag }} {{ if true }}B{{ /if }}`;

  const env = tmpl();
  env.use(trimSelf());

  const result = await env.runString(code);
  assertEquals(result.content, "A B");
});

Deno.test("Previous trim but sandwiched not both by tags", async () => {
  const code = `{{ set someTag = "C" }}
A {{ if true }}B{{ /if }}`;

  const env = tmpl();
  env.use(trimSelf());

  const result = await env.runString(code);
  assertEquals(result.content, "A B");
});

Deno.test("Previous trim but sandwiched one by echo", async () => {
  const code = `{{ set someTag = "C" }}
{{ echo "A" }} {{ if true }}B{{ /if }}`;

  const env = tmpl();
  env.use(trimSelf());

  const result = await env.runString(code);
  assertEquals(result.content, "A B");
});
