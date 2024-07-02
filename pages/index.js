import Link from "next/link";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";
import React from "react";
import axios from "axios";

export default function HomePage({ robots }) {
  return (
    <>
      <Layout>
        <PageHead headTitle="Önder Lift"></PageHead>
        <div className="container">
          <div className="d-flex">
            <div className="me-auto">
              <ul>
                {robots.map((robot) => (
                  <li key={robot.id}>
                    <div>
                      <h5 className="text-decoration-underline">
                        <Link href={`/robots/${robot.id}`}>Robot ID: {robot.id}</Link>
                      </h5>
                      IP Adresi: {robot.ip_address}<br/>
                      {robot.photo && (
                        <span>
                          Harita Kayıtlı <br />
                        </span>
                      )}
                      <p>Oluşturulma Tarihi: {new Date(robot.creation).toLocaleString("tr-TR")}</p>
                    </div>
                    <br />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Link
                href="./add-robot"
                className="text-success"
              >
                <button className="btn btn-success">Robot Ekle</button>
              </Link>
            </div>
          </div>
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
