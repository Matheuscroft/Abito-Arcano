import { IconButton as ChakraIconButton } from '@chakra-ui/react'
import type { IconButtonProps } from '@chakra-ui/react'
import * as React from 'react'
import { LuX } from 'react-icons/lu'

interface CloseButtonProps extends Omit<IconButtonProps, 'children'> {
  children?: React.ReactNode
}

export const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  (props, ref) => {
    return (
      <ChakraIconButton
        aria-label="Close"
        ref={ref}
        variant="ghost"
        {...props}
      >
        {props.children ?? <LuX />}
      </ChakraIconButton>
    )
  }
)
