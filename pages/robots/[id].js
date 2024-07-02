import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";
import Link from "next/link";

import odomListener from "@/lib/odom";
import imuListener from "@/lib/imu";
import RosConnection from "@/components/RosConnection";

import { deletePath, deletePathConf } from "@/utils/delete-path";
import { handleAddPath } from "@/utils/add-path";
import { nodeColors } from "@/utils/node-colors";
import { deleteRobot } from "@/utils/delete-robot";

export default function Robot({ robots, paths }) {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null);
  const odomData = odomListener();
  const imuData = imuListener();
  const [isDeletionEnabled, setIsDeletionEnabled] = useState(false);
  const [isAddingNode, setIsAddingNode] = useState(false);

  const robotXPos = imageSize.width / 2 +10 + parseFloat(odomData.position.x) * 20;
  const robotYPos = imageSize.height / 2 - 10 + parseFloat(odomData.position.y) * -20;
  const robotRotation = `rotate(${imuData.yaw}rad)`;

  //Robot silme fonskiyonu
  const onDeleteRobot = async () => {
    await deleteRobot(robots.id);
    router.push(`/`);
  };

  //Nokta silme fonksiyonu
  const onDeletePath = async (node_id) => {
    await deletePathConf(node_id);
    router.reload();
  };

  //Tüm noktalari silme fonksiyonu
  const deleteAllPaths = async () => {
    const confirmDeleteAllPaths = confirm("Tüm yollar silinsin mi?");
    if (confirmDeleteAllPaths) {
      try {
        const deletePromises = paths.map((path) => deletePath(path.node_id));
        await Promise.all(deletePromises);
        alert("Tüm yollar başarıyla silindi!");
        router.reload();
      } catch (error) {
        console.error("Yolları silme hatası:", error);
        alert("Yolları silme sırasında bir hata oluştu.");
        router.reload();
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
    if (isAddingNode) {
      const { x, y } = mousePosition;
      await handleAddPath(robots.id, Number(x), Number(y), 0);
      setIsAddingNode(!isAddingNode);
      router.reload();
    }
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
        <PageHead headTitle={`Robot ${robots.id}`} />
        <div className="container h6">
          <div>
            <h4>
              Robot ID: {robots.id}({robots.ip_address})
            </h4>
            <RosConnection />
            <br />
            {/* Robota ait konum ve aci bilgileri */}
            <div>
              <div className="row">
                <div className="col-3 bg-light fw-bold">X Pozisyonu</div>
                <div className="col-3 bg-light fw-bold">Y Pozisyonu</div>
                <div className="col-3 bg-light fw-bold">Z Pozisyonu</div>
                <div className="w-100"></div>
                <div className="col-3">{odomData.position.x}</div>
                <div className="col-3">{odomData.position.y}</div>
                <div className="col-3">{odomData.position.z}</div>
              </div>
              <br />
              <div className="row">
                <div className="col-3 bg-light fw-bold">Yaw</div>
                <div className="col-3 bg-light fw-bold">Roll</div>
                <div className="col-3 bg-light fw-bold">Pitch</div>
                <div className="w-100"></div>
                <div className="col-3">{imuData.yaw}</div>
                <div className="col-3">{imuData.roll}</div>
                <div className="col-3">{imuData.pitch}</div>
              </div>
            </div>
            <br />
            <div className="row row-col-auto">
              <div className="col">
                {/* Robota ait harita gorseli */}
                <p>Harita: {isAddingNode && <span> Nokta Ekleme Modu Aktif</span>}</p>
                {robots.photo && (
                  <div style={{ position: "relative" }}>
                    <img
                      src={`data:image/jpeg;base64,${robots.photo}`}
                      alt="Robot Harita"
                      onClick={handleImageClick}
                      onMouseMove={handleMouseMove}
                      onLoad={handleImageLoad}
                      ref={imageRef}
                    />

                    {/* Harita gorseli uzerindeki fare bilgilerinin yansitilmasi */}
                    <div className="mouse-info">
                      <p>
                        Fare Konumu: X: {mousePosition.x.toFixed(2)}, Y: {mousePosition.y.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddingNode(!isAddingNode)}
                      className={`point-icon btn ${isAddingNode ? "active-mode" : ""}`}
                    >
                      <img
                        src="/assets/imgs/point-icon.png"
                        alt="Point Icon"
                      />
                    </button>
                    {/* Robota ait konum ve yönelim */}
                    <div
                      className="robot-marker"
                      style={{
                        top: `${robotYPos}px`,
                        left: `${robotXPos}px`,
                        transform: robotRotation,
                      }}
                    ></div>

                    {/* Robota ait noktalarin harita gorseli uzerinde gosterilmesi */}
                    {paths.map((path, index) => {
                      const color = nodeColors[index % nodeColors.length];
                      const xPos = imageSize.width / 2 + parseFloat(path.x_position);
                      const yPos = imageSize.height / 2 + parseFloat(path.y_position);
                      return (
                        <div
                          key={path.node_id}
                          className="node"
                          style={{
                            top: `${yPos}px`,
                            left: `${xPos}px`,
                            backgroundColor: color,
                          }}
                          title={`Nokta ${index + 1}: X: ${path.x_position} - Y: ${path.y_position}`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="col-3">
                <br />
                {/* Robota ait noktalarin yansitilmasi */}
                <div>
                  <h5>Robotun Yolları:</h5>
                  <input
                    type="checkbox"
                    checked={isDeletionEnabled}
                    onChange={() => setIsDeletionEnabled(!isDeletionEnabled)}
                  />
                  <label
                    onClick={() => setIsDeletionEnabled(!isDeletionEnabled)}
                    style={{ color: isDeletionEnabled ? "black" : "gray", cursor: "pointer", marginLeft: "5px" }}
                  >
                    Nokta silme modu
                  </label>
                </div>
                <p className="fw-lighter">(Silmek istediğiniz noktanın üzerine tıklayın.)</p>
                <br />
                <div>
                  <ul>
                    {paths.map((path, index) => (
                      <li key={path.node_id}>
                        <p className="text-wrap">
                          <button
                            onClick={() => onDeletePath(path.node_id)}
                            className={`text-${
                              isDeletionEnabled ? "danger" : "muted"
                            } btn btn-link text-decoration-none`}
                            disabled={!isDeletionEnabled}
                          >
                            Nokta {index + 1}
                          </button>
                          X: {path.x_position}, Y: {path.y_position}, Z: {Number(path.z_position).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <br />
                  <button
                    onClick={deleteAllPaths}
                    className={`btn ${isDeletionEnabled ? "btn-outline-danger" : "btn-outline-secondary"}`}
                    disabled={!isDeletionEnabled}
                  >
                    Tüm Noktaları Sil
                  </button>
                </div>
              </div>
            </div>
            <p>Robot Kayıt Tarihi: {new Date(robots.creation).toLocaleString("tr-TR")}</p>
          </div>
          <br />

          {/* Butonlar */}
          <div className="d-flex">
            <div className="me-auto">
              <Link href={`/`}>
                <button className="btn btn-primary">Ana Sayfa</button>
              </Link>
            </div>
            <div className="d-flex row row-cols-auto">
              <div className="col">
                <Link href={`/update-map?id=${robots.id}`}>
                  <button className="btn btn-warning">Haritayı Güncelle</button>
                </Link>
              </div>
              <div className="col">
                <button
                  className="btn btn-danger"
                  onClick={onDeleteRobot}
                >
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

  const paths = robots.map((robots) => ({
    params: { id: robots.id.toString() },
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
      robots: robotRes.data,
      paths: pathsRes.data,
    },
  };
}
