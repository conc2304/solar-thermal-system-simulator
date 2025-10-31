import './App.css';

import { ThemeUIProvider } from 'theme-ui';
import { DefaultTheme } from './theme';
import { SolarPanelSimulation } from './components/pages/solar-panel-simulation';

function App() {
  return (
    <>
      <ThemeUIProvider theme={DefaultTheme}>
        <SolarPanelSimulation />
      </ThemeUIProvider>
    </>
  );
}

export default App;
