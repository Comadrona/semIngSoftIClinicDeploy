/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import Logo from "../Assets/logo.png";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import Groups2Icon from '@mui/icons-material/Groups2';
import LoginIcon from '@mui/icons-material/Login';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import "./navbar-footer.css"
import { Link } from 'react-router-dom'
import useAuth from "../hooks/useAuth";
const Navbar = () => {
  const { username } = useAuth()
  let buttonInfo = ['Login', '/login',LoginIcon]
  if(username)buttonInfo = [username.toUpperCase(), '/user',AccountCircleIcon]
  const [openMenu, setOpenMenu] = useState(false);
  const menuOptions = [
    {
      text: "Inicio",
      icon: <HomeIcon />,
      route: "/"
    },
    {
      text: "Sobre nosotros",
      icon: <Groups2Icon />,
      route: "/about"
    },
    {
      text: "Servicios",
      icon: <FaceRetouchingNaturalIcon />,
      route: "/services"
    },
    {
      text: buttonInfo[0],
      icon: (username) ? <AccountCircleIcon/>: <LoginIcon />,
      route: buttonInfo[1]
    },
  ];
  
  return (
    <nav>
      <div className="nav-logo-container">
      <Link to="/">
          <img src={Logo} alt="" className="logo"/>
      </Link>
        
      </div>
      <div className="navbar-links-container">
          <a href="/">Inicio</a>
          <a href="/about">Sobre nosotros</a>
          <a href="/services">Servicios</a>
        <Link to={buttonInfo[1]}>
        <button className="primary-button">{buttonInfo[0]}</button>
        </Link>
      </div>
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} fontSize={"2rem"}/>
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton>
                  <Link to={item.route}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </Link>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;
