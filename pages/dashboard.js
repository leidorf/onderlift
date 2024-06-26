import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";
import Link from "next/link";

const Dashboard = () => {
  return (
    <>
      <Layout>
        <PageHead headTitle="Dashboard"></PageHead>

        <div className="container">
          <h3>dashboard</h3>
          <h5>
            <Link href="/" className="text-success">
              anasayfa
            </Link>
          </h5>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;
