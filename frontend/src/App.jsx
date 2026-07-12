import './App.css';
import { AppProviders } from './providers/AppProviders';
import AppRouter from './routes/AppRoutes';

import GlobalErrorBoundary from './shared/components/GlobalErrorBoundary';

function App() {
  return (
    <GlobalErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </GlobalErrorBoundary>
  );
}

export default App;
