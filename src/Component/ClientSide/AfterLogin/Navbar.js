import React, { useContext } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider, Typography, Box, AppBar, Toolbar, useMediaQuery } from "@mui/material";
import { Home, Business, DirectionsCar, CalendarToday, CheckCircle, CreditCard, Receipt, ExitToApp, Menu, Shuffle } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import HomeContext from "../../../Context/ClientSide/AfterLogin/Home/HomeContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

function Navbar({ isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currentActiveButton, setCurrentActiveButton } = useContext(HomeContext);

  const handleDrawerToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleItemClick = (index) => {
    if (index === 10) {
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
    { text: "Home", icon: <Home />, index: 1 },
    { text: "Company", icon: <Business />, index: 2 },
    { text: "Drivers", icon: <DirectionsCar />, index: 3 },
    { text: "Order Drug Test", icon: <CalendarToday />, index: 4 },
    { text: "Results", icon: <CheckCircle />, index: 5 },
    { text: "Membership", icon: <CreditCard />, index: 6 },
    { text: "Random Test", icon: <Shuffle />, index: 7 },
    { text: "Payments", icon: <Receipt />, index: 8 },
    { text: "Invoices", icon: <Receipt />, index: 9 },
    { text: "Logout", icon: <ExitToApp />, index: 10 }
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
            backgroundColor: currentActiveButton === item.index ? "white" : "transparent",
            color: currentActiveButton === item.index ? "black" : "white",
            "&:hover": currentActiveButton === item.index ? { backgroundColor: "white" } : { backgroundColor: "rgba(255, 255, 255, 0.2)" }
          }}
        >
          <ListItemIcon sx={{ color: currentActiveButton === item.index ? "black" : "white" }}>
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
