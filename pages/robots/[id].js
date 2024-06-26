import { useRouter } from "next/router";
import axios from "axios";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";
import Link from "next/link";

export default function Robot({ robot }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Layout>
        <PageHead headTitle={`Robot ${robot.id}`} />
        <div className="container">
          <div>
            <h4 className="text-primary">Robot ID: {robot.id}</h4>
            <br />
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">X Pozisyonu</th>
                  <th scope="col">Y Pozisyonu</th>
                  <th scope="col">Z Pozisyonu</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{robot.x_position}</th>
                  <th scope="row">{robot.y_position}</th>
                  <th scope="row">{robot.z_position}</th>
                </tr>
              </tbody>
              <br />
              <thead>
                <tr>
                  <th scope="col">Yaw</th>
                  <th scope="col">Roll</th>
                  <th scope="col">Pitch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="col">{robot.yaw}</th>
                  <th scope="col">{robot.roll}</th>
                  <th scope="col">{robot.pitch}</th>
                </tr>
              </tbody>
            </table>
            <p>Harita:</p>
            {robot.photo_path && (
              <img
                src={robot.photo_path}
                alt="Robot Harita"
                style={{ maxWidth: "4000px", maxHeight: "4000px" }}
              />
            )}
            <p>Robot Kayıt Tarihi: {robot.creation}</p>
          </div>
          <br />
          <div className="row">
            <div className="col-2">
              <h6>
                <Link href="/" className="nav-link text-primary">
                  Ana Sayfa
                </Link>
              </h6>
            </div>
            <div className="col-2">
              <h6>
                <Link
                  href={`/update-map?id=${robot.id}`}
                  className="nav-link text-warning mb-3"
                >
                  Haritayı Güncelle
                </Link>
              </h6>
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
