import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { isHexColor } from "@/lib/color";
import { Field } from "./Field";

interface ColorControlProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/** Color swatch plus hex field. The hex field only commits valid #rrggbb values. */
export function ColorControl({ id, label, value, onChange }: ColorControlProps) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);

  const invalid = !isHexColor(draft);

  return (
    <Field id={id} label={label} error={invalid ? "Use a hex color like #8A7352." : undefined}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={isHexColor(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="size-10 shrink-0 cursor-pointer rounded-md border bg-surface p-1"
        />
        <Input
          id={id}
          value={draft}
          maxLength={7}
          spellCheck={false}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-error` : undefined}
          onChange={(e) => {
            const next = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
            setDraft(next);
            if (isHexColor(next)) onChange(next.toUpperCase());
          }}
          className="font-mono uppercase"
        />
      </div>
    </Field>
  );
}
