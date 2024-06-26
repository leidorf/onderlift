import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Link from "next/link";
import Image from "next/image";

const Sidebar = ({ openClass }) => {

  return (
    <>
      <div
        className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar ${openClass}`}
      >
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-content-area">
            <div className="mobile-logo">
              <Link className="d-flex" href="/">
                <Image
                  alt="Sidebar Logo"
                  src="/assets/imgs/template/logo.png"
                  width={50}
                  height={50}
                ></Image>
              </Link>
            </div>
            <div className="perfect-scroll">
              <div className="mobile-menu-wrap mobile-header-border">
                <Tabs
                  defaultActiveKey="menu"
                  id="fill-tab-example"
                  className="nav nav-tabs nav-tabs-mobile mt-25"
                  fill
                >
                  <Tab eventKey="menu" title="Menu">
                    <div className="tab-pane">
                      <nav className="mt-15">
                        <ul className="mobile-menu font-heading">
                          <li>
                            <Link className="active" href="/">
                            home
                            </Link>
                          </li>
                          <li>
                            <Link href="/feature">ourfeatures</Link>
                          </li>
                          <li>
                            {" "}
                            <Link href="/pricing">pricing</Link>
                          </li>
                          <li>
                            {" "}
                            <Link href="/blog">blog</Link>
                          </li>
                          <li>
                            {" "}
                            <Link href="/about">about</Link>
                          </li>
                          <li>
                            {" "}
                            <Link href="/contact">contact</Link>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
