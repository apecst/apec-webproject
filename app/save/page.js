"use client";
import React, { useEffect, useState } from "react";
import { Button, List, ListItem } from "@mui/material";
import AddModal from "@/components/add";

export default function Home() {
  const [images, setImages] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // โหลดรูปจาก localStorage ตอนเปิดหน้า
  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem("uploadedImages")) || [];
    setImages(storedImages);
  }, []);

  // เซฟรูปใหม่เข้า localStorage ทุกครั้งที่ images เปลี่ยน
  useEffect(() => {
    localStorage.setItem("uploadedImages", JSON.stringify(images));
  }, [images]);

  const handleAddImage = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImages((prevImages) => [...prevImages, imageUrl]);
    }
  };

  const handleClearImages = () => {
    setImages([]);
    localStorage.removeItem("uploadedImages");
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/wall2.jpg')" }}
    >
      <div className="absolute top-0 left-0 m-4">
        <Button variant="contained" href="/main" className="m-2">
          MAIN
        </Button>
      </div>

      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg z-10 flex flex-col items-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4">Upload Picture</h1>

        {/* แสดงรูป หรือถ้ายังไม่มีรูป */}
        <List className="w-full flex flex-col items-center">
          {images.length > 0 ? (
            images.map((url, index) => (
              <ListItem key={index} className="flex justify-center">
                <img src={url} alt={`Uploaded ${index}`} className="max-w-xs rounded-lg" />
              </ListItem>
            ))
          ) : (
            <div className="text-gray-500 my-4">ยังไม่มีรูปที่อัปโหลด</div>
          )}
        </List>

        {/* ปุ่ม Add Pic + Clear */}
        <div className="mt-6 flex gap-4">
          <label htmlFor="upload-image">
            <Button variant="contained" component="span">
              Add Pic
            </Button>
          </label>
          <input
            id="upload-image"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAddImage}
          />

          <Button variant="outlined" color="error" onClick={handleClearImages}>
            Clear
          </Button>
        </div>
      </div>

      {/* Modal เดิม */}
      <AddModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={() => {}}
      />
    </div>
  );
}
