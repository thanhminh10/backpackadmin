"use client";
import { useMutation, useQuery } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import SearchBar from "@src/components/searchBar/SearchBar";
import TabFilter from "@src/components/tabfilter/tabfilter";
import Table from "@src/components/table/table";
import { MUTATE_DELETE_BANNER, QUERY_BANNERS } from "@src/graphql/banner";
import { IHeader } from "@src/interfaces/table";
import { appConfig } from "@src/utils/config";
import { editIcon, plusIcon, trashboxIcon } from "@src/utils/icon/icon";
import iconGroup from "@src/utils/images/group.png";
import { Routers } from "@src/utils/router";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IBannerResponse, IDeleteBannerResponse } from "./_interface/banner";
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
    label: "Ngưng hoạt động",
    status: false,
  },
];

export default function Banners() {
  const { data, loading, refetch } = useQuery<IBannerResponse>(QUERY_BANNERS);
  // Search state
  const [searchTag, setSearchTag] = useState<string | null>("");
  const [searchValue, setSearchValue] = useState("");
  // Search state
  const [itemshownumber, setItemshownumber] = useState<string>("10");

  const [mutateDeleteBanner] =
    useMutation<IDeleteBannerResponse>(MUTATE_DELETE_BANNER);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteBanner = async (bannerId: string) => {
    try {
      const mutate = mutateDeleteBanner({
        variables: {
          bannerId: bannerId,
        },
      });

      const resp = await toastPromise(mutate);

      if (resp.data?.deleteBanner.success) {
        refetch();
      } else {
        toastNotify("error", resp.data?.deleteBanner.message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchString = searchValue.trim();
    setSearchTag(searchString);
    refetch({ bannerTitle: searchString });
  };
  const removeSearchTag = () => {
    setSearchTag(null);
    setSearchValue("");
    refetch(); // Refetch lại dữ liệu
  };

  const header: IHeader[] = [
    {
      label: "Hình ảnh",
      key: "image",
      w: 100,
    },
    {
      label: "Tiêu đề",
      key: "title",
    },
    {
      label: "Url",
      key: "url",
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
    data?.banners.map((banner) => ({
      id: banner._id,
      image: (
        <div className="relative  w-[74px] h-[50px] rounded-lg border border-gray-50 overflow-hidden">
          <Image
            src={
              banner?.imageUrl
                ? banner.imageUrl.split("://")[0] === "https"
                  ? banner?.imageUrl
                  : appConfig.urlImg + banner.imageUrl
                : iconGroup
            }
            alt={banner.title}
            layout="fill"
            className={"absolute inset-0 object-cover"}
          />
        </div>
      ),
      title: banner.title,
      url: banner.url,
      active: (
        <div className={`status_${banner.isActive}`}>
          {banner.isActive ? "Đang hoạt động" : "Không hoạt động"}
        </div>
      ),
      actions: (
        <div className="flex gap-2 justify-center">
          <Link
            className="p-3 rounded-lg"
            href={Routers.banner.pathEditBanner + `?id=${banner._id}`}
          >
            {editIcon}
          </Link>
          <button
            className="p-3 rounded-lg"
            onClick={() => deleteBanner(banner._id)}
          >
            {trashboxIcon}
          </button>
        </div>
      ),
    })) ?? [];

  // const dataLinks = data?.banners?.links;
  // const link: ILink = {
  // pageIndex: dataLinks?.pageIndex ?? 1,
  // pageSize: dataLinks?.pageSize ?? 10,
  // totalItems: dataLinks?.totalItems ?? 0,
  // totalPages: dataLinks?.totalPages ?? 0,
  // }
  const options = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "30", label: "30" },
    { value: "40", label: "40" },
  ];

  // const handleSelectNumberResult = (value: string) => {
  //   setItemshownumber(value);
  //   refetch({ pageIndex: pageIndex ,pageSize: Number(value) ,  sort: -1,});
  // };

  const handleRefetchTabData = (args: {
    active: Boolean | null;
    pageIndex: number;
  }) => {
    refetch(args);
  };

  if (loading) return <>...Loading</>;

  return (
    <div className="flex flex-col gap-4 py-9">
      <h1 className="text-26 font-500  text-neutral-gray-80 ">Banner</h1>
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
          href={`${Routers.banner.pathAddBanner}`}
          className="flex gap-1 bg-dark-color text-white h-[48px] p-[12px_24px] rounded-[12px]"
        >
          {plusIcon}
          Thêm banner mới
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
        {/* Hiển thị
        <Dropdown
          options={options}
          placeholder="Select an option"
          onSelect={handleSelectNumberResult}
          value={itemshownumber}
          hiddenInputName="dropdownValue"
          menuPosition="top"
        />
        Kết quả */}
        <ul className="flex gap-2">
          {/* <Pagination
            totalPages={link?.totalPages ?? 1}
            pageIndex={link?.pageIndex ?? 1}
            onPaging={(pageIndex) => setPageIndex(pageIndex)}
          /> */}
        </ul>
      </nav>
    </div>
  );
}
