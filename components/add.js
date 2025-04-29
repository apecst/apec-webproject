import React, { useState } from "react";
import { Modal, Box, Button, Typography } from "@mui/material";

// ฟังก์ชันเอาไว้คำนวณ 
const safeEvaluate = (expression) => {
  try {
    if (/^[0-9+\-*/.()÷× ]+$/.test(expression)) {
      const sanitized = expression.replace(/÷/g, "/").replace(/×/g, "*");
      const result = eval(sanitized);

      if (!isNaN(result)) {
        return Number(result).toFixed(2); 
      }
    }
    return "";
  } catch {
    return "";
  }
};

export default function AddModal({ open, onClose, onAdd }) {
  const [price, setPrice] = useState("");

  const handleButtonClick = (value) => {
    setPrice((prev) => prev + value);
  };

  const handleClear = () => {
    setPrice("");
  };

  const handleEvaluate = () => {
    const result = safeEvaluate(price);
    if (result !== "") {
      setPrice(result.toString());
    }
  };

  const handleOk = () => {
    const result = safeEvaluate(price);
    if (result !== "") {
      onAdd(result); 
      setPrice("");
      onClose(); 
    }
  };

  const buttons = [
    "7", "8", "9", "÷",
    "4", "5", "6", "×",
    "1", "2", "3", "-",
    "0", ".", "C", "+",
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          backgroundColor: "white",
          borderRadius: 2,
          width: 320,
          mx: "auto",
          mt: "15vh",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6">Enter Price</Typography>
        <Typography variant="h4" align="center">
          {price || "0"}
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
          {buttons.map((val) => (
            <Button
              key={val}
              variant={["÷", "×", "-", "+", "C"].includes(val) ? "outlined" : "contained"}
              color={val === "C" ? "error" : "primary"}
              onClick={() =>
                val === "C"
                  ? handleClear()
                  : handleButtonClick(val)
              }
            >
              {val}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button fullWidth variant="outlined" onClick={handleEvaluate}>
            =
          </Button>
          <Button fullWidth variant="contained" onClick={handleOk}>
            OK
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
