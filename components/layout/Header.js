import Link from "next/link";

const Header = () => {
  return (
    <>
      <div className="container">
        <header className="d-flex flex-wrap py-4 mb-4 border-bottom">
          <div className="row row-cols-auto align-items-center hover-up">
            <Link href="/">
              <img
                src="/assets/imgs/onderlift-logo.png"
                alt="onderlift-logo"
                className="header-logo"
              ></img>
            </Link>
            <Link href="/dashboard"></Link>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
