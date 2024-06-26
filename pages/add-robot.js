import { useState } from "react";
import axios from "axios";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";
import Link from "next/link";

export default function AddRobot() {
  const [robotData, setRobotData] = useState({
    x_position: "",
    y_position: "",
    z_position: "",
    yaw: "",
    roll: "",
    pitch: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRobotData({
      ...robotData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setRobotData({
      ...robotData,
      photo: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in robotData) {
      formData.append(key, robotData[key]);
    }

    try {
      await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Robot başarıyla eklendi!");
    } catch (error) {
      console.error("Error adding robot:", error);
      alert("Robot eklenirken bir hata oluştu.");
    }
  };

  return (
    <>
      <Layout>
        <PageHead headTitle="Add Robot"></PageHead>
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div>
              <label>X Pozisyonu</label>
              <input type="text" name="x_position" onChange={handleChange} />
            </div>
            <br />
            <div>
              <label>Y Pozisyonu</label>
              <input type="text" name="y_position" onChange={handleChange} />
            </div>
            <br />
            <div>
              <label>Z Pozisyonu</label>
              <input type="text" name="z_position" onChange={handleChange} />
            </div>
            <br />
            <div>
              <label>Yaw</label>
              <input type="text" name="yaw" onChange={handleChange} />
            </div>
            <br />
            <div>
              <label>Roll</label>
              <input type="text" name="roll" onChange={handleChange} />
            </div>
            <br />
            <div>
              <label>Pitch</label>
              <input type="text" name="pitch" onChange={handleChange} />
            </div>
            <br />
            <div>
              <label>Fotoğraf</label>
              <input type="file" name="photo" onChange={handleFileChange} />
            </div>
            <br />
            <button type="submit">Robot Ekle</button>
          </form><br/>
          <h5>
            <Link href=".." className="text-primary">
              Geri Dön
            </Link>
          </h5>
        </div>
      </Layout>
    </>
  );
}
