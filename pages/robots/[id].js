import { useRouter } from "next/router";
import axios from "axios";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";
import Link from "next/link";
import { useState } from "react";

export default function Robot({ robot }) {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleDelete = async () => {
    const confirmDelete = confirm(`Robot ${robot.id} silinsin mi?`);
    if (confirmDelete) {
      try {
        await axios.delete(`/api/delete?id=${robot.id}`);
        alert("Robot başarıyla silindi!");
        router.push("/"); // Anasayfaya yönlendir
      } catch (error) {
        console.error("Robot silme hatası:", error);
        alert("Robot silme sırasında bir hata oluştu.");
      }
    }
  };

  const handleMouseMove = (event) => {
    const img = event.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * img.naturalWidth;
    const y = ((event.clientY - rect.top) / rect.height) * img.naturalHeight;
    const centerX = img.naturalWidth / 2;
    const centerY = img.naturalHeight / 2;
    setMousePosition({ x: x - centerX, y: y - centerY });
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Layout>
        <PageHead headTitle={`Robot ${robot.id}`} />
        <div className="container h6">
          <div>
            <h4 className="text-primary">Robot ID: {robot.id}</h4>
            <br />
            <div className="">
              <div className="row">
                <div className="col-2 bg-light fw-bold">X Pozisyonu</div>
                <div className="col-2 bg-light fw-bold">Y Pozisyonu</div>
                <div className="col-2 bg-light fw-bold">Z Pozisyonu</div>
                <div className="w-100"></div>
                <div className="col-2">{robot.x_position}</div>
                <div className="col-2">{robot.y_position}</div>
                <div className="col-2">{robot.z_position}</div>
              </div>
              <br />
              <div className="row">
                <div className="col-2 bg-light fw-bold">Yaw</div>
                <div className="col-2 bg-light fw-bold">Roll</div>
                <div className="col-2 bg-light fw-bold">Pitch</div>
                <div className="w-100"></div>
                <div className="col-2">{robot.yaw}</div>
                <div className="col-2">{robot.roll}</div>
                <div className="col-2">{robot.pitch}</div>
              </div>
            </div>
            <br />
            <p>Harita:</p>
            {robot.photo && (
              <div style={{ position: "relative" }}>
                <img
                  src={`data:image/jpeg;base64,${robot.photo}`}
                  alt="Robot Harita"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                  onMouseMove={handleMouseMove}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    padding: "5px",
                    borderRadius: "5px",
                    zIndex: 10,
                  }}
                >
                  <p style={{ margin: 0 }}>
                    Fare Konumu: X: {mousePosition.x.toFixed(2)}, Y: {mousePosition.y.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
            <p>Robot Kayıt Tarihi: {robot.creation}</p>
          </div>
          <br />
          <div className="row">
            <div className="col">
              <Link href={`/`}>
                <button className="btn btn-primary">Ana Sayfa</button>
              </Link>
            </div>
            <div className="col-3 row">
              <div className="col-sm-6">
                <Link href={`/update-map?id=${robot.id}`}>
                  <button className="btn btn-warning">Haritayı Güncelle</button>
                </Link>
              </div>
              <div className="col-sm-6">
                <button className="btn btn-danger" onClick={handleDelete}>
                  Robotu Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticPaths() {
  const response = await axios.get("http://localhost:3000/api/robots"); // API endpoint'i değiştirdiğinizden emin olun
  const robots = response.data;

  const paths = robots.map((robot) => ({
    params: { id: robot.id.toString() },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const response = await axios.get(
    `http://localhost:3000/api/robots/${params.id}`
  ); // API endpoint'i değiştirdiğinizden emin olun
  const robot = response.data;

  return {
    props: {
      robot,
    },
    revalidate: 10, // 10 saniye sonra sayfa yeniden oluşturulabilir
  };
}
