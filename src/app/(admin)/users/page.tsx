"use client";
import { useMutation, useQuery } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import Dropdown from "@src/components/dropdown/Dropdown";
import Pagination from "@src/components/table/pagination";
import Table from "@src/components/table/table";
import { MUTATION_DELETE_USER, QUERY_USERS } from "@src/graphql/user";
import { ILink } from "@src/interfaces/link";
import { IHeader } from "@src/interfaces/table";
import { appConfig, configImg } from "@src/utils/config";
import {
  AccountLevelType,
  mapAccountType,
} from "@src/utils/enum/accountLevelTypes";

import {
  editIcon,
  iconClose,
  iconSearch,
  plusIcon,
  trashboxIcon,
} from "@src/utils/icon/icon";
import { Routers } from "@src/utils/router";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IDeleteUser, IUsersResponse } from "./_interface/user";

const tabsData = [
  {
    label: "Tất cả",
  },
  {
    label: "Người bán",
    accountType: AccountLevelType.SELLER,
  },
  {
    label: "Nhân viên bán hàng",
    accountType: AccountLevelType.SALE_MAN,
  },
  {
    label: "Khách hàng",
    accountType: AccountLevelType.USER,
  },
];

export default function Users() {
  const [searchUser, setSearchUser] = useState<string | null>("");
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [searchTag, setSearchTag] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [itemshownumber, setItemshownumber] = useState<string>("10");

  const { data, loading, refetch } = useQuery<IUsersResponse>(QUERY_USERS, {
    variables: {
      pageIndex: pageIndex,
      pageSize: 10,
      sort: -1,
      searchUser: searchUser,
    },
  });

  const [mutateDeleteUser] = useMutation<IDeleteUser>(MUTATION_DELETE_USER);

  useEffect(() => {
    refetch();
  });

  const header: IHeader[] = [
    {
      label: "Tài khoản",
      key: "account",
    },
    {
      label: "Vai trò",
      key: "level",
    },
    {
      label: "Điện thoại",
      key: "phone",
    },
    {
      label: "Thao tác",
      key: "actions",
      w: 250,
      center: true,
    },
  ];

  const bodies =
    data?.users?.data?.map((user) => {
      const userAvatar =
        user?.avatar && user?.avatar !== null
          ? configImg(user.avatar, appConfig)
          : "/User.svg";
      const userLevel = mapAccountType.find((item) => {
        if (item.value === user.userLevel) {
          return item;
        }
      });

      return {
        id: user._id,
        account: (
          <div className="text-16 font-500 text-start flex gap-2 items-center">
            <div className="relative rounded-full overflow-hidden w-[36px] h-[36px] bg-neutral-gray-20">
              <Image
                src={userAvatar}
                alt={user.userName}
                layout="fill"
                className="absolute inset-0 object-cover"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-16 font-500">{user.userName ?? ""}</p>
              <span className="text-14 font-400">{user?.email ?? ""}</span>
            </div>
          </div>
        ),
        level: userLevel?.key ?? "",

        phone: user?.phone ?? "",
        actions: (
          <div className="flex justify-between gap-2 px-6">
            <button type="button" className="p-3 rounded-lg">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.6711 13.783C9.46292 13.068 6.09645 13.3019 2.99189 14.4846C1.9431 14.8841 1.25 15.8898 1.25 17.0121V18.6705C1.25 20.3543 2.74963 21.6428 4.41426 21.3891L5.04565 21.2929C7.66675 20.8935 10.3332 20.8935 12.9544 21.2929L13.5857 21.3891C14.9541 21.5976 16.2109 20.7642 16.615 19.5256C16.1036 19.5534 15.581 19.4851 15.0741 19.3107C14.8234 19.7299 14.3355 19.986 13.8117 19.9062L13.1803 19.81C10.4094 19.3878 7.59057 19.3878 4.81968 19.81L4.1883 19.9062C3.43165 20.0215 2.75 19.4359 2.75 18.6705V17.0121C2.75 16.5122 3.05872 16.0642 3.52588 15.8863C6.34641 14.8118 9.40419 14.5969 12.3196 15.2415C12.3445 14.751 12.4588 14.2572 12.6711 13.783Z"
                  fill="#053729"
                />
                <circle
                  cx="4"
                  cy="4"
                  r="4"
                  transform="matrix(-1 0 0 1 13 3)"
                  stroke="#053729"
                  strokeWidth="1.5"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.2784 3.51187C18.4531 3.13633 18.8992 2.97356 19.2748 3.14833L21.6151 4.23746C21.9907 4.41222 22.1534 4.85833 21.9787 5.23387L18.4474 12.8221C19.6445 13.7544 20.0854 15.4204 19.418 16.8547C18.6417 18.5228 16.6601 19.2457 14.992 18.4695C13.324 17.6932 12.601 15.7116 13.3773 14.0435C14.0447 12.6093 15.6033 11.8737 17.0874 12.1892L18.9409 8.20644L17.2805 7.43375C16.9049 7.25898 16.7422 6.81287 16.9169 6.43733C17.0917 6.06179 17.5378 5.89903 17.9134 6.07379L19.5738 6.84649L20.3023 5.28097L18.6419 4.50828C18.2664 4.33352 18.1036 3.88741 18.2784 3.51187ZM17.1703 13.7887C16.2533 13.362 15.164 13.7594 14.7372 14.6764C14.3105 15.5934 14.7079 16.6828 15.6249 17.1095C16.5419 17.5363 17.6313 17.1388 18.058 16.2218C18.4848 15.3048 18.0873 14.2155 17.1703 13.7887Z"
                  fill="#053729"
                />
              </svg>
            </button>

            <Link
              href={Routers.user.pathEditUser + `?userId=${user._id}`}
              className="p-3 rounded-lg"
            >
              {editIcon}
            </Link>
            <button
              onClick={() => deleteUser(user._id)}
              className="p-3 rounded-lg"
            >
              {trashboxIcon}
            </button>
          </div>
        ),
      };
    }) ?? [];

  const deleteUser = async (userId: string) => {
    try {
      const mutate = mutateDeleteUser({
        variables: {
          userId,
        },
      });

      const resp = await toastPromise(mutate);

      const { success, message } = resp.data?.deleteUser!;

      if (success) {
        refetch();
      } else {
        toastNotify("error", message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  const onSearch = (e: FormData) => {
    const searchString = String(e.get("search") || "");
    const form = {
      searchUser: searchString,
    };
    setSearchUser(searchString);
    setSearchTag(searchString); // Set search tag
    setPageIndex(1); // Reset page index to 1
    refetch(form); // Refetch data with the updated search form
  };

  const removeSearchTag = () => {
    setSearchTag(""); // Clear search tag
    setSearchValue(""); // Clear search input value
    refetch({ searchUser: "", pageIndex: 1 }); // Refetch with cleared search and reset page index
  };

  const dataLinks = data?.users.links;

  const link: ILink = {
    pageIndex: dataLinks?.pageIndex ?? 1,
    pageSize: dataLinks?.pageSize ?? 10,
    totalItems: dataLinks?.totalItems ?? 0,
    totalPages: dataLinks?.totalPages ?? 0,
  };

  const filterStatus = (idx: number) => {
    const selectedTab = tabsData[idx];
    const accountType = selectedTab.accountType;

    // Thực hiện filter data dựa trên accountType.
    refetch({
      userLevel: accountType, // Gửi giá trị accountType nếu có
      pageIndex: 1,
      sort: -1,
    });

    // Đổi tab hiện tại
    setActiveTabIndex(idx);
  };
  const options = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "30", label: "30" },
    { value: "40", label: "40" },
  ];

  const handleSelectNumberResult = (value: string) => {
    setItemshownumber(value);
    refetch({ pageIndex: pageIndex, pageSize: Number(value), sort: -1 });
  };

  return (
    <div className="flex flex-col gap-4 py-9">
      <h1 className="text-26 font-500  text-neutral-gray-80 ">
        Quản lý tài khoản
      </h1>
      {/* <div>Dashboard / Products Management</div> */}
      <div className="flex justify-between flex-col lg:flex-row gap-3 items-start">
        <nav>
          <div className="flex space-x-3 border-b border-white">
            {tabsData.map((tab, idx) => (
              <button
                key={idx}
                className={`pt-2.5 pr-3 py-4 pl-3 ${
                  idx === activeTabIndex
                    ? "border-b border-neutral-gray-60 border-opacity-100"
                    : ""
                }`}
                onClick={() => filterStatus(idx)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
        <div className="flex flex-col gap-3 ">
          <form
            action={onSearch}
            className="w-[588px] h-[48px] rounded-tl-md rounded-br-none rounded-bl-none rounded-tr-none"
          >
            <div className="relative w-full h-full">
              <input
                type="text"
                name="search"
                className="w-full  italic text-16 font-300 "
                placeholder="Tìm kiếm theo tên sản phẩm, SKU,..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
              />
              <button
                type="submit"
                className="absolute top-1/2 right-4 transform -translate-y-1/2"
              >
                {iconSearch}
              </button>
            </div>
          </form>
          <div className="flex flex-wrap gap-4">
            {searchTag && (
              <>
                <button
                  className="py-[4px] px-3 bg-white rounded-[16px] cursor-pointer"
                  onClick={removeSearchTag}
                >
                  <span> Xóa tất cả </span>
                  {iconClose}
                </button>

                <button
                  className="py-[4px] px-3 bg-white rounded-[16px] cursor-pointer"
                  onClick={removeSearchTag}
                >
                  <span> Từ khoá: {searchTag} </span>
                  {iconClose}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <Link
          href={`${Routers.user.pathAddUser}`}
          className="flex gap-1 bg-dark-color text-white h-[48px] p-[12px_24px] rounded-[12px]"
        >
          {plusIcon}
          Thêm tài khoản mới
        </Link>
      </div>

      <div className="border rounded-[8px] bg-white overflow-auto">
        {bodies && header && <Table headers={header} bodies={bodies} />}
      </div>
      <nav
        className="flex items-center flex-column flex-wrap md:flex-row justify-between"
        aria-label="Table navigation"
      >
        <div></div>
        <div className="flex gap-2 items-center">
          Hiển thị
          <Dropdown
            options={options}
            placeholder="Select an option"
            onSelect={handleSelectNumberResult}
            value={itemshownumber}
            hiddenInputName="dropdownValue"
            menuPosition="top"
          />
          Kết quả
        </div>
        <ul className="flex gap-2">
          <Pagination
            totalPages={link?.totalPages ?? 1}
            pageIndex={link?.pageIndex ?? 1}
            onPaging={(pageIndex) => setPageIndex(pageIndex)}
          />
        </ul>
      </nav>
    </div>
  );
}
