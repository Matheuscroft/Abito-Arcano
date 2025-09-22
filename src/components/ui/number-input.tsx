import { NumberInput as ChakraNumberInput } from "@chakra-ui/react";
import * as React from "react";

type OnValueChangeHandler = (value: number) => void;

type NumberInputRootProps = Omit<
  React.ComponentPropsWithoutRef<typeof ChakraNumberInput.Root>,
  "value" | "defaultValue" | "onValueChange"
> & {
  value?: string | number;
  defaultValue?: string | number;
  onValueChange?: OnValueChangeHandler;
};

export const NumberInputRoot = React.forwardRef<
  React.ElementRef<typeof ChakraNumberInput.Root>,
  NumberInputRootProps
>(function NumberInput(
  { children, value, defaultValue, onValueChange, ...rest },
  ref
) {
  return (
    <ChakraNumberInput.Root
      ref={ref}
      variant="outline"
      value={value !== undefined ? String(value) : undefined}
      defaultValue={
        defaultValue !== undefined ? String(defaultValue) : undefined
      }
      onValueChange={(details) => {
        const num = Number(details.value);
        if (!isNaN(num)) {
          onValueChange?.(num);
        }
      }}
      {...rest}
    >
      {children}
      <ChakraNumberInput.Control>
        <ChakraNumberInput.IncrementTrigger />
        <ChakraNumberInput.DecrementTrigger />
      </ChakraNumberInput.Control>
    </ChakraNumberInput.Root>
  );
});

export const NumberInputField = ChakraNumberInput.Input;
export const NumberInputScrubber = ChakraNumberInput.Scrubber;
export const NumberInputLabel = ChakraNumberInput.Label;
