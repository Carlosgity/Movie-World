import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage/HomePage';
import LandingPage from './Pages/LandingPage/LandingPage';
import { Provider } from 'react-redux';
import { store } from './store';
import MyCollectionPage from './Pages/MyCollectionPage/MyCollectionPage';

function App() {
  return (

    <Provider store={store}>

      <div className="App"> 
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/MyCollectionPage" element={<MyCollectionPage />} />
        </Routes>
      </Router>
      </div>
    </Provider>
  );
}

export default App;
