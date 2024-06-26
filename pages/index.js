import Link from "next/link";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";
import React from "react";
import axios from "axios";

export default function HomePage({ robots }) {
  return (
    <>
      <Layout>
        <PageHead headTitle="onderlift"></PageHead>
        <div className="container">
          <div className="row">
            <div className="col-2">
              <h4>robots</h4>
            </div>
            <div className="col-4">
              <h4>
                <Link href="./add-robot" className="text-success">
                  Robot Ekle
                </Link>
              </h4>
            </div>
          </div>
          <div>
            <br />
            <ul>
              {robots.map((robot) => (
                <li key={robot.id}>
                  <div>
                    <h5>
                      <Link href={`/robots/${robot.id}`}>
                        Robot ID: {robot.id}
                      </Link>
                    </h5>
                    Oluşturulma Tarihi: {robot.creation}
                    <br />
                    {robot.photo_path && <span>Harita Kayıtlı</span>}
                  </div>
                  <br />
                </li>
              ))}
            </ul>
          </div>
          <h5>
            <Link href="/dashboard" className="text-primary">
              dashboard
            </Link>
          </h5>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  const res = await axios.get("http://localhost:3000/api/robots");
  let robots = res.data;

  return {
    props: {
      robots,
    },
  };
}
