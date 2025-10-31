import { Helmet } from 'react-helmet';
import { useThemeUI } from 'theme-ui';

import { ColorModeToggle } from './components/molecules';
import { SolarPanelSimulation } from './components/pages/solar-panel-simulation';

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
