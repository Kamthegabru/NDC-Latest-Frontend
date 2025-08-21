import React, { useContext } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider, Typography, Box, AppBar, Toolbar, useMediaQuery } from "@mui/material";
import { Home, ExitToApp, Menu, Settings } from "@mui/icons-material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import { useTheme } from "@mui/material/styles";
import AdminContext from "../../Context/Admin/AdminContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

function Navbar({ isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currentActiveButton, setCurrentActiveButton } = useContext(AdminContext);

  const handleDrawerToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleItemClick = (index) => {
    if (index === 8) {
      Cookies.remove("token");
      navigate("/");
    } else {
      setCurrentActiveButton(index);
      if (isMobile) {
        setIsMobileOpen(false);
      }
    }
  };

  const menuItems = [
    { text: "Home", icon: <Home />, index: 1,index2:1 },
    { text: "Customer", icon: <PersonIcon />, index: 2,index2 : 5 },
    { text: "Agency", icon: <BusinessIcon />, index: 3,index2:6 },
    { text: "Admin", icon: <AdminPanelSettingsIcon />, index: 4,index2:4 },
    { text: "Order Drug Test", icon: <NoteAddIcon />, index: 9,index2:9},
    { text: "Random", icon: <ShuffleIcon />, index: 7,index2:7 },
    { text: "Result", icon: <AssignmentTurnedInIcon />, index: 10,index2:10 },
    { text: "Setting", icon: <Settings />, index: 11,index2:11 },
    { text: "Logout", icon: <ExitToApp />, index: 8, index2 : 8 }
  ];

  const drawerContent = (
    <Box sx={{ width: drawerWidth, backgroundColor: "#0a0a42", color: "white", height: "100vh", p: 2 }}>
      <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
        <img src="./Images/BeforeLogin/logo.png" alt="Logo" style={{ width: "100px" }} />
      </Typography>
      <Typography variant="caption" sx={{ textAlign: "center", display: "block", mb: 2 }}>DASHBOARD</Typography>
      <Divider sx={{ backgroundColor: "white", mb: 2 }} />
      <List>
        {menuItems.map((item) => (
          <ListItem
          component="div" // Instead of button prop
          key={item.index}
          onClick={() => handleItemClick(item.index)}
          sx={{
            borderRadius: 2,
            mb: 1,
            cursor: "pointer",
            backgroundColor: currentActiveButton === item.index || currentActiveButton === item.index2 ? "white" : "transparent",
            color: currentActiveButton === item.index || currentActiveButton === item.index2 ? "black" : "white",
            "&:hover": currentActiveButton === item.index ? { backgroundColor: "white" } : { backgroundColor: "rgba(255, 255, 255, 0.2)" }
          }}
        >
          <ListItemIcon sx={{ color: currentActiveButton === item.index  || currentActiveButton === item.index2? "black" : "white" }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} sx={{ fontWeight: 900 }} />
        </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <AppBar position="fixed" sx={{ backgroundColor: "#0a0a42", zIndex: 1400 }}>
          <Toolbar>
            <IconButton color="inherit" aria-label="toggle drawer" onClick={handleDrawerToggle}>
              <Menu />
            </IconButton>
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
              <img src="./Images/BeforeLogin/logo.png" alt="Logo" style={{ width: "100px" }} />
            </Box>
          </Toolbar>
        </AppBar>
      )}
      <Drawer
        variant="temporary"
        open={isMobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" } }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" } }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default Navbar;
