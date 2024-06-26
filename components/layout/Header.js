import Link from "next/link";

const Header = () => {
  return (
    <>
      <div className="container">
        <header className="d-flex flex-wrap justify-content-center py-4 mb-4 border-bottom">
          <Link
            href="/"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none"
          >
            <h3>test</h3>
          </Link>
        </header>
      </div>
    </>
  );
};

export default Header;
