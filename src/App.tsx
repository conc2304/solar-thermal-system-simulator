import './App.css';

import { ThemeUIProvider } from 'theme-ui';
import theme from './theme';
import { SolarPanelSimulation } from './components/pages/solar-panel-simulation';

function App() {
  return (
    <>
      <ThemeUIProvider theme={theme}>
        <SolarPanelSimulation />
      </ThemeUIProvider>
    </>
  );
}

export default App;
