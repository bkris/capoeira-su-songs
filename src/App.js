import './App.css';
import { Routes, Route } from 'react-router-dom';
import SongLibrary from './components/SongLibrary';
import SongEditor from './components/SongEditor';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SongLibrary />} />
      <Route path="/editor" element={<SongEditor />} />
    </Routes>
  );
}

export default App;
