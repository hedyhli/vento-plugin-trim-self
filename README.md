# Trim Self

Remove trailing newline and leading indent on **tags that do not replace
itself with content**, only.

Similar to [autoTrim](https://vento.js.org/plugins/auto-trim/), but does not
trim aggressively. In effect, it makes tags such as `[/]function`, `[/]if`, and
other tags that do not get replaced with content (such as `echo`), appear as
though they were not there.

Only these kind of whitespace are removed:
- Spaces and tabs, preceded by a single newline -- in other words, indents. This
  is replaced by a single newline -- in other words, indents removed.
- One trailing newline on this kind of tags, this single `\n` OR `\r\n` is
  removed.

**No other kind of whitespace around such tags are removed**, unlike autoTrim.

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
Inline {{ if true }}test{{ /if }}

- {{ if true }}List item{{ else }}Other list item{{ /if }}
```

With autoTrim, it would be transformed into:

```
Inlinetest

-List item
```

Trim-self does what you expect out of a plugin that will simply "make template
tags produce code such that it was as though they weren't there."

```
Inline test

- List item
```

Furthermore, `autoTrim` will remove trailing spaces followed by a newline, while
this may desirable **in general**, `trimSelf` does not do this because this
functionality should be delegated to editors and tooling.

