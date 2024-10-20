"use client";
import { useMutation, useQuery } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import Dropdown from "@src/components/dropdown/Dropdown";
import SearchBar from "@src/components/searchBar/SearchBar";
import TabFilter from "@src/components/tabfilter/tabfilter";
import Pagination from "@src/components/table/pagination";
import Table from "@src/components/table/table";
import { MUTATE_MULTI_DELETE_CATE } from "@src/graphql/category/mutation";
import { QUERY_CATEGORIES } from "@src/graphql/category/query";
import { ILink } from "@src/interfaces/link";
import { IHeader } from "@src/interfaces/table";
import { appConfig } from "@src/utils/config";
import { editIcon, plusIcon } from "@src/utils/icon/icon";
import iconGroup from "@src/utils/images/group.png";
import { Routers } from "@src/utils/router";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ICategoryResponse,
  IDeleteCategoryResponse,
} from "./_interface/category";

const tabsData = [
  {
    label: "Tất cả",
    status: null,
  },
  {
    label: "Đang hoạt động",
    status: true,
  },
  {
    label: "Không hoạt động",
    status: false,
  },
];

export default function Categories() {
  const [selected, setSelected] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [searchTag, setSearchTag] = useState<string | null>("");
  const [searchValue, setSearchValue] = useState("");
  const [itemshownumber, setItemshownumber] = useState<string>("10");

  // Query
  const { data, loading, refetch } = useQuery<ICategoryResponse>(
    QUERY_CATEGORIES,
    {
      variables: {
        cateName: null,
        pageIndex: pageIndex,
        pageSize: 10,
        sort: -1,
      },
    }
  );
  const [mutateMultiDeleteCate] = useMutation<IDeleteCategoryResponse>(
    MUTATE_MULTI_DELETE_CATE
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  /**
   * handle table
   */
  const header: IHeader[] = [
    {
      label: "Hình ảnh",
      key: "logo",
    },
    {
      label: "Tên danh mục sản phẩm",
      key: "name",
    },
    {
      label: "Số lượng sản phẩm",
      key: "productNumber",
      center: true,
      w: 250,
    },
    {
      label: "Trạng thái",
      key: "active",
      center: true,
    },
    {
      label: "Thao tác",
      key: "actions",
      center: true,
    },
  ];
  const bodies =
    data?.categories.data?.map((cate) => ({
      selected: false,
      id: cate._id,
      logo: (
        <Image
          src={
            cate?.logo
              ? cate.logo.split("://")[0] === "https"
                ? cate?.logo
                : appConfig.urlImg + cate.logo
              : iconGroup
          }
          alt={cate.name}
          width={50}
          height={50}
          className={"w-[50px] h-[50px] rounded-lg border border-gray-50"}
        />
      ),
      name: cate.name,
      productNumber: cate.products?.length,
      active: (
        <div className={`status_${cate.isActive}`}>
          {cate.isActive ? "Đang hoạt động" : "Không hoạt động"}
        </div>
      ),
      actions: (
        <div className="flex gap-2 justify-center">
          <Link
            className="p-3 rounded-lg"
            href={Routers.category.pathEditCategory + `?id=${cate._id}`}
          >
            {editIcon}
          </Link>
        </div>
      ),
    })) ?? [];
  const options = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "30", label: "30" },
    { value: "40", label: "40" },
  ];

  const dataLinks = data?.categories?.links;
  const link: ILink = {
    pageIndex: dataLinks?.pageIndex ?? 1,
    pageSize: dataLinks?.pageSize ?? 10,
    totalItems: dataLinks?.totalItems ?? 0,
    totalPages: dataLinks?.totalPages ?? 0,
  };

  const deleteCategories = async () => {
    try {
      const mutate = mutateMultiDeleteCate({
        variables: {
          cateIds: selected,
        },
      });

      const resp = await toastPromise(mutate);

      if (resp.data?.multipleDeleteCategories.success) {
        setSelected([]);
        refetch();
      } else {
        toastNotify("error", resp.data?.multipleDeleteCategories.message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchString = searchValue.trim();
    setSearchTag(searchString);
    refetch({ cateName: searchString, pageIndex: 1 });
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

  if (loading) return <>...Loading</>;
  return (
    <div className="flex flex-col gap-4 py-9">
      <h1 className="text-26 font-500  text-neutral-gray-80 ">
        Danh mục sản phẩm
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
      <div className="flex justify-between">
        <Link
          href={`${Routers.category.pathAddCategory}`}
          className="flex gap-1 bg-dark-color text-white h-[48px] p-[12px_24px] rounded-[12px]"
        >
          {plusIcon}
          Thêm danh mục mới
        </Link>
      </div>

      <div className="border rounded-[8px] bg-white overflow-auto">
        {bodies && header && (
          <Table
            headers={header}
            bodies={bodies}
            checkbox={true}
            selectMany={setSelected}
          />
        )}
      </div>

      <nav
        className="flex items-center flex-column flex-wrap md:flex-row justify-between"
        aria-label="Table navigation"
      >
        <button
          className="flex gap-1 py-3 px-6  border  border-semantics-error text-semantics-error text-16-400 rounded-[12px]"
          onClick={deleteCategories}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.05063 8.73418C4.20573 7.60763 5.00954 6 6.41772 6H17.5823C18.9905 6 19.7943 7.60763 18.9494 8.73418V8.73418C18.3331 9.55584 18 10.5552 18 11.5823V18C18 20.2091 16.2091 22 14 22H10C7.79086 22 6 20.2091 6 18V11.5823C6 10.5552 5.66688 9.55584 5.05063 8.73418V8.73418Z"
              stroke="#B60202"
              strokeWidth="1.5"
            />
            <path
              d="M14 17L14 11"
              stroke="#B60202"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 17L10 11"
              stroke="#B60202"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 6L15.4558 4.36754C15.1836 3.55086 14.4193 3 13.5585 3H10.4415C9.58066 3 8.81638 3.55086 8.54415 4.36754L8 6"
              stroke="#B60202"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Xoá mục đã chọn
        </button>
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
