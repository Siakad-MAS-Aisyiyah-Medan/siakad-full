import { HashRouter } from 'react-router-dom';

export function AppProviders({ children }) {
  return <HashRouter>{children}</HashRouter>;
}
