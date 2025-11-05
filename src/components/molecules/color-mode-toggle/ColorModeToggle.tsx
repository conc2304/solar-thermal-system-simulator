import { Moon, Sun } from 'lucide-react';
import { useColorMode, type ThemeUICSSObject } from 'theme-ui';

import { Button } from '@/components/atoms';

interface ColorModeToggleProps {
  /** Additional sx prop for custom styling */
  sxStyles?: ThemeUICSSObject;
  onClick?: (mode: 'dark' | 'light') => void;
}

export const ColorModeToggle = ({
  sxStyles,
  onClick,
}: ColorModeToggleProps) => {
  const [mode, setMode] = useColorMode();

  const handleOnClick = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);

    if (onClick) onClick(next);
  };

  return (
    <Button
      sx={{
        borderRadius: 'pill',
        ...sxStyles,
      }}
      variant="outlined"
      size="sm"
      color="primary"
      onClick={handleOnClick}
      className="ColorModeToggle--root"
    >
      {mode === 'light' ? (
        <Sun sx={{ color: 'inherit' }} />
      ) : (
        <Moon sx={{ color: 'inherit' }} />
      )}
    </Button>
  );
};
