import './App.css'
import {Route, Routes} from "react-router-dom";
import IndexPage from './pages/IndexPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import UserSettingsPage from './pages/UserSettingsPage';

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<IndexPage/>}/>
      <Route path="home" element={<HomePage/>}/>
      <Route path="profile" element={<ProfilePage/>}/>
      <Route path="usersettings" element={<UserSettingsPage/>}/>
    </Routes>
    </>
  )
}

export default App
