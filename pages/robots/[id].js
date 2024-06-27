import { useRouter } from "next/router";
import axios from "axios";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Robot({ robot, paths }) {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [xPosition, setXPosition] = useState("");
  const [yPosition, setYPosition] = useState("");
  const [zPosition, setZPosition] = useState("");
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [clickedPosition, setClickedPosition] = useState(null);
  const imageRef = useRef(null);
  const nodeColors = [
    "red",
    "blue",
    "green",
    "orange",
    "purple",
    "yellow",
    "cyan",
    "magenta",
  ];
  const handleAddPath = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/add-path", {
        robot_id: robot.id,
        x_position: xPosition,
        y_position: yPosition,
        z_position: zPosition,
      });

      alert("Yol başarıyla eklendi!");
      router.reload(); // Sayfayı yenileyerek yeni yolları göster
    } catch (error) {
      console.error("Yol ekleme hatası:", error);
      alert("Yol ekleme sırasında bir hata oluştu.");
    }
  };

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

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight,
      });
    }
  };
  const handleImageClick = async (event) => {
    const img = event.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * img.naturalWidth;
    const y = ((event.clientY - rect.top) / rect.height) * img.naturalHeight;

    try {
      await axios.post("/api/add-path", {
        robot_id: robot.id,
        x_position: x,
        y_position: y,
        z_position: 0, // Örnek olarak z_position 0 olarak ayarlandı, isteğe bağlı değişiklik yapılabilir
      });

      alert("Yol başarıyla eklendi!");
      router.reload(); // Sayfayı yenileyerek yeni yolları göster
    } catch (error) {
      console.error("Yol ekleme hatası:", error);
      alert("Yol ekleme sırasında bir hata oluştu.");
    }
  };

  useEffect(() => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight,
      });
    }
  }, [imageRef.current]);

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
            <div className="row row-col-auto">
              <div className="col">
                <p>Harita:</p>
                {robot.photo && (
                  <div style={{ position: "relative" }}>
                    <img
                      src={`data:image/jpeg;base64,${robot.photo}`}
                      alt="Robot Harita"
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                      onClick={handleImageClick}
                      onMouseMove={handleMouseMove}
                      onLoad={handleImageLoad}
                      ref={imageRef}
                    />
                    <div className="mouse-info">
                      <p>
                        Fare Konumu: X: {mousePosition.x.toFixed(2)}, Y:{" "}
                        {mousePosition.y.toFixed(2)}
                      </p>
                    </div>
                    {paths.map((path, index) => {
                      const color = nodeColors[index % nodeColors.length];
                      const xPos =
                        imageSize.width / 2 + parseFloat(path.x_position);
                      const yPos =
                        imageSize.height / 2 - parseFloat(path.y_position);
                      return (
                        <div
                          key={path.node_id}
                          style={{
                            position: "absolute",
                            top: `${yPos}px`,
                            left: `${xPos}px`,
                            width: "7.5px",
                            height: "7.5px",
                            backgroundColor: color,
                            borderRadius: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                          title={`Nokta ${index + 1}: X: ${
                            path.x_position
                          } - Y: ${path.y_position}`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="col-3">
                <h5>Yeni Yol Ekle</h5>
                <form onSubmit={handleAddPath}>
                  <div className="form-group">
                    <label htmlFor="xPosition">X Pozisyonu:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="xPosition"
                      value={xPosition}
                      onChange={(e) => setXPosition(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="yPosition">Y Pozisyonu:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="yPosition"
                      value={yPosition}
                      onChange={(e) => setYPosition(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zPosition">Z Pozisyonu:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="zPosition"
                      value={zPosition}
                      onChange={(e) => setZPosition(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Yol Ekle
                  </button>
                </form>
                <h5>Robotun Yolları:</h5>
                <ul>
                  {paths.map((path, index) => (
                    <li key={path.node_id}>
                      <p>
                        Yol: {index + 1}, X: {path.x_position}, Y:{" "}
                        {path.y_position}, Z: {path.z_position}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const [robotRes, pathsRes] = await Promise.all([
    axios.get(`http://localhost:3000/api/robots/${params.id}`), // Robot detaylarını al
    axios.get(`http://localhost:3000/api/paths?robot_id=${params.id}`), // Robotun yollarını al
  ]);

  return {
    props: {
      robot: robotRes.data,
      paths: pathsRes.data,
    },
  };
}
