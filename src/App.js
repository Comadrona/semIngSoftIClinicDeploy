// src/App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import LoginPage from "./pages/LoginPage";
import AboutPage from "./pages/AboutPage";
import PersistLogin from "./loginComponents/PersistLogin";
import UserInfo from "./pages/UserInfo";
import AdminPage from "./pages/admin/AdminPage";
import AppoimentsPage from "./pages/basic/AppoimentsPage";
import RequireAuth from "./loginComponents/RequireAuth";
import AdminPageAppoiments from "./pages/admin/AdminPageAppoiments";
import AdminPageAppoimentsFullfiled from "./pages/admin/AdminPageAppoimentsFullfiled";
function App() {
  const ROLES={
      Basic: 'Basico',
      Admin: 'Administrador'
  
  }
  return (
        <Routes>
                <Route element={<PersistLogin/>}>
                  <Route path='/' element={< HomePage />}/>
                  <Route path='/services' element={< ServicesPage />}/>
                  <Route path='/login' element={< LoginPage />}/>
                  <Route path='/about' element={< AboutPage />}/>
                  
                  
                    <Route element={<RequireAuth allowedRoles={[ROLES.Basic,ROLES.Admin]} />}>
                      <Route path='/user' element={<UserInfo/>}/>
                    </Route>
                    <Route element={<RequireAuth allowedRoles={[ROLES.Basic]} />}>
                    <Route path='/appoiments' element={<AppoimentsPage/>}/>
                    </Route>
                    <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                      <Route path='/admin' element={<AdminPage/>}/>
                      <Route path='/admin/appoiments/:id' element={<AdminPageAppoiments/>}/>
                      <Route path='/admin/appoiments/fulfilled' element={<AdminPageAppoimentsFullfiled/>}/>
                    </Route>
                </Route>
        </Routes>
    
  );
}

export default App;