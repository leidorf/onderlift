import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";
import Link from "next/link";

export default function AddRobot() {
  const router = useRouter();

  const [robotData, setRobotData] = useState({
    ip_address: "",
    photo: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRobotData({
      ...robotData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("ip_address", robotData.ip_address);

    try {
      await axios.post("/api/robot", formData, {
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
    <Layout>
      <PageHead headTitle="Robot Ekle" />
      <div className="container">
        <div className="row row-cols-auto">
          <form
            onSubmit={handleSubmit}
            className="col"
          >
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="ipAddress"
                name="ip_address"
                pattern="^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])){3}$"
                value={robotData.ip_address}
                onChange={handleInputChange}
                placeholder="IP Adresi"
                required
              />
              <label for="ipAddress">IP Adresi</label>
            </div>

            <div className="row row-cols-auto">
              <div className="col">
                <Link href="/">
                  <button
                    type="button"
                    className="btn btn-primary"
                  >
                    Ana Sayfa
                  </button>
                </Link>
              </div>
              <div className="col">
                <button
                  type="submit"
                  className="btn btn-success"
                >
                  Robot Ekle
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
