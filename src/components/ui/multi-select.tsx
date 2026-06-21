"use client";

import * as React from "react";
import { Combobox } from "@base-ui/react/combobox";
import { CheckIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type MultiSelectOption = { value: string; label: string };

type MultiSelectProps = {
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  id?: string;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * A searchable, tag-style multi-select built on Base UI's Combobox (chips
 * variant). Operates purely on string ids; labels are looked up from
 * `options`. Filtering is handled by the combobox using `itemToStringLabel`.
 */
export function MultiSelect({
  options,
  value,
  onValueChange,
  id,
  placeholder = "Search…",
  emptyText = "No matches.",
  disabled,
  className,
}: MultiSelectProps) {
  const labelFor = React.useCallback(
    (v: string) => options.find((o) => o.value === v)?.label ?? v,
    [options],
  );
  const items = React.useMemo(() => options.map((o) => o.value), [options]);

  return (
    <Combobox.Root
      items={items}
      multiple
      value={value}
      onValueChange={(next) => onValueChange((next ?? []) as string[])}
      itemToStringLabel={labelFor}
      disabled={disabled}
    >
      <Combobox.Chips
        className={cn(
          "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-2 py-1.5 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-disabled:cursor-not-allowed has-disabled:opacity-50",
          className,
        )}
      >
        <Combobox.Value>
          {(selected: string[]) =>
            selected.map((v) => (
              <Combobox.Chip
                key={v}
                className="flex items-center gap-1 rounded-md bg-secondary py-0.5 pl-2 pr-1 font-press text-[11px] uppercase tracking-wide text-secondary-foreground"
                aria-label={labelFor(v)}
              >
                {labelFor(v)}
                <Combobox.ChipRemove
                  className="flex size-4 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                  aria-label={`Remove ${labelFor(v)}`}
                >
                  <XIcon className="size-3" />
                </Combobox.ChipRemove>
              </Combobox.Chip>
            ))
          }
        </Combobox.Value>
        <Combobox.Input
          id={id}
          placeholder={value.length === 0 ? placeholder : undefined}
          className="min-w-24 flex-1 bg-transparent py-0.5 text-sm outline-none placeholder:text-muted-foreground"
        />
      </Combobox.Chips>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4} className="isolate z-50">
          <Combobox.Popup className="admin max-h-(--available-height) w-(--anchor-width) min-w-[12rem] origin-(--transform-origin) overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <Combobox.Empty className="px-2 py-3 text-center font-press text-[11px] uppercase tracking-wider text-muted-foreground">
              {emptyText}
            </Combobox.Empty>
            <Combobox.List>
              {(v: string) => (
                <Combobox.Item
                  key={v}
                  value={v}
                  className="relative flex cursor-default items-center gap-2 rounded-md py-1.5 pl-2 pr-8 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                >
                  <span className="flex-1">{labelFor(v)}</span>
                  <Combobox.ItemIndicator className="absolute right-2 flex size-4 items-center justify-center">
                    <CheckIcon className="size-4" />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
