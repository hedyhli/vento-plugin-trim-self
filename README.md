# Trim Self

[![Deno tests](https://github.com/hedyhli/vento-plugin-trim-self/actions/workflows/deno.yml/badge.svg)](https://github.com/hedyhli/vento-plugin-trim-self/actions/workflows/deno.yml)

Remove trailing newline and leading indent on **tags that do not replace
itself with content**, only.

Similar to [autoTrim](https://vento.js.org/plugins/auto-trim/), but does not
trim aggressively. In effect, it makes tags such as `[/]function`, `[/]if`, and
other tags that do not get replaced with content (such as `echo`), appear as
though they were not there.

For such tags that are on a **line of its own**, ie:
- Has optional leading indents preceded directly by a newline, AND
- Either EOF or a newline after it.

Then, only these kind of whitespace are removed:
- Spaces and tabs, preceded by a single newline on its left -- ie, indent --
  replaced by a newline, in other words, dedented.
- One trailing newline on this kind of tags, this single `\n` OR `\r\n` is
  removed;

**No other kind of whitespace around such tags are removed**, unlike autoTrim.

**Table of contents**

<!-- mtoc-start -->

* [Example](#example)
* [Why `trimSelf` when we already have `autoTrim`, or the built in `{{- -}}`?](#why-trimself-when-we-already-have-autotrim-or-the-built-in----)
* [Setup](#setup)
  * [Vento example](#vento-example)
  * [Lume example](#lume-example)
* [Usage](#usage)
* [TODO](#todo)

<!-- mtoc-end -->

## Example

Template:
```
<p>
  Text before.
  {{ set name = "world" }}
  Hello, {{ name }}!
</p>
```

Without trim-self:
```
<p>
  Text before
__
  Hello, world!
</p>
```

Trailing spaces represented as `_`.

After trim-self:
```
<p>
  Text before.
  Hello, {{ name }}!
</p>
```

Here's the step-by-step transformation for the `{{ set ... }}` tag:

<ol>
<li>

```
<p>
  Text before.
  {{ set name = "world" }}
  Hello, {{ name }}!
</p>
```

</li>
<li>

```
<p>
  Text before.
  {{ set name = "world" }}  Hello, {{ name }}!
</p>
```

</li>
<li>

```
<p>
  Text before.
{{ set name = "world" }}  Hello, {{ name }}!
</p>
```

</li>
<li>

After vento's processing:
```
<p>
  Text before.
  Hello, {{ name }}!
</p>
```

```
<p>
  Text before.
  Hello, world!
</p>
```

</li>
</ol>

Check out the [tests](./trimSelf.test.ts) for self-documenting examples.


## Why `trimSelf` when we already have `autoTrim`, or the built in `{{- -}}`?

Auto-trim does a great job at doing what it's supposed to do, but both auto-trim
and the built in trimming functionality (similar to Go templates), removes
whitespace too aggressively.

For instance, consider this template:

```
Inline{{ if true }} test{{ /if }}
- {{ if true }}List item.{{ else }}Other list item.{{ /if }}
Some text after.
```

With autoTrim, it would be transformed into:

```
Inline test-List item.Some text after.
```

Trim-self does what you expect out of a plugin that will simply "make template
tags produce code such that it was as though they weren't there."

```
Inline test
- List item.
Some text after.
```

Furthermore, `autoTrim` will remove trailing spaces followed by a newline, while
this may desirable **in general**, `trimSelf` does not do this because this
functionality should be delegated to editors and tooling.

## Setup

### Vento example

```ts
import trimSelf from "https://deno.land/x/vento_plugin_trim_self/mod.ts"

env.use(trimSelf());
```

### Lume example

```ts
import lume from "lume/mod.ts";
import vento from "lume/plugins/vento.ts";
import trimSelf from "https://deno.land/x/vento_plugin_trim_self/mod.ts";

const site = lume();
site.use(vento({
  plugins: [trimSelf()],
  options: {},
}))

export default site;
```

## Usage

Trim-self does its job automatically.

## TODO

Support filters, by binding them to the left most (but closest) tag. Or at least
add docs on how to workaround this.
