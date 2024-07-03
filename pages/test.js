import { useEffect, useState, useRef } from "react";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";
import Link from "next/link";
import { mapTopic } from "@/lib/map";
import useMapData from "@/utils/use-map-data";

const Test = () => {
  const { mapData, canvasRef } = useMapData();
  return (
    <>
      <Layout>
        <PageHead headTitle="Test"></PageHead>
        <div className="container">
          <h3>Test</h3>
          <h5>
            <Link
              href="/"
              className="text-success"
            >
              Anasayfa
            </Link>
          </h5>
          <div>
            {mapData ? (
              <canvas
                ref={canvasRef}
                width={mapData.info.width}
                height={mapData.info.height}
              />
            ) : (
              <p>Loading map data...</p>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Test;
