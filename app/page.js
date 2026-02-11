"use client";
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import { signIn, useSession } from "next-auth/react";

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const { status } = useSession();

  const backgroundStyle = {
    backgroundImage: "url('/wall.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
    height: "100vh",
    width: "100vw",
    color: "#fff",
    position: "relative",
  };

  const headerStyle = {
    backgroundColor: "white",
    color: "black",
    width: "100%",
    padding: "20px",
    textAlign: "center",
    fontFamily: "sans-serif",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  };

  const contentStyle = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div style={backgroundStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold" }}>
         {"LET'S CHECKBILL"}
        </h1>

        <p style={{ margin: 0, fontSize: "1.2rem" }}>
          easy way to manage your bill
        </p>
      </div>

      <div style={contentStyle}>
        <button onClick={handleClickOpen} className="ghost-button">
          LOGIN
        </button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "2rem",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => signIn("google", { callbackUrl: "/main" })}
          >
            Login with Google
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
