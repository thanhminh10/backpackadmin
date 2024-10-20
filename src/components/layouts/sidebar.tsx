import { IMenu } from "@src/interfaces/menu";
import { Routers } from "@src/utils/router";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const menu: IMenu[] = [
  {
    href: "/dashboard",
    label: "Tổng quan",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          stroke="#0E1010"
          strokeWidth="1.5"
        />
        <path
          d="M14 2L14 22"
          stroke="#0E1010"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 14L22 14"
          stroke="#0E1010"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: Routers.product.pathProducts,
    label: "Quản lý sản phẩm",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 6.16667V17.1667C2 17.5704 2.24274 17.9345 2.61538 18.0897L12 22M2 6.16667L11.2308 2.32051C11.7231 2.11538 12.2769 2.11538 12.7692 2.32051L17 4.08333M2 6.16667L7 8.25M12 10.3333V22M12 10.3333L22 6.16667M12 10.3333L7 8.25M12 22L21.3846 18.0897C21.7573 17.9345 22 17.5704 22 17.1667V6.16667M22 6.16667L17 4.08333M7 8.25L17 4.08333"
          stroke="#0E1010"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
    submenu: [
      {
        href: Routers.product.pathProducts,
        label: "Sản phẩm",
      },
      {
        href: Routers.category.pathCategories,
        label: "Danh mục sản phẩm",
      },
      {
        href: Routers.brand.pathBrands,
        label: "Thương hiệu",
      },
    ],
  },

  {
    href: Routers.order.pathOrder,
    label: "Quản lý đơn hàng",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="4"
          width="20"
          height="16"
          rx="5"
          stroke="#0E1010"
          strokeWidth="1.5"
        />
        <path
          d="M2 9.5H22"
          stroke="#0E1010"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 15.5H11"
          stroke="#0E1010"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: Routers.banner.pathBanners,
    label: "Banners",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          stroke="#0E1010"
          strokeWidth="1.5"
        />
        <path
          d="M2.5 17.5L4.7592 15.8863C5.47521 15.3749 6.45603 15.456 7.07822 16.0782L8.15147 17.1515C8.6201 17.6201 9.3799 17.6201 9.84853 17.1515L14.8377 12.1623C15.496 11.504 16.5476 11.4563 17.2628 12.0523L22 16"
          stroke="#0E1010"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle
          cx="2"
          cy="2"
          r="2"
          transform="matrix(-1 0 0 1 10 6)"
          stroke="#0E1010"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    href: Routers.article.pathArticle,
    label: "Bài viết",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 6C4 3.79086 5.79086 2 8 2H12H14.0633C14.6568 2 15.2197 2.26365 15.5997 2.71963L19.5364 7.44373C19.836 7.80316 20 8.25623 20 8.7241V12V18C20 20.2091 18.2091 22 16 22H8C5.79086 22 4 20.2091 4 18V6Z"
          stroke="#0E1010"
          strokeWidth="1.5"
        />
        <path
          d="M15 2.5V6C15 7.10457 15.8954 8 17 8H19.5"
          stroke="#0E1010"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 12H16"
          stroke="#0E1010"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 17H12"
          stroke="#0E1010"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: Routers.review.pathReview,
    label: "Đánh giá & bình luận",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.9718 2.70846C11.4382 1.93348 12.5618 1.93348 13.0282 2.70847L15.3586 6.58087C15.5262 6.85928 15.7995 7.05784 16.116 7.13116L20.5191 8.15091C21.4002 8.35499 21.7474 9.42356 21.1545 10.1066L18.1918 13.5196C17.9788 13.765 17.8744 14.0863 17.9025 14.41L18.2932 18.9127C18.3714 19.8138 17.4625 20.4742 16.6296 20.1214L12.4681 18.3583C12.1689 18.2316 11.8311 18.2316 11.5319 18.3583L7.37038 20.1214C6.53754 20.4742 5.62856 19.8138 5.70677 18.9127L6.09754 14.41C6.12563 14.0863 6.02124 13.765 5.80823 13.5196L2.8455 10.1066C2.25257 9.42356 2.59977 8.35499 3.48095 8.15091L7.88397 7.13116C8.20053 7.05784 8.47383 6.85928 8.64138 6.58087L10.9718 2.70846Z"
          stroke="#0E1010"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    href: Routers.user.pathUsers,
    label: "Quản lý tài khoản",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="3.40426"
          cy="3.40426"
          r="3.40426"
          transform="matrix(-1 0 0 1 15.6162 5)"
          stroke="#0E1010"
          strokeWidth="1.5"
        />
        <path
          d="M6.25488 16.8594C6.25488 16.1272 6.71518 15.474 7.40475 15.2277V15.2277C10.5136 14.1174 13.911 14.1174 17.0199 15.2277V15.2277C17.7095 15.474 18.1698 16.1272 18.1698 16.8594V17.979C18.1698 18.9896 17.2747 19.7659 16.2743 19.6229L15.9407 19.5753C13.4677 19.222 10.957 19.222 8.48393 19.5753L8.15038 19.6229C7.14995 19.7659 6.25488 18.9896 6.25488 17.979V16.8594Z"
          stroke="#0E1010"
          strokeWidth="1.5"
        />
        <path
          d="M17.3194 11.9028C18.7966 11.9028 19.9941 10.7052 19.9941 9.22799C19.9941 7.75076 18.7966 6.55322 17.3194 6.55322"
          stroke="#0E1010"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M20.2491 18.0051L20.5111 18.0425C21.2972 18.1548 22.0005 17.5448 22.0005 16.7508V15.8711C22.0005 15.2958 21.6388 14.7826 21.097 14.5891C20.5565 14.3961 20.005 14.2458 19.4473 14.1382"
          stroke="#0E1010"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M6.68063 11.9028C5.2034 11.9028 4.00586 10.7052 4.00586 9.22799C4.00586 7.75076 5.2034 6.55322 6.68063 6.55322"
          stroke="#0E1010"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M3.75094 18.0051L3.48886 18.0425C2.70281 18.1548 1.99954 17.5448 1.99954 16.7508V15.8711C1.99954 15.2958 2.36121 14.7826 2.90301 14.5891C3.44346 14.3961 3.995 14.2458 4.55273 14.1382"
          stroke="#0E1010"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

interface SidebarProps {
  user: {
    id: string;
    userName: string;
    level: number;
    iat: number;
    exp: number;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const path = usePathname();
  const router = useRouter();
  // Track which menu is expanded
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const productPaths = [
      Routers.product.pathProducts,
      Routers.category.pathCategories,
      Routers.brand.pathBrands,
    ];
    const isPathMatched = productPaths.includes(path);
    setActiveIndex(isPathMatched ? 1 : null);
  }, [path]);

  // Function to toggle submenu visibility
  const handleToggle = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push(Routers.auth.pathLogin);
  };

  const listitem = menu.map((item, idx) => {
    if (item?.submenu && item?.submenu.length > 0) {
      return (
        <li key={idx} className={`${activeIndex === idx ? "" : ""}`}>
          <Link
            href={item.href ?? "/"}
            onClick={() => handleToggle(idx)}
            className="flex items-center pl-[24px] cursor-pointer w-[236px] h-[40px]  gap-[16px] hover:rounded-[0px_48px_48px_0px] hover:bg-white"
          >
            {item.icon}
            <span className="">{item.label}</span>
          </Link>

          {item.submenu && item.submenu.length > 0 && activeIndex === idx && (
            <ul className="transition-opacity duration-300 ease-in-out">
              {item.submenu.map((subItem, subIdx) => (
                <li key={subIdx}>
                  <Link
                    href={subItem.href ?? ""}
                    className="flex p-[8px_0px_8px_72px] gap-[16px] group text-16 font-700"
                  >
                    <span
                      className={`text-16 font-500 text-primary group-hover:font-700 group-hover:text-dark-color ${
                        path === subItem.href && "text-dark-color font-700"
                      }`}
                    >
                      {subItem.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    } else {
      return (
        <li key={idx} className={path == item.href ? "side_bar_active" : ""}>
          <Link
            href={item.href ?? "/"}
            className="flex items-center pl-[24px] cursor-pointer w-[236px] h-[40px]  gap-[16px] hover:rounded-[0px_48px_48px_0px] hover:bg-white"
          >
            {item.icon}
            <span className="">{item.label}</span>
          </Link>
        </li>
      );
    }
  });

  return (
    <div className="lg:flex lg:sticky flex-col top-0 hidden h-screen w-[260px] py-12 gap-6 bg-main-bg-color">
      <Link
        href={Routers.dashboard.pathDashboard}
        className="flex justify-center mx-auto w-full"
      >
        <h2 className="text-26 font-600">A103</h2>
      </Link>
      <Link
        href={`${
          user.id
            ? Routers.userProfile.pathUserProfile + "/" + user.id
            : "/dashboard"
        }`}
        className={`flex w-full h-11 items-center justify-center`}
      >
        {/* Avatar */}
        <Image
          alt="Logo"
          src={"/button/user-default.svg"}
          width={46}
          height={46}
        />
      </Link>
      <ul className="text-16 font-500 menu pr-6 px-0">
        {listitem}
        <li className="">
          <button
            className="flex items-center pl-[24px] cursor-pointer w-[236px] h-[40px]  gap-[16px] hover:rounded-[0px_48px_48px_0px] hover:bg-white"
            onClick={logout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            <span className="">Đăng xuất</span>
          </button>
        </li>
      </ul>
    </div>
  );
};
export default Sidebar;
