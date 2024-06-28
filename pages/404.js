import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";

const Error = () => {
  return (
    <>
      <Layout>
        <PageHead headTitle="404"></PageHead>
        <div className="container text-center">
          <h3 className="text-danger text-weight-bold">404 SAYFA BULUNAMADI</h3>
        </div>
      </Layout>
    </>
  );
};

export default Error;
