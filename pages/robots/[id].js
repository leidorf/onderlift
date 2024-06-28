import { useRouter } from "next/router";
import axios from "axios";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Robot({ robot, paths }) {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null);
  //Noktalar karismasin diye farkli renkler kaydedildi
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

  //Nokta ekleme fonksiyonu
  const handleAddPath = async (x, y, z) => {
    try {
      await axios.post("/api/add-path", {
        robot_id: robot.id,
        x_position: x,
        y_position: y,
        z_position: z,
      });

      alert("Yol başarıyla eklendi!");
      router.reload();
    } catch (error) {
      console.error("Yol ekleme hatası:", error);
      alert("Yol ekleme sırasında bir hata oluştu.");
    }
  };

  //Robot silme fonksiyonu
  const handleDelete = async () => {
    const confirmDelete = confirm(`Robot ${robot.id} silinsin mi?`);
    if (confirmDelete) {
      try {
        await axios.delete(`/api/delete-robot?id=${robot.id}`);
        alert("Robot başarıyla silindi!");
        router.push("/"); // Anasayfaya yönlendir
      } catch (error) {
        console.error("Robot silme hatası:", error);
        alert("Robot silme sırasında bir hata oluştu.");
      }
    }
  };

  //Nokta silme fonksiyonu
  const handleDeletePath = async (node_id) => {
    const confirmDeletePath = confirm(`Yol silinsin mi?`);
    if (confirmDeletePath) {
      try {
        await axios.delete(`/api/delete-path?node_id=${node_id}`);
        alert("Yol başarıyla silindi!");
        router.reload();
      } catch (error) {
        console.error("Yol silme hatası:", error);
        alert("Yol silme sırasında bir hata oluştu.");
      }
    }
  };

  //Harita görseli üzerindeki fare konumunun tespit eden fonksiyon
  const handleMouseMove = (event) => {
    const img = event.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * img.naturalWidth;
    const y = ((event.clientY - rect.top) / rect.height) * img.naturalHeight;
    const centerX = img.naturalWidth / 2;
    const centerY = img.naturalHeight / 2;
    setMousePosition({ x: x - centerX, y: y - centerY });
  };

  //Sayfa veya harita görselinin boyutunu dinamik olarak tutan fonksiyon
  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight,
      });
    }
  };

  //Harita görseli uzerine tiklandiginda nokta ekleyen fonksiyon
  const handleImageClick = async () => {
    const { x, y } = mousePosition;
    await handleAddPath(Number(x), Number(y), 0);
  };

  //Sayfa veya harita görselinin boyutunu dinamik olarak tutan fonksiyon
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        setImageSize({
          width: imageRef.current.offsetWidth,
          height: imageRef.current.offsetHeight,
        });
      }
    };

    // Sayfa boyutu değiştiğinde veya bileşen yüklendiğinde resmin boyutunu güncelle
    window.addEventListener("resize", handleResize);
    handleResize(); // İlk yüklemede de boyutu ayarla

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
            {/* Robota ait konum ve aci bilgileri */}
            <div>
              <div className="row">
                <div className="col-3 bg-light fw-bold">X Pozisyonu</div>
                <div className="col-3 bg-light fw-bold">Y Pozisyonu</div>
                <div className="col-3 bg-light fw-bold">Z Pozisyonu</div>
                <div className="w-100"></div>
                <div className="col-3">{robot.x_position}</div>
                <div className="col-3">{robot.y_position}</div>
                <div className="col-3">{robot.z_position}</div>
              </div>
              <br />
              <div className="row">
                <div className="col-3 bg-light fw-bold">Yaw</div>
                <div className="col-3 bg-light fw-bold">Roll</div>
                <div className="col-3 bg-light fw-bold">Pitch</div>
                <div className="w-100"></div>
                <div className="col-3">{robot.yaw}</div>
                <div className="col-3">{robot.roll}</div>
                <div className="col-3">{robot.pitch}</div>
              </div>
            </div>
            <br />
            <div className="row row-col-auto">
              <div className="col">
                {/* Robota ait harita gorseli */}
                <p>Harita:</p>
                {robot.photo && (
                  <div style={{ position: "relative" }}>
                    <img
                      src={`data:image/jpeg;base64,${robot.photo}`}
                      alt="Robot Harita"
                      onClick={handleImageClick}
                      onMouseMove={handleMouseMove}
                      onLoad={handleImageLoad}
                      ref={imageRef}
                    />

                    {/* Harita gorseli uzerindeki fare bilgilerinin yansitilmasi */}
                    <div className="mouse-info">
                      <p>
                        Fare Konumu: X: {mousePosition.x.toFixed(2)}, Y:{" "}
                        {mousePosition.y.toFixed(2)}
                      </p>
                    </div>

                    {/* Robota ait noktalarin harita gorseli uzerinde gosterilmesi */}
                    {paths.map((path, index) => {
                      const color = nodeColors[index % nodeColors.length];
                      const xPos =
                        imageSize.width / 2 + parseFloat(path.x_position);
                      const yPos =
                        imageSize.height / 2 + parseFloat(path.y_position);
                      return (
                        <div
                          key={path.node_id}
                          className="node"
                          style={{
                            top: `${yPos}px`,
                            left: `${xPos}px`,
                            backgroundColor: color,
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
              <div className="col-sm-3">
                <br />
                {/* Robota ait noktalarin yansitilmasi */}
                <h5>Robotun Yolları:</h5>
                <p className="fw-lighter">
                  (Silmek istediğiniz noktanın üzerine tıklayın.)
                </p>
                <br />
                <ul>
                  {paths.map((path, index) => (
                    <li key={path.node_id}>
                      <p>
                        <span
                          onClick={() => handleDeletePath(path.node_id)}
                          className="text-primary text-decoration-underline"
                        >
                          Nokta {index + 1}
                        </span>
                        , X: {path.x_position}, Y: {path.y_position}, Z:{" "}
                        {path.z_position}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p>Robot Kayıt Tarihi: {robot.creation}</p>
          </div>
          <br />
          {/* Butonlar */}
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
  const response = await axios.get("http://localhost:3000/api/robots");
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
