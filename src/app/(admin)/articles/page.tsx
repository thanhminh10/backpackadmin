"use client";
import { useMutation, useQuery } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import Dropdown from "@src/components/dropdown/Dropdown";
import SearchBar from "@src/components/searchBar/SearchBar";
import TabFilter from "@src/components/tabfilter/tabfilter";
import Pagination from "@src/components/table/pagination";
import Table from "@src/components/table/table";
import {
  MUTATION_ADD_LIST_ARTICLE,
  MUTATION_MULTI_DELETE_ARTICLE,
  QUERY_ARTICLES,
} from "@src/graphql/article";
import { ILink } from "@src/interfaces/link";
import { IHeader } from "@src/interfaces/table";
import { appConfig } from "@src/utils/config";
import { formatDate } from "@src/utils/format/format";
import { editIcon, plusIcon } from "@src/utils/icon/icon";
import iconGroup from "@src/utils/images/group.png";
import { Routers } from "@src/utils/router";
import Image from "next/image";
import Link from "next/link";
import Papa from "papaparse";
import { ChangeEvent, useState } from "react";
import {
  IAddListArticleResponse,
  IArticleResponse,
  IDeleteArticleResponse,
  IFormArticle,
} from "./_interface/article";
const tabsData = [
  {
    label: "Tất cả",
    status: true,
  },
];
export default function Article() {
  const [selected, setSelected] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);

  // Search state
  const [searchTag, setSearchTag] = useState<string | null>("");
  const [searchValue, setSearchValue] = useState("");
  // Search state

  const [itemshownumber, setItemshownumber] = useState<string>("10");

  const { data, loading, refetch } = useQuery<IArticleResponse>(
    QUERY_ARTICLES,
    {
      variables: {
        pageIndex: pageIndex,
        pageSize: Number(itemshownumber),
        sort: -1,
      },
    }
  );

  const [mutateDeleteArticle] = useMutation<IDeleteArticleResponse>(
    MUTATION_MULTI_DELETE_ARTICLE
  );

  const [mutateAddListArticle] = useMutation<IAddListArticleResponse>(
    MUTATION_ADD_LIST_ARTICLE
  );

  const header: IHeader[] = [
    {
      label: "Hình ảnh",
      key: "thumbnail",
      w: 200,
    },
    {
      label: "Tiêu đề",
      key: "title",
      w: 500,
    },
    {
      label: "Loại",
      key: "hot",
    },
    {
      label: "Ngày tạo",
      key: "created",
    },
    {
      label: "Người đăng",
      key: "poster",
    },
    {
      label: "Thao tác",
      key: "actions",
      center: true,
    },
  ];
  const bodies =
    data?.articles?.data?.map((article) => {
      const createdAt = formatDate(Number(article.createdAt) ?? "");
      return {
        id: article._id,
        thumbnail: (
          <div className="relative w-[74px] h-[50px] rounded-lg border border-gray-50 overflow-hidden">
            <Image
              src={
                article?.thumbnail
                  ? article.thumbnail.split("://")[0] === "https"
                    ? article?.thumbnail
                    : appConfig.urlImg + article.thumbnail
                  : iconGroup
              }
              alt={article.title}
              layout="fill"
              className={"absolute inset-0 object-cover"}
            />
          </div>
        ),
        title: article.title,
        hot: article.hot ? "Hot" : "",
        created: createdAt,
        poster: article?.poster?.useName ?? "",

        actions: (
          <div className="flex gap-2 justify-center">
            <Link
              className="p-3 rounded-lg"
              href={Routers.article.pathEditArticle + `?id=${article._id}`}
            >
              {editIcon}
            </Link>
          </div>
        ),
      };
    }) ?? [];

  const dataLinks = data?.articles.links;

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
  const deleteArticles = async () => {
    try {
      const mutate = mutateDeleteArticle({
        variables: {
          articleIds: selected,
        },
      });

      const resp = await toastPromise(mutate);

      if (resp.data?.multiDeleteArticle.success) {
        refetch();
      } else {
        toastNotify("error", resp.data?.multiDeleteArticle.message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchString = searchValue.trim();
    setSearchTag(searchString);
    refetch({ articleTitle: searchString });
  };

  const removeSearchTag = () => {
    setSearchTag(null);
    setSearchValue("");
    refetch({ articleTitle: null, pageIndex: 1 }); // Refetch lại dữ liệu
  };

  const addListArticle = async (data: IFormArticle[]) => {
    try {
      const mutate = mutateAddListArticle({
        variables: {
          articles: data,
        },
      });

      const resp = await toastPromise(mutate);
      const { data: dataResp, message } = resp.data?.createListArticle!;

      if (dataResp) {
        refetch();
      } else {
        toastNotify("error", message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    Papa.parse(file, {
      skipEmptyLines: true,
      header: true,
      worker: true,
      dynamicTyping: true,
      complete: function (results: any) {
        addListArticle(results.data);
      },
    });
    e.currentTarget.value = "";
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
      <h1 className="text-26 font-500  text-neutral-gray-80 ">Bài viết</h1>
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
          href={`${Routers.article.pathAddArticle}`}
          className="flex gap-1 bg-dark-color text-white h-[48px] p-[12px_24px] rounded-[12px]"
        >
          {plusIcon}
          Thêm bài viết mới
        </Link>
        <div className="flex gap-6">
          <button className="flex gap-1 h-[48px] p-[12px_24px] rounded-[12px] border border-dark-color text-dark-color">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.5 8.5L18.5 8.5C20.7091 8.5 22.5 10.2909 22.5 12.5L22.5 17.5C22.5 19.7091 20.7091 21.5 18.5 21.5L6.5 21.5C4.29086 21.5 2.5 19.7091 2.5 17.5L2.5 12.5C2.5 10.2909 4.29086 8.5 6.5 8.5L8.5 8.5"
                stroke="#053729"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M15.5 5.5L13.2071 3.20711C12.8166 2.81658 12.1834 2.81658 11.7929 3.20711L9.5 5.5"
                stroke="#053729"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12.5 3.5L12.5 15.5"
                stroke="#053729"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Xuất file
          </button>
          <button className="flex gap-1 h-[48px] p-[12px_24px] rounded-[12px] border border-dark-color text-dark-color">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 8L7 8C4.79086 8 3 9.79086 3 12L3 17C3 19.2091 4.79086 21 7 21L19 21C21.2091 21 23 19.2091 23 17L23 12C23 9.79086 21.2091 8 19 8L17 8"
                stroke="#053729"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M10 13L12.2929 15.2929C12.6834 15.6834 13.3166 15.6834 13.7071 15.2929L16 13"
                stroke="#053729"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M13 15L13 3"
                stroke="#053729"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <label htmlFor="file" className="cursor-pointer">
              Nhập file
            </label>
            <input
              type="file"
              id="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </button>
        </div>
      </div>

      <div className="border rounded-[8px] bg-white overflow-auto">
        {bodies && header && (
          <Table
            checkbox={true}
            selectMany={setSelected}
            headers={header}
            bodies={bodies}
          />
        )}
      </div>

      <nav
        className="flex items-center flex-column flex-wrap md:flex-row justify-between"
        aria-label="Table navigation"
      >
        <button
          className="flex gap-1 py-3 px-6  border  border-semantics-error text-semantics-error text-16-400 rounded-[12px]"
          onClick={deleteArticles}
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
