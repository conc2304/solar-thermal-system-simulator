import { useColorMode } from 'theme-ui';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/atoms';

export const ColorModeToggle = () => {
  const [mode, setMode] = useColorMode();

  return (
    <Button
      sx={{
        borderRadius: 'pill',
      }}
      variant="outlined"
      size="sm"
      color="primary"
      onClick={() => {
        const next = mode === 'dark' ? 'light' : 'dark';
        setMode(next);
      }}
    >
      {mode === 'light' ? (
        <Sun sx={{ color: 'inherit' }} />
      ) : (
        <Moon sx={{ color: 'inherit' }} />
      )}
    </Button>
  );
};
