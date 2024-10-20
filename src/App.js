//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPage from './client/AdminPage';
import About from './client/About';
import ClientPage from './client/ClientPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/adminpage" element={<AdminPage/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/clientpage" element={<ClientPage/>}/>
        </Routes>
      </div>
    </Router>
    
  );
}


export default App;
/*
<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    */