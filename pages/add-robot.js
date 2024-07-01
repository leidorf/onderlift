import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";
import Link from "next/link";

export default function AddRobot() {
  const router = useRouter();

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
      if (robotData[key] !== null) {
        // FormData'ya boş alan eklememek için kontrol
        formData.append(key, robotData[key]);
      }
    }

    try {
      await axios.post("/api/add-robot", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Robot başarıyla eklendi!");
      router.push(`/`);
    } catch (error) {
      console.error("Error adding robot:", error);
      alert("Robot eklenirken bir hata oluştu.");
    }
  };

  return (
    <>
      <Layout>
        <PageHead headTitle="Robot Ekle" />
        <div className="container">
          <div className="row row-cols-auto">
            <form onSubmit={handleSubmit}>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  name="x_position"
                  onChange={handleChange}
                  placeholder="0"
                />
                <label for="floatingInput">X Pozisyonu</label>
              </div>
              <br />
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  name="y_position"
                  onChange={handleChange}
                  placeholder="0"
                />
                <label for="floatingInput">Y Pozisyonu</label>
              </div>
              <br />
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  name="z_position"
                  onChange={handleChange}
                  placeholder="0"
                />
                <label for="floatingInput">Z Pozisyonu</label>
              </div>
              <br />
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  name="yaw"
                  onChange={handleChange}
                  placeholder="0"
                />
                <label for="floatingInput">Yaw</label>
              </div>
              <br />
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  name="roll"
                  onChange={handleChange}
                  placeholder="0"
                />
                <label for="floatingInput">Roll</label>
              </div>
              <br />
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  name="pitch"
                  onChange={handleChange}
                  placeholder="0"
                />
                <label for="floatingInput">Pitch</label>
              </div>
              <br />
              <div>
                <label>Fotoğraf</label>
                <br />
                <input
                  type="file"
                  className="form-control"
                  name="photo"
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg"
                />
              </div>
              <br />
              <br />
              <div className="row row-cols-auto">
                <div className="col">
                  <Link href="/" className="text-primary">
                    <button type="button" className="btn btn-primary">
                      Ana Sayfa
                    </button>
                  </Link>
                </div>
                <div className="col">
                  <button type="submit" className="btn btn-success">
                    Robot Ekle
                  </button>
                </div>
              </div>
            </form>
          </div>
          <br />
        </div>
      </Layout>
    </>
  );
}
