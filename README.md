# rehype-raw-props-type v0.2.1

> An ultra-minimal, **type-only** helper that wires **Zod v4** schemas to your **custom components** in `react-markdown` (with `rehype-raw`), providing **perfect props type-safety**.
>
> Focused purely on type inference, with **no runtime validation**.

## Install

```bash
# npm
npm i rehype-raw-props-type

# yarn
yarn add rehype-raw-props-type

# pnpm
pnpm add rehype-raw-props-type
```

**Peer dependencies:**

```bash
npm i react react-markdown zod
# or: yarn add / pnpm add
```

## Why

- ✅ Compile-time type safety for custom elements in react-markdown
- ✅ Zero runtime overhead — purely type-level
- ✅ Schema-first approach: props stay in sync with schemas
- ✅ Works with rehype plugins like `rehype-raw` (sanitization is your call)

## Usage

```tsx
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { z } from "zod";
import zodComponents, { zodComponent } from "rehype-raw-props-type";

// 1) Define schemas
const calloutSchema = z.object({
  type: z.enum(["info", "warn", "error"]).default("info"),
  title: z.string().optional(),
  description: z.string(),
});

const cardSchema = z.object({
  title: z.string(),
  badge: z.string().optional(),
  content: z.string(),
});

// 2) Implement components with inferred props (example-only typing)
type CalloutProps = z.infer<typeof calloutSchema>;
const Callout = ({ type, title, description }: CalloutProps) => (
  <div className={`callout callout-${type}`}>
    {title && <strong>{title}</strong>}
    <p>{description}</p>
  </div>
);

type CardProps = z.infer<typeof cardSchema>;
const Card = ({ title, badge, content }: CardProps) => (
  <div className="card">
    <h3>
      {title} {badge && <span className="badge">{badge}</span>}
    </h3>
    <p>{content}</p>
  </div>
);

// 3) Map once: { tag: zodComponent(schema, component) }
const components = zodComponents({
  callout: zodComponent(calloutSchema, Callout),
  card: zodComponent(cardSchema, Card),
});

// 4) Use with react-markdown
export default function Article({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components}>
      {markdown}
    </ReactMarkdown>
  );
}
```

## Markdown example

```markdown
# My Article

<callout type="info" title="Note" description="This is an info callout" />

<card title="Feature Card" badge="New" content="Check out this new feature!" />

Regular markdown content continues here...
```

## API

### `zodComponent(schema, component)`

Create a schema–component pair with automatic prop inference.

- **`schema`**: Zod schema for the component's props
- **`component`**: React component that matches `z.infer<typeof schema>`
- **Returns**: A pair to be used inside `zodComponents`

### `zodComponents(mapping)`

Produce a react-markdown `components` map with full type safety.

- **`mapping`**: `{ [tagName]: zodComponent(schema, component) }`
- **Returns**: An object compatible with `ReactMarkdown`'s `components` prop

_This library is type-only. It does not parse/sanitize/validate props at runtime._

## Notes

- **Tag matching**: Keys in `zodComponents({...})` must match the element/tag names used in your content (`<callout .../>`, `<card .../>`, …).
- **Security**: If you allow raw HTML with `rehype-raw`, consider adding `rehype-sanitize` for untrusted content.
- **TypeScript**: Requires TS 5.0+ (TS 5.3+ recommended for best inference & d.ts fidelity).

## License

MIT
