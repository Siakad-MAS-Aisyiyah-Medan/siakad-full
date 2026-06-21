import './App.css';
import { AppProviders } from './providers/AppProviders';
import AppRouter from './routes/AppRoutes';

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
