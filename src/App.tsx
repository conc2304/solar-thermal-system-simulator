import { useThemeUI, useColorMode } from 'theme-ui';
import { SolarPanelSimulation } from './components/pages/solar-panel-simulation';
import { Helmet } from 'react-helmet';
import { Button } from './components';

function App() {
  const { theme } = useThemeUI();
  const [mode, setMode] = useColorMode();

  return (
    <>
      <Helmet>
        <meta name="theme-color" content={theme.colors?.primary?.toString()} />
      </Helmet>

      <Button
        onClick={() => {
          const next = mode === 'dark' ? 'light' : 'dark';
          setMode(next);
        }}
      >
        Toggle Mode: {mode}
      </Button>
      <SolarPanelSimulation />
    </>
  );
}

export default App;
