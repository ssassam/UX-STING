export interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description?: string;
}

export interface ExportDoc {
  kind: string;
  description?: string;
  props: PropDoc[];
  inherits?: string;
}

export function PropsTable({ name, doc }: { name: string; doc: ExportDoc }) {
  return (
    <section aria-labelledby={`api-${name}`} className="grid gap-2">
      <h3 id={`api-${name}`} className="font-mono text-md font-semibold">{name}</h3>
      {doc.description ? <p className="text-sm text-muted-foreground">{doc.description}</p> : null}
      {doc.props.length ? (
        <div tabIndex={0} role="region" aria-label={`${name} props`} className="overflow-x-auto rounded-lg border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <table className="w-full text-sm">
            <thead className="bg-surface text-start">
              <tr>
                <th scope="col" className="px-3 py-2 text-start font-semibold">Prop</th>
                <th scope="col" className="px-3 py-2 text-start font-semibold">Type</th>
                <th scope="col" className="px-3 py-2 text-start font-semibold">Default</th>
              </tr>
            </thead>
            <tbody>
              {doc.props.map((p) => (
                <tr key={p.name} className="border-t border-border align-top">
                  <td className="px-3 py-2">
                    <code className="font-mono text-[0.8125rem] font-medium">{p.name}{p.required ? <span className="text-destructive" aria-label="required">*</span> : null}</code>
                    {p.description ? <p className="mt-1 text-xs text-muted-foreground">{p.description}</p> : null}
                  </td>
                  <td className="px-3 py-2"><code dir="ltr" className="font-mono text-xs text-primary [overflow-wrap:anywhere]">{p.type}</code></td>
                  <td className="px-3 py-2"><code className="font-mono text-xs">{p.default ?? "—"}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No additional props.</p>
      )}
      {doc.inherits ? <p className="text-xs text-muted-foreground">Also accepts {doc.inherits}.</p> : null}
    </section>
  );
}
