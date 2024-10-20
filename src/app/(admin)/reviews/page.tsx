"use client";
import { useMutation, useQuery } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import Dropdown from "@src/components/dropdown/Dropdown";
import Rating from "@src/components/rating/rating";
import SearchBar from "@src/components/searchBar/SearchBar";
import TabFilter from "@src/components/tabfilter/tabfilter";
import Pagination from "@src/components/table/pagination";
import Table from "@src/components/table/table";
import { MUTATION_TOGGLE_REVIEW, QUERY_REVIEWS } from "@src/graphql/review";
import { ILink } from "@src/interfaces/link";
import { IHeader } from "@src/interfaces/table";
import { plusIcon } from "@src/utils/icon/icon";
import { Routers } from "@src/utils/router";
import Link from "next/link";
import { useState } from "react";
import { IReviewResponse, IToggleReview } from "./_interface/review";

const tabsData = [
  {
    label: "Tất cả",
    status: null,
  },
  // {
  //   label: "Đang hoạt động",
  //   status: true,
  // },
  // {
  //   label: "Không hoạt động",
  //   status: false,
  // },
];

export default function Reviews() {
  const [pageIndex, setPageIndex] = useState<number>(1);

  // Search state
  const [searchTag, setSearchTag] = useState<string | null>("");
  const [searchValue, setSearchValue] = useState("");
  // Search state

  const [itemshownumber, setItemshownumber] = useState<string>("10");

  const { data, loading, refetch } = useQuery<IReviewResponse>(QUERY_REVIEWS, {
    variables: {
      pageIndex: pageIndex,
      pageSize: 10,
      sort: -1,
    },
  });

  const [mutateToggleReview] = useMutation<IToggleReview>(
    MUTATION_TOGGLE_REVIEW
  );

  const header: IHeader[] = [
    {
      label: "Tài khoản",
      key: "userName",
      w: 200,
    },
    {
      label: "Đánh giá",
      key: "rating",
      center:true,
    },
    {
      label: "Nội dung",
      key: "comment",
      w: 300,

    },

    {
      label: "Sản phẩm",
      key: "product",
      center:true,
    },

    {
      label: "Trạng thái",
      key: "isActive",
      center:true,
    },
    {
      label: "Hiện nội dung",
      key: "hidebtn",
      center:true,
    },
    {
      label: "Thao tác",
      key: "action",
      center:true,
    },
  ];
  const bodies =
    data?.reviews?.data?.map((review) => ({
      id: review._id,
      userName: review.user.userName,
      rating: <Rating rating={review.rating} />,
      comment: (
        <div
          className="line-clamp-2 overflow-hidden text-ellipsis"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2, // Giới hạn 2 dòng
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {review.comment}
        </div>
      ),

      product: review.prodId,
      isActive: (
        <div className={`status_${review.active}`}>
          {review.active ? "Đang hoạt động" : "Không hoạt động"}
        </div>
      ),
      hidebtn: (
        <label className="inline-flex items-center justify-between cursor-pointer rounded-lg px-4 py-2 ">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={review.active}
            onChange={() => toggleReview(review._id)}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-1 rounded-full peer dark:bg-neutral-gray-40 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-dark-color"></div>
        </label>
      ),
      action: (
        <Link
          className="h-[40px] p-2 flex items-center justify-center"
          href={Routers.review.pathReview + `/${review._id}`}
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
            <circle cx="12" cy="12" r="3" stroke="#0099E9" strokeWidth="1.5" />
          </svg>
        </Link>
      ),
    })) ?? [];

  const toggleReview = async (reviewId: string) => {
    try {
      const mutate = mutateToggleReview({
        variables: {
          reviewId,
        },
      });

      const resp = await toastPromise(mutate);

      if (resp.data?.toggleReview.success) {
        refetch();
      } else {
        toastNotify("error", resp.data?.toggleReview.message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchString = searchValue.trim();
    setSearchTag(searchString);
    refetch({ userName: searchString, pageIndex: 1 });
  };

  const removeSearchTag = () => {
    setSearchTag(null);
    setSearchValue("");
    refetch({ userName: "", pageIndex: 1 }); // Refetch lại dữ liệu
  };

  const dataLinks = data?.reviews.links;

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

  return (
    <div className="flex flex-col gap-4 py-9">
      <h1 className="text-26 font-500  text-neutral-gray-80 ">
        Đánh giá và bình luận
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
