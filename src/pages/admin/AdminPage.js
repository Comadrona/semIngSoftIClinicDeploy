import React from 'react'
import UsersList from '../../UserPageComponents/usersList'
import Navbar from '../../publiccomponents/Navbar'
import Footer from '../../publiccomponents/Footer'
function AdminPage() {
  return (
    <>
      <Navbar/>
      <UsersList/>
      <Footer/>
    </>
  )
}

export default AdminPage