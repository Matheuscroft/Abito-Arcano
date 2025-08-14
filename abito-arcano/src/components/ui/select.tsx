"use client";

import {
  Select as ChakraSelect,
  Portal,
  type ListCollection,
} from "@chakra-ui/react";
import { CloseButton } from "./close-button";
import * as React from "react";

interface SelectRootProps {
  collection: ListCollection<{ label: string; value: string }>;
  value: string[];
  onValueChange: (e: { value: string | string[] }) => void;
  size?: "xs" | "sm" | "md" | "lg";
  width?: string;
  children: React.ReactNode;
  asChild?: boolean;
  positioning?: any;
}

interface SelectTriggerProps
  extends React.ComponentProps<typeof ChakraSelect.Control> {
  clearable?: boolean;
  children: React.ReactNode;
}

interface SelectContentProps
  extends React.ComponentProps<typeof ChakraSelect.Content> {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
}

interface SelectItemProps
  extends React.ComponentProps<typeof ChakraSelect.Item> {
  item: { label: string; value: string };
  children: React.ReactNode;
}

interface SelectValueTextProps
  extends React.ComponentProps<typeof ChakraSelect.ValueText> {
  placeholder?: string;
  renderItems?: (items: any[]) => React.ReactNode;
}

interface SelectItemGroupProps
  extends React.ComponentProps<typeof ChakraSelect.ItemGroup> {
  label: string;
  children: React.ReactNode;
}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectTriggerProps
>(({ children, clearable, ...rest }, ref) => {
  return (
    <ChakraSelect.Control {...rest}>
      <ChakraSelect.Trigger ref={ref}>{children}</ChakraSelect.Trigger>
      <ChakraSelect.IndicatorGroup>
        {clearable && <SelectClearTrigger />}
        <ChakraSelect.Indicator />
      </ChakraSelect.IndicatorGroup>
    </ChakraSelect.Control>
  );
});

const SelectClearTrigger = React.forwardRef<HTMLButtonElement, {}>(
  (_props, ref) => {
    return (
      <ChakraSelect.ClearTrigger asChild ref={ref}>
        <CloseButton
          size="xs"
          variant="plain"
          focusVisibleRing="inside"
          focusRingWidth="2px"
          pointerEvents="auto"
        />
      </ChakraSelect.ClearTrigger>
    );
  }
);

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  SelectContentProps
>(({ portalled = true, portalRef, ...rest }, ref) => {
  return (
    <Portal
      disabled={!portalled}
      {...(portalRef ? { container: portalRef } : {})}
    >
      <ChakraSelect.Positioner>
        <ChakraSelect.Content {...rest} ref={ref} />
      </ChakraSelect.Positioner>
    </Portal>
  );
});

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ item, children, ...rest }, ref) => {
    return (
      <ChakraSelect.Item key={item.value} item={item} {...rest} ref={ref}>
        {children}
        <ChakraSelect.ItemIndicator />
      </ChakraSelect.Item>
    );
  }
);

export const SelectValueText = React.forwardRef<
  HTMLDivElement,
  SelectValueTextProps
>(({ renderItems, placeholder, ...rest }, ref) => {
  return (
    <ChakraSelect.ValueText {...rest} ref={ref}>
      <ChakraSelect.Context>
        {(select) => {
          const items = select.selectedItems;
          if (items.length === 0) return placeholder;
          if (renderItems) return renderItems(items);
          if (items.length === 1)
            return select.collection.stringifyItem(items[0]);
          return `${items.length} selected`;
        }}
      </ChakraSelect.Context>
    </ChakraSelect.ValueText>
  );
});

export const SelectRoot = React.forwardRef<HTMLDivElement, SelectRootProps>(
  ({ children, positioning, ...props }, ref) => {
    return (
      <ChakraSelect.Root
        {...props}
        ref={ref}
        positioning={{ sameWidth: true, ...positioning }}
      >
        {props.asChild ? (
          children
        ) : (
          <>
            <ChakraSelect.HiddenSelect />
            {children}
          </>
        )}
      </ChakraSelect.Root>
    );
  }
);

export const SelectItemGroup = React.forwardRef<
  HTMLDivElement,
  SelectItemGroupProps
>(({ children, label, ...rest }, ref) => {
  return (
    <ChakraSelect.ItemGroup {...rest} ref={ref}>
      <ChakraSelect.ItemGroupLabel>{label}</ChakraSelect.ItemGroupLabel>
      {children}
    </ChakraSelect.ItemGroup>
  );
});

export const SelectLabel = ChakraSelect.Label;
export const SelectItemText = ChakraSelect.ItemText;
