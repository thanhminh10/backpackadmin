"use client";
import { useQuery } from "@apollo/client";
import Dropdown from "@src/components/dropdown/Dropdown";
import SearchBar from "@src/components/searchBar/SearchBar";
import TabFilter from "@src/components/tabfilter/tabfilter";
import Pagination from "@src/components/table/pagination";
import Table from "@src/components/table/table";
import { QUERY_ORDERS } from "@src/graphql/order";
import { ILink } from "@src/interfaces/link";
import { IHeader } from "@src/interfaces/table";
import { appConfig, configImg } from "@src/utils/config";
import { PaymentMap } from "@src/utils/enum/paymentTypes";
import { formatPrice } from "@src/utils/format/format";
import { Routers } from "@src/utils/router";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IOrdersResponse } from "./_interface/order";

const tabsData = [
  {
    label: "Tất cả",
    status: null,
  },
  // {
  //   label: "Đã thanh toán",
  //   status: true,
  // },
  // {
  //   label: "Chưa thanh toán",
  //   status: false,
  // },
];

export default function Orders() {
  const [pageIndex, setPageIndex] = useState<number>(1);

  // Search state
  const [searchTag, setSearchTag] = useState<string | null>("");
  const [searchValue, setSearchValue] = useState("");
  // Search state
  const [itemshownumber, setItemshownumber] = useState<string>("10");

  const { data, loading, refetch } = useQuery<IOrdersResponse>(QUERY_ORDERS, {
    variables: {
      userName: null,
      pageIndex: pageIndex,
      pageSize: 10,
      sort: -1,
    },
  });

  const header: IHeader[] = [
    {
      label: "Tài khoản",
      key: "user",
      w: 330,
    
    },
    {
      label: "Đơn hàng",
      key: "orderId",
      w:200,
      left: true,
    },
    {
      label: "Tổng chi tiêu",
      key: "totalSpending",
      right: true,
      w:200,
    },
    {
      label: "Phương thức",
      key: "paymentMethod",
      center: true,
      w: 250,
    },
    {
      label: "Trạng thái thanh toán",
      key: "PaymentStatus",
      center: true,
    },

    {
      label: "Thao tác",
      key: "action",
      w: 100,
      center: true,
    },
  ];

  const bodies =
    data?.orders?.data?.map((order) => {
      const payment = PaymentMap.filter(
        (item) => item?.value === order.paymentMethod
      );
      const totalSpending = Array.isArray(order.orderItem)
        ? order.orderItem.reduce((total, item) => total + item.price, 0)
        : 0;
      const userAvatar = order.user?.avatar
        ? configImg(order.user?.avatar, appConfig)
        : "/User.svg";
      return {
        user: (
          <div className="text-16 font-500 text-start flex gap-2 items-center">
            <div className="relative rounded-full overflow-hidden w-[36px] h-[36px] bg-neutral-gray-20">
              <Image
                src={userAvatar}
                alt={order.userName}
                layout="fill"
                className="absolute inset-0 object-cover"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-16 font-500">{order.userName ?? ""}</p>
              <span className="text-14 font-400">
                {order?.user?.email ?? ""}
              </span>
            </div>
          </div>
        ),
        orderId: <span className="text-16 font-500">#nhjh2ggss</span>,
        totalSpending: Array.isArray(order.orderItem) ? (
          <>
            {formatPrice(totalSpending)} <span className="underline">đ</span>
          </>
        ) : (
          ""
        ),
        paymentMethod: (
          <div className="flex justify-center">{payment[0]?.key}</div>
        ),
        PaymentStatus: (
          <div className={`status_true`}>
            {true ? "Đã thanh toán" : "Chưa thanh toán"}
          </div>
        ),
        action: (
          <Link
            className="h-[40px] p-2 flex items-center justify-center"
            href={Routers.order.pathOrder + `/${order._id}`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.20057 12.7844C2.93314 12.2954 2.93314 11.7045 3.20058 11.2154C4.9 8.10803 8.20336 6 12 6C15.7966 6 19.1 8.10809 20.7994 11.2156C21.0669 11.7046 21.0669 12.2956 20.7994 12.7846C19.1 15.892 15.7966 18 12 18C8.20336 18 4.89997 15.8919 3.20057 12.7844Z"
                stroke="#0099E9"
                strokeWidth="1.5"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="#0099E9"
                strokeWidth="1.5"
              />
            </svg>
          </Link>
        ),
      };
    }) ?? [];

  const dataLinks = data?.orders.links;

  const link: ILink = {
    pageIndex: dataLinks?.pageIndex ?? 1,
    pageSize: dataLinks?.pageSize ?? 10,
    totalItems: dataLinks?.totalItems ?? 0,
    totalPages: dataLinks?.totalPages ?? 0,
  };

  const options = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "30", label: "30" },
    { value: "40", label: "40" },
  ];

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchString = searchValue.trim();
    setSearchTag(searchString);
    refetch({ userName: searchString, pageIndex: 1 });
  };

  const removeSearchTag = () => {
    setSearchTag(null);
    setSearchValue("");
    refetch({ pageIndex: 1 }); // Refetch lại dữ liệu
  };

  const handleSelectNumberResult = (value: string) => {
    setItemshownumber(value);
    refetch({ pageIndex: pageIndex, pageSize: Number(value), sort: -1 });
  };

  const handleRefetchTabData = (args: {
    active: Boolean | null;
    pageIndex: number;
  }) => {
    refetch(args);
  };

  if (loading) return <>...loading</>;
  return (
    <div className="flex flex-col gap-4 py-9">
      <h1 className="text-26 font-500  text-neutral-gray-80 ">
        Quản lý đơn hàng
      </h1>
      <div className="flex justify-between flex-col lg:flex-row gap-3 items-start">
        <TabFilter tabsData={tabsData} refetch={handleRefetchTabData} />
        <SearchBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          searchTag={searchTag}
          onSearch={onSearch}
          removeSearchTag={removeSearchTag}
        />
      </div>

      <div className="border rounded-[8px] bg-white overflow-auto">
        {bodies && header && (
          <Table headers={header} bodies={bodies} checkbox={false} />
        )}
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
