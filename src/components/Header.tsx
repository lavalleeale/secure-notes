import { AppBar, Toolbar, Typography } from "@material-ui/core";
import * as React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Typography variant="h3" color="textPrimary">
            Secure Notes
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
