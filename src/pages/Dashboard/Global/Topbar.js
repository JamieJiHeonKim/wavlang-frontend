import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../../theme";
import { Link, useNavigate } from 'react-router-dom';
import './Topbar.scss';
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import HomeOutlined from "@mui/icons-material/HomeOutlined";

const Topbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const handleSettingsIcon = () => {
    navigate('/dashboard/user/settings');
  }

  return (
    <Box
        display="flex"
        justifyContent="space-between"
        p={2}
    >
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box
        display="flex"
        position="absolute"
        right="16px"
      >
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        {/* <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton> */}
        <IconButton onClick={() => navigate('/')} >
          <HomeOutlined/>
        </IconButton>
        <IconButton onClick={() => navigate('/dashboard/user/settings')}>
          <SettingsOutlinedIcon />
        </IconButton>
        {/* <IconButton>
          <PersonOutlinedIcon />
        </IconButton> */}
      </Box>
    </Box>
  );
};

export default Topbar;