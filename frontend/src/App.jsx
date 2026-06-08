import './App.css';
import { AppProviders } from './app/providers/AppProviders';
import AppRouter from './app/routes/AppRoutes';

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
