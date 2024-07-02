import { useRouter } from "next/router";
import axios from "axios";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";
import { useState } from "react";
import Link from "next/link";

export default function UpdateMap({ robot }) {
  const router = useRouter();
  const [photo, setPhoto] = useState(null);

  const handleCancel = () => {
    router.back();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", robot.id); // Robot ID'sini form data'ya ekle
    formData.append("photo", photo);

    try {
      await axios.post(`http://localhost:3000/api/update-map`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Harita başarıyla güncellendi!");
      router.push(`/robots/${robot.id}`); // Güncelleme sonrası robotun detay sayfasına yönlendir
    } catch (error) {
      console.error("Harita güncelleme hatası:", error);
      alert("Harita güncelleme sırasında bir hata oluştu.");
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Layout>
        <PageHead headTitle={`Haritayı Güncelle - Robot ${robot.id}`} />
        <div className="container">
          <h5>
            Haritayı Güncelle - <strong>Robot {robot.id}</strong>
          </h5>
          <br />
          <div className="row row-cols-auto">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="photo">Robot {robot.id} İçin Yeni Harita Resmi Seçin:</label>
                <br />
                <br />
                <input
                  type="file"
                  className="form-control"
                  id="photo"
                  name="photo"
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg"
                  required
                />
              </div>
              <br />
              <div className="row row-cols-auto">
                <div className="col">
                  <Link href={"/"}>
                    <button className="btn btn-primary">Ana Sayfa</button>
                  </Link>
                </div>
                <div className="col">
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    İptal
                  </button>
                </div>
                <div className="col">
                  <button
                    type="submit"
                    className="btn btn-warning"
                  >
                    Haritayı Güncelle
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  try {
    const response = await axios.get(`http://localhost:3000/api/robots/${id}`); // Robotun detaylarını almak için API endpoint'i
    const robot = response.data;

    return {
      props: {
        robot,
      },
    };
  } catch (error) {
    console.error("Robot bilgisi alınamadı:", error);
    return {
      notFound: true, // Robot bulunamazsa 404 sayfası gösterilecek
    };
  }
}
