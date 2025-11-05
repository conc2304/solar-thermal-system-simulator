import { Helmet } from 'react-helmet';
import { useThemeUI } from 'theme-ui';

import { ColorModeToggle } from './components/molecules';
import { SolarPanelSimulationPage } from './components/pages';

function App() {
  const { theme } = useThemeUI();

  return (
    <>
      <Helmet>
        <meta name="theme-color" content={theme.colors?.primary?.toString()} />
      </Helmet>

      <ColorModeToggle
        sxStyles={{
          position: 'absolute',
          top: 0,
          right: 0,
          p: 2,
          m: 3,
        }}
      />

      <SolarPanelSimulationPage />
    </>
  );
}

export default App;
