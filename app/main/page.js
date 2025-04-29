"use client";
import Tesseract from 'tesseract.js';
import React, { useState } from "react";
import AddModal from "../../components/add";
import {Box,Button,IconButton,Paper,Tabs,Tab,TextField,Dialog,DialogTitle,DialogContent,DialogActions,Checkbox,FormControlLabel,} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
export default function Home() {
  const imageData = typeof window !== "undefined" ? localStorage.getItem("img") : "";
  const [totalAmount, setTotalAmount] = useState(0);
  const [payorName, setPayorName] = useState("");
  const [postData, setPostData] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [isReadingBill, setIsReadingBill] = useState(false);
  const [tab, setTab] = useState(0);
  const [listItems, setListItems] = useState([]);
  const [payors, setPayors] = useState([]);
  const [currentPayor, setCurrentPayor] = useState("");
  const [expandedPayor, setExpandedPayor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const [selectedPayors, setSelectedPayors] = useState([]);
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [currentListItemIndex, setCurrentListItemIndex] = useState(null);
  const [selectedPayorIndex, setSelectedPayorIndex] = useState(null); // เพิ่มไว้ดูข้อมูล payor ที่กด
  const [payorDialogOpen, setPayorDialogOpen] = useState(false); //  Dialog สำหรับกดดูข้อมูล payor

  const ReadBill = async () => {
    if (!imageFile) return;
    setIsReadingBill(true);
    try {
      const result = await Tesseract.recognize(imageFile, "eng+tha");
      const text = result.data.text;
      const lines = text.split("\n").map(line => line.trim()).filter(Boolean);
      const newItems = [];

      lines.forEach(line => {
        const match = line.match(/(.+?)\s+(\d+(\.\d{1,2})?)$/);
        if (match) {
          const name = match[1];
          const price = parseFloat(match[2]);
          newItems.push({ name, price });
        }
      });

      setListItems(prev => [...prev, ...newItems]);
    } catch (error) {
      console.error("OCR error:", error);
    }
    setIsReadingBill(false);
  };

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleAddItem = (item) => {
    setListItems([...listItems, item]);
  };

  const handleClearList = () => {
    setListItems([]);
  };

  const handleAddPayor = () => {
    if (currentPayor.trim()) {
      const newPayor = {
        name: currentPayor,
        pay: 0,
        details: listItems.map((item) => ({
          name: item.name,
          price: item.price,
          pay: 0,
        })),
      };
      setPayors([...payors, newPayor]);
      setCurrentPayor("");
    }
  };

  const handleClearPayors = () => {
    setPayors([]);
  };

  const handleCheckboxChange = (event, name) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedPayors([...selectedPayors, name]);
    } else {
      setSelectedPayors(selectedPayors.filter((n) => n !== name));
    }
  };

  const handleOpenListDialog = (index) => {
    setCurrentListItemIndex(index);
    setSelectedPayors([]);
    setListDialogOpen(true);
  };
  const handleSaveBill = async () => {
    // ดึงข้อมูลภาพจากหน้า /save (หรือจาก localStorage ถ้ามี)
    const imageData = typeof window !== "undefined" ? localStorage.getItem("img") : "";
    
    // สมมติว่าคำนวณค่า pay รวมจากการชำระของทุกคน
    const totalPay = payors.reduce((sum, payor) => sum + payor.pay, 0); // หาผลรวมของค่า pay ของแต่ละคน
  
    // สร้าง payload โดยใช้ข้อมูลที่อัปเดตแล้ว
    const payload = {
      payor: payors.map((payor) => payor.name).join(", "), // รวมชื่อคนจ่ายทั้งหมด (กรณีมีหลายคน)
      total: totalPay.toFixed(2),    // ยอดรวมที่จะจ่าย
      img: imageData || "",          // URL ของภาพ หรือเป็นค่าว่างถ้าไม่มี
    };
  
    try {
      const res = await fetch('/api/savebill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert('บันทึกเรียบร้อยแล้ว');
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.message);
      }
    } catch (error) {
      console.error('Client Error:', error);
      alert('มีปัญหาในการเชื่อมต่อ');
    }
  };
  
  const handleConfirmShare = () => {
    if (selectedPayors.length > 0 && currentListItemIndex !== null) {
      const updatedPayors = payors.map((payor) => {
        if (!payor.details || !payor.details[currentListItemIndex]) return payor;

        const detail = payor.details[currentListItemIndex];
        if (selectedPayors.includes(payor.name)) {
          const price = parseFloat(detail.price);
          const share = !isNaN(price) && selectedPayors.length > 0
            ? price / selectedPayors.length
            : 0;
          detail.pay = share;
        } else {
          detail.pay = 0;
        }

        const totalPay = payor.details.reduce((sum, d) => sum + Number(d.pay || 0), 0);
        return { ...payor, pay: totalPay };
      });

      setPayors(updatedPayors);
      setListItems((prev) => [...prev]); 
    }
    setListDialogOpen(false);
  };
  return (
    <div className="relative h-screen w-screen bg-cover bg-center" style={{ backgroundImage: "url('/wall2.jpg')" }}>
      {/* Header */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white">
        <h1 className="text-5xl font-bold drop-shadow-lg">checkbill</h1>
      </div>

      {/* Navbar */}
      <div className="absolute top-4 right-6 flex space-x-4">
        <a href="/save" className="px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-black transition">Save bill pic</a>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center h-full px-[1.5in]">
        <Paper elevation={4} style={{ width: "80%", height: "80%", backgroundColor: "#FFF9C4", padding: "2rem", borderRadius: "12px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "1rem" }}>
            <div>
              <h2 className="text-xl font-bold">People</h2>
              <p className="text-2xl">{payors.length}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold">Total</h2>
              <p className="text-2xl">${listItems.reduce((sum, item) => sum + Number(item.price), 0).toFixed(2)}</p>
            </div>
            <AddModal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAdd={(price) => {
                handleAddItem({ name: currentName, price: parseFloat(price) });
                setCurrentName("");
                setIsModalOpen(false);
              }}
            />
          </div>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: "1rem" }}>
            <Tabs value={tab} onChange={handleChange} centered>
              <Tab label="List" sx={{ fontSize: "1.2rem", fontWeight: "bold" }} />
              <Tab label="Payor" sx={{ fontSize: "1.2rem", fontWeight: "bold" }} />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            {/* List Tab */}
            {tab === 0 && (
              <div>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <TextField label="Item Name" value={currentName} onChange={(e) => setCurrentName(e.target.value)} />
                  <Button variant="contained" onClick={() => { if (currentName.trim()) setIsModalOpen(true); }}>Add</Button>
                  <Button variant="outlined" color="error" onClick={handleClearList}>Clear</Button>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ backgroundColor: "#fff", padding: "6px", borderRadius: "4px" }} />
                  <Button variant="contained" onClick={ReadBill} disabled={!imageFile || isReadingBill}>
                    {isReadingBill ? "Reading..." : "Read Bill"}
                  </Button>
                </Box>


                {/* List Table Header */}
                <Box sx={{ display: "flex", justifyContent: "space-around", marginBottom: "1rem", fontWeight: "bold" }}>
                  <div style={{ width: "30%" }}>Item Name</div>
                  <div style={{ width: "20%" }}>Price</div>
                  <div style={{ width: "30%" }}>Each</div>
                  <div style={{ width: "20%" }}></div>
                </Box>

                {/* List Table Body */}
                {listItems.map((item, index) => {
                  const totalSelectedPayors = payors.filter((payor) => payor.details && payor.details[index]?.pay > 0).length;
                  const eachPerson = totalSelectedPayors > 0 ? (item.price / totalSelectedPayors).toFixed(2) : "-";
                  return (
                    <Box key={index} sx={{ display: "flex", marginLeft: "2rem", marginBottom: "0.5rem", alignItems: "center" }}>
                      <div style={{ width: "30%" }}>{item.name}</div>
                      <div style={{ width: "20%" }}>${item.price.toFixed(2)}</div>
                      <div style={{ width: "30%" }}>{eachPerson !== "-" ? `$${eachPerson}` : "-"}</div>
                      <div style={{ width: "20%" }}>
                        <IconButton onClick={() => handleOpenListDialog(index)}>
                          <MoreVertIcon />
                        </IconButton>
                      </div>
                    </Box>
                  );
                })}
              </div>
            )}

            {/* Payor Tab */}
            {tab === 1 && (
              <div>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <TextField label="Payor Name" value={currentPayor} onChange={(e) => setCurrentPayor(e.target.value)} />
                  <Button variant="contained" onClick={handleAddPayor}>Add</Button>
                  <Button variant="outlined" color="error" onClick={handleClearPayors}>Clear</Button>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-around", marginBottom: "1rem", fontWeight: "bold" }}>
                  <div style={{ width: "40%" }}>Payor</div>
                  <div style={{ width: "30%" }}>Pay</div>
                  <div style={{ width: "30%" }}></div>
                </Box>

                {payors.map((payor, index) => (
                  <Box key={index} sx={{ display: "flex", marginLeft: "2rem", marginBottom: "0.5rem", alignItems: "center" }}>
                    <div style={{ width: "40%" }}>{payor.name}</div>
                    <div style={{ width: "30%" }}>${payor.pay.toFixed(2)}</div>
                    <div style={{ width: "30%" }}>
                      <IconButton onClick={() => { setSelectedPayorIndex(index); setPayorDialogOpen(true); }}>
                        <MoreVertIcon />
                      </IconButton>
                    </div>
                  </Box>
                ))}
              </div>
            )}
          </Box>
        </Paper>
      </div>

      {/* Dialog สำหรับเลือกคนที่จ่ายสินค้า */}
      <Dialog open={listDialogOpen} onClose={() => setListDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Select Payors</DialogTitle>
        <DialogContent>
          {payors.map((payor) => (
            <FormControlLabel
              key={payor.name}
              control={<Checkbox checked={selectedPayors.includes(payor.name)} onChange={(e) => handleCheckboxChange(e, payor.name)} />}
              label={payor.name}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setListDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmShare}>OK</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog สำหรับดูยอดที่ต้องจ่ายของ Payor */}
      <Dialog open={payorDialogOpen} onClose={() => setPayorDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontSize: "2rem" }}>
          ยอดชำระ: {selectedPayorIndex !== null ? payors[selectedPayorIndex].name : ""}
        </DialogTitle>
        <DialogContent dividers sx={{ fontSize: "1.2rem" }}>
          {selectedPayorIndex !== null && payors[selectedPayorIndex].details.map((detail, idx) => (
            <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <div>{detail.name}</div>
              <div>{detail.price}</div>
              <div>{detail.pay}</div>
            </Box>
          ))}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, fontWeight: "bold" }}>
            <div>ยอดรวม</div>
            <div>{selectedPayorIndex !== null ? payors[selectedPayorIndex].pay.toFixed(2) : 0}</div>
          </Box>
        </DialogContent>
        <DialogActions sx={{ flexDirection: "column", alignItems: "stretch", gap: 2, p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Button variant="contained" color="success" onClick={handleSaveBill}>
              Save Bill
            </Button>
          </Box>
          <Button variant="contained" onClick={() => setPayorDialogOpen(false)}>ตกลง</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
