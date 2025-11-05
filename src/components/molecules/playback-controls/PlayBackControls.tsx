import { Pause, Play, Square, StepBack, StepForward } from 'lucide-react';

import { IconButton } from '@/components/atoms';

interface PlaybackControlsProps {
  isPlaying: boolean;

  onStop: () => void;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
}
export const PlaybackControls = ({
  isPlaying,
  onTogglePlay,
  onStop,
  onStepForward,
  onStepBack,
}: PlaybackControlsProps) => {
  return (
    <div
      sx={{
        display: 'flex',
        gap: 3,
        m: 2,
      }}
    >
      <IconButton
        disabled={isPlaying}
        color="muted"
        onClick={onStepBack}
        sx={{
          '&:hover': {
            color: 'secondary',
          },
          '&:disabled': {
            display: 'none',
          },
        }}
      >
        <StepBack />
      </IconButton>

      <IconButton onClick={onTogglePlay} color="primary">
        {isPlaying ? <Pause /> : <Play />}
      </IconButton>

      <IconButton onClick={onStop} color="error">
        <Square />
      </IconButton>

      <IconButton
        disabled={isPlaying}
        color="muted"
        onClick={onStepForward}
        sx={{
          '&:hover': {
            color: 'secondary',
          },
          '&:disabled': {
            display: 'none',
          },
        }}
      >
        <StepForward />
      </IconButton>
    </div>
  );
};
