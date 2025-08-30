import { Field as ChakraField } from "@chakra-ui/react";
import * as React from "react";

interface FieldProps extends React.ComponentPropsWithoutRef<typeof ChakraField.Root> {
  label?: string;
  children: React.ReactNode;
  helperText?: string;
  errorText?: string;
  optionalText?: string;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, children, helperText, errorText, optionalText, ...rest },
  ref
) {
  return (
    <ChakraField.Root ref={ref} {...rest}>
      {label && (
        <ChakraField.Label>
          {label}
          <ChakraField.RequiredIndicator fallback={optionalText} />
        </ChakraField.Label>
      )}
      {children}
      {helperText && <ChakraField.HelperText>{helperText}</ChakraField.HelperText>}
      {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
    </ChakraField.Root>
  );
});