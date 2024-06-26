import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <>
      <div className="container">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <div className="col-md-4 d-flex align-items-center">
            <Link
              href="/"
              className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
            ></Link>
            <div className="mb-3 mb-md-0">&copy; 2024</div>
          </div>

          <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
            {/* github */}
            <li className="ms-3">
              <Link
                className="text-decoration-none"
                href="https://github.com/leidorf"
              >
                github
              </Link>
            </li>
          </ul>
        </footer>
      </div>
    </>
  );
};

export default Footer;
