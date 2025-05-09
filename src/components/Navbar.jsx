import React from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="container">
        <nav className="navbar__content">
          <img className="navbar__logo" src={logo} alt="Logo" />
          <h1 className="navbar__title">Text Editor</h1>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
