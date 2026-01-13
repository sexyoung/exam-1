import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import RunningClock from './pages/RunningClock';
import IsCycleCheck from './pages/IsCycleCheck';
import PerformanceCheck from './pages/PerformanceCheck';

function Home() {
  return (
    <div>
      <Link to="/running-clock">Running Clock</Link>
      <br />
      <Link to="/is-cycle-check">IsCycleCheck</Link>
      <br />
      <Link to="/performance-check">PerformanceCheck</Link>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/running-clock" element={<RunningClock />} />
        <Route path="/is-cycle-check" element={<IsCycleCheck />} />
        <Route path="/performance-check" element={<PerformanceCheck />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
