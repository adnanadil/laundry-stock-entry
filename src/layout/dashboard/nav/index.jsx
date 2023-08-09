import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// @mui
import { Box, Drawer } from "@mui/material";
// hooks
import useResponsive from "../../../hooks/useResponsive";
// components
import Scrollbar from "../../../components/scrollbar";
import NavSection from "../../../components/nav-section";
import Logo from "../../../components/logo";

//
import navConfig from "./config";

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive("up", "lg");

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: "inline-flex" }}>
        <Logo />
      </Box>
      <NavSection data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}></Box>
    </Scrollbar>
  );

  return (
    <>
      <Box
        component="nav"
        sx={{
          // Basically we are adding a box on the left if we hit the large screen size 
          // so that in the blank space we can add the navbar on the top
          flexShrink: { lg: 0 },
          width: { lg: NAV_WIDTH },
        }}
      >
        {isDesktop ? (
          <Drawer
            open
            variant="permanent"
            PaperProps={{
              sx: {
                width: NAV_WIDTH,
                bgcolor: "background.default",
                borderRightStyle: "dashed",
              },
            }}
          >
            {renderContent}
          </Drawer>
        ) : (
          <Drawer
            open={openNav}
            onClose={onCloseNav}
            ModalProps={{
              keepMounted: true,
            }}
            PaperProps={{
              sx: { width: NAV_WIDTH },
            }}
          >
            {renderContent}
          </Drawer>
        )}
      </Box>
    </>
  );
}
