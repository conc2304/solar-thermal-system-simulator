import { forwardRef } from 'react';

import { Button, type ButtonProps } from '../button';

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, color = 'primary', size = 'md', sx, ...rest }, ref) => {
    return (
      <Button
        sx={{
          borderRadius: 'pill',
          p: 2,
          ...sx,
        }}
        ref={ref}
        variant="outlined"
        size={size}
        color={color}
        className="IconButton--root"
        {...rest}
      >
        {children}
      </Button>
    );
  }
);
