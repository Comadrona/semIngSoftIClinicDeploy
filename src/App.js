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
                  <Route exact path='/' element={< HomePage />}/>
                  <Route exact path='/services' element={< ServicesPage />}/>
                  <Route exact path='/login' element={< LoginPage />}/>
                  <Route exact path='/about' element={< AboutPage />}/>
                  
                  
                    <Route element={<RequireAuth allowedRoles={[ROLES.Basic,ROLES.Admin]} />}>
                      <Route exact path='/user' element={<UserInfo/>}/>
                    </Route>
                    <Route element={<RequireAuth allowedRoles={[ROLES.Basic]} />}>
                    <Route exact path='/appoiments' element={<AppoimentsPage/>}/>
                    </Route>
                    <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                      <Route exact path='/admin' element={<AdminPage/>}/>
                      <Route exact path='/admin/appoiments/:id' element={<AdminPageAppoiments/>}/>
                      <Route exact path='/admin/appoiments/fulfilled' element={<AdminPageAppoimentsFullfiled/>}/>
                    </Route>
                </Route>
        </Routes>
    
  );
}

export default App;