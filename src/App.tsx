import { useThemeUI } from 'theme-ui';
import { SolarPanelSimulation } from './components/pages/solar-panel-simulation';
import { Helmet } from 'react-helmet';
import { ColorModeToggle } from './components/molecules';

function App() {
  const { theme } = useThemeUI();

  return (
    <>
      <Helmet>
        <meta name="theme-color" content={theme.colors?.primary?.toString()} />
      </Helmet>

      <ColorModeToggle />

      <SolarPanelSimulation />
    </>
  );
}

export default App;
