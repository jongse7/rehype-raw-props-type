import type { ComponentType, ReactNode } from "react";
import type { Components } from "react-markdown";
import type { z, ZodType } from "zod";

/**
 * Single schema-component pair with props automatically inferred from schema.
 * @template S - Zod schema type
 */
export type ZodPair<S extends ZodType<any> = ZodType> = Readonly<{
  schema: S;
  component: ComponentType<z.infer<S> & { children?: ReactNode }>;
}>;

/**
 * Mapping of tag names to ZodPair objects.
 * @template M - Record of tag names to Zod schemas
 */
export type ZodPairMap<M extends Record<string, ZodType<any>>> = {
  [K in keyof M]: ZodPair<M[K]>;
};

/**
 * Creates a tightly-bound schema-component pair.
 * No `as const` needed at call site - types are locked by const generics.
 *
 * @template S - Zod schema type
 * @param schema - Zod schema defining component props
 * @param component - React component matching the schema
 * @returns Schema-component pair for use with zodComponents
 *
 * @example
 * ```ts
 * const schema = z.object({ title: z.string() });
 * const Component = ({ title }: { title: string }) => <div>{title}</div>;
 * const pair = zodComponent(schema, Component);
 * ```
 */
export function zodComponent<const S extends ZodType<any>>(
  schema: S,
  component: ComponentType<z.infer<S> & { children?: ReactNode }>
): ZodPair<S> {
  return { schema, component };
}

/**
 * Maps multiple schema-component pairs to a react-markdown components object.
 * Schema-first approach ensures proper type inference without `as const`.
 *
 * @template M - Record of tag names to Zod schemas
 * @param mapping - Object mapping tag names to zodComponent pairs
 * @returns Components object for react-markdown with proper typing
 *
 * @example
 * ```ts
 * const components = zodComponents({
 *   callout: zodComponent(calloutSchema, Callout),
 *   card: zodComponent(cardSchema, Card),
 * });
 *
 * <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
 * ```
 */
export function zodComponents<const M extends Record<string, ZodType<any>>>(
  mapping: ZodPairMap<M>
): Components & {
  [K in keyof M]?: (
    props: z.infer<M[K]> & { children?: ReactNode }
  ) => ReactNode;
} {
  const out: any = {};
  for (const k in mapping) out[k] = mapping[k].component;
  return out;
}

export default zodComponents;
