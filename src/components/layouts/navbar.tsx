import { Routers } from "@src/utils/router";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [toggleNav, setToggleNav] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    router.push(Routers.auth.pathLogin);
  };

  return (
    <>
      <header className="bg-white lg:hidden">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link
              href={Routers.dashboard.pathDashboard}
              className="flex items-center mx-auto w-28"
            >
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 283.46 283.46"
                xmlSpace="preserve"
              >
                <style
                  type="text/css"
                  dangerouslySetInnerHTML={{
                    __html: "\n\t.st0{fill:#F36D21;}\n\t.st1{fill:#DE1F26;}\n",
                  }}
                />
                <path
                  className="st0"
                  d="M141.6,148.32c-8.15,54.93-117.16,26-117.16,26s55.45,44.01,131.67,23.77c46.98-12.47,47.58-43.5,47.18-49.95
	C186.57,149.32,166.07,149.68,141.6,148.32z"
                />
                <path
                  className="st1"
                  d="M261.46,137.83c0,0-154.43,16.67-171.71-17.35c-16.2-31.89,22.37-37.78,38.93-19.13
	c14.64,16.48,13.7,30.78,13.7,30.78s18.03,1.84,27.63,1.85c12.08,0.01,28.48-0.47,28.48-0.47s-7.23-32.08-72.15-52.23
	c-49.82-15.48-97.63,6.96-93.52,28.64c3.52,18.58,48.78,34.75,105.49,38.21C223.3,153.33,261.46,137.83,261.46,137.83z"
                />
              </svg>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md text-gray-700"
              onClick={() => setToggleNav(!toggleNav)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-24 h-24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <g id="icon / jam-icons / outline &amp; logos / menu">
                  <path
                    id="Vector"
                    d="M6 7H11C11.2652 7 11.5196 7.10536 11.7071 7.29289C11.8946 7.48043 12 7.73478 12 8C12 8.26522 11.8946 8.51957 11.7071 8.70711C11.5196 8.89464 11.2652 9 11 9H6C5.73478 9 5.48043 8.89464 5.29289 8.70711C5.10536 8.51957 5 8.26522 5 8C5 7.73478 5.10536 7.48043 5.29289 7.29289C5.48043 7.10536 5.73478 7 6 7V7ZM13 15H18C18.2652 15 18.5196 15.1054 18.7071 15.2929C18.8946 15.4804 19 15.7348 19 16C19 16.2652 18.8946 16.5196 18.7071 16.7071C18.5196 16.8946 18.2652 17 18 17H13C12.7348 17 12.4804 16.8946 12.2929 16.7071C12.1054 16.5196 12 16.2652 12 16C12 15.7348 12.1054 15.4804 12.2929 15.2929C12.4804 15.1054 12.7348 15 13 15ZM6 11H18C18.2652 11 18.5196 11.1054 18.7071 11.2929C18.8946 11.4804 19 11.7348 19 12C19 12.2652 18.8946 12.5196 18.7071 12.7071C18.5196 12.8946 18.2652 13 18 13H6C5.73478 13 5.48043 12.8946 5.29289 12.7071C5.10536 12.5196 5 12.2652 5 12C5 11.7348 5.10536 11.4804 5.29289 11.2929C5.48043 11.1054 5.73478 11 6 11Z"
                    fill="#001D6C"
                  />
                </g>
              </svg>
            </button>
          </div>
        </nav>
        <hr />
        {/* Mobile menu, show/hide based on menu open state. */}
      </header>
      <div
        className={`fixed top-0 z-10  flex flex-row-reverse h-full lg:hidden w-screen transition-all duration-500 bg-gray-500/85 ${
          !toggleNav ? "hidden" : "block"
        }`}
      >
        <div className="relative w-2/3 bg-white overflow-y-auto px-6 py-6 transition delay-500 duration-500 ease-in-out">
          <div className="flex items-center justify-between">
            <Link
              href={Routers.dashboard.pathDashboard}
              className="flex items-center mb-5 mx-auto w-28"
            >
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 283.46 283.46"
                xmlSpace="preserve"
              >
                <style
                  type="text/css"
                  dangerouslySetInnerHTML={{
                    __html: "\n\t.st0{fill:#F36D21;}\n\t.st1{fill:#DE1F26;}\n",
                  }}
                />
                <path
                  className="st0"
                  d="M141.6,148.32c-8.15,54.93-117.16,26-117.16,26s55.45,44.01,131.67,23.77c46.98-12.47,47.58-43.5,47.18-49.95
	C186.57,149.32,166.07,149.68,141.6,148.32z"
                />
                <path
                  className="st1"
                  d="M261.46,137.83c0,0-154.43,16.67-171.71-17.35c-16.2-31.89,22.37-37.78,38.93-19.13
	c14.64,16.48,13.7,30.78,13.7,30.78s18.03,1.84,27.63,1.85c12.08,0.01,28.48-0.47,28.48-0.47s-7.23-32.08-72.15-52.23
	c-49.82-15.48-97.63,6.96-93.52,28.64c3.52,18.58,48.78,34.75,105.49,38.21C223.3,153.33,261.46,137.83,261.46,137.83z"
                />
              </svg>
            </Link>
            <button
              type="button"
              className="rounded-md p-2.5 text-gray-700 absolute top-0 left-0"
              onClick={() => setToggleNav(!toggleNav)}
            >
              <span className="sr-only">Close menu</span>
              <svg
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <div className="-mx-3">
                  <Link
                    href={Routers.dashboard.pathDashboard}
                    className="flex items-center p-2 text-gray-900 rounded-lg"
                    onClick={() => setToggleNav(!toggleNav)}
                  >
                    <svg
                      className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 21"
                    >
                      <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                      <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                    </svg>
                    <span className="ms-3">Dashboard</span>
                  </Link>
                  <Link
                    href={Routers.product.pathProducts}
                    className="flex items-center p-2 text-gray-900 rounded-lg"
                    onClick={() => setToggleNav(!toggleNav)}
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Products
                    </span>
                  </Link>
                  <Link
                    href={Routers.category.pathCategories}
                    className="flex items-center p-2 text-gray-900 rounded-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 21 21"
                      fill="currentColor"
                      className="icon_5"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Categories
                    </span>
                  </Link>
                  <Link
                    href={Routers.brand.pathBrands}
                    className="flex items-center p-2 text-gray-900 rounded-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="icon_5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
                        clipRule="evenodd"
                      />
                    </svg>

                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Brands
                    </span>
                  </Link>
                  <Link
                    href={Routers.banner.pathBanners}
                    className="flex items-center p-2 text-gray-900 rounded-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 21 21"
                      fill="currentColor"
                      className="icon_5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6Zm1.5 1.5a.75.75 0 0 0-.75.75V16.5a.75.75 0 0 0 1.085.67L12 15.089l4.165 2.083a.75.75 0 0 0 1.085-.671V5.25a.75.75 0 0 0-.75-.75h-9Z"
                        clipRule="evenodd"
                      />
                    </svg>

                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Banners
                    </span>
                  </Link>
                  <Link
                    href={Routers.article.pathArticle}
                    className="flex items-center p-2 text-gray-900 rounded-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="icon_5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
                        clipRule="evenodd"
                      />
                      <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
                    </svg>

                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Articles
                    </span>
                  </Link>
                </div>
              </div>
              <div className="py-6">
                <button className="flex justify-start w-full" onClick={logout}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Navbar;
