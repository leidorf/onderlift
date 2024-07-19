import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from './api-doc/react-swagger';

export async function getStaticProps() {
  const spec = await getApiDocs();
  return {
    props: {
      spec,
    },
  };
}

function ApiDocPage({ spec }) {
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}

export default ApiDocPage;
