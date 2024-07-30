import Layout from "@/components/layout/Layout";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerDocs() {
  return (
    <>
      <Layout>
        <div>
          <SwaggerUI url="/swagger.yaml" />
        </div>
      </Layout>
    </>
  );
}
