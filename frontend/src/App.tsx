import { AppRouter } from './routes/AppRouter';
import { ToastHost } from './components/ToastHost';

export default function App() {
  return (
    <>
      <AppRouter />
      <ToastHost />
    </>
  );
}