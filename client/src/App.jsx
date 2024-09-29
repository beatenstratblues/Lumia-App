import "./App.css";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import UserSettingsPage from "./pages/UserSettingsPage";
import AppLayout from "./pages/AppLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<IndexPage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="usersettings" element={<UserSettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
