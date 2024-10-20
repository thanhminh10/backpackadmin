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
import { QUERY_PRODUCTS } from "@src/graphql/product";
import {
  MUTATION_CREATE_PRODUCT,
  MUTATION_MULTI_DELETE_PRODUCT,
} from "@src/graphql/product/mutation";
import { ILink } from "@src/interfaces/link";
import { IHeader } from "@src/interfaces/table";
import { appConfig } from "@src/utils/config";
import { formatPrice } from "@src/utils/format/format";
import {
  editIcon,
  editImgIcon,
  importFileIcon,
  plusIcon,
  uploadFileIcon,
} from "@src/utils/icon/icon";
import iconGroup from "@src/utils/images/group.png";
import { Routers } from "@src/utils/router";
import Image from "next/image";
import Link from "next/link";
import Papa from "papaparse";
import { ChangeEvent, useEffect, useState } from "react";
import {
  IDeleteProducts,
  IFormProduct,
  IProductResponse,
} from "./_interface/product";
import { ICreateProductResponse } from "./add-product/_interface/upsert-product";

const tabsData = [
  {
    label: "Tất cả",
    status: null,
  },
  {
    label: "Đang có sẵn",
    status: true,
  },
  {
    label: "Hết hàng",
    status: false,
  },
];

export default function Products() {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [searchTag, setSearchTag] = useState<string | null>("");
  const [searchValue, setSearchValue] = useState("");
  const [itemshownumber, setItemshownumber] = useState<string>("10");

  const [link, setLink] = useState<ILink>({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    active: null,
  });

  const [selected, setSelected] = useState<string[] | undefined>([]);

  const { data, loading, refetch } = useQuery<IProductResponse>(
    QUERY_PRODUCTS,
    {
      variables: {
        pageIndex: pageIndex,
        pageSize: 10,
        sort: -1,
        prodName: null,
        active: null,
      },
    }
  );

  const handleSelectNumberResult = (value: string) => {
    setItemshownumber(value);
    refetch({ pageIndex: pageIndex, pageSize: Number(value), sort: -1 });
  };

  const [mutationProduct] = useMutation<ICreateProductResponse>(
    MUTATION_CREATE_PRODUCT
  );
  const [mutateMultiDeleteProd] = useMutation<IDeleteProducts>(
    MUTATION_MULTI_DELETE_PRODUCT
  );

  useEffect(() => {
    const dataLink = data?.products.links;
    refetch();
    setLink({
      pageIndex: dataLink?.pageIndex ?? 1,
      pageSize: dataLink?.pageSize ?? 10,
      totalItems: dataLink?.totalItems ?? 0,
      totalPages: dataLink?.totalPages ?? 0,
    });

    if (!data?.products.success) {
      toastNotify("error", data?.products.message);
    }
  }, [refetch, data]);

  const header: IHeader[] = [
    {
      label: "Hình ảnh",
      key: "image",
    },
    {
      label: "SKU",
      key: "sku",
    },
    {
      label: "Tên sản phẩm",
      key: "name",
    },
    {
      label: "Trạng thái",
      key: "active",
      center: true,
    },
    {
      label: "Đơn giá",
      key: "price",
      right: true,
      w: 50,
    },
    {
      label: "Số lượng",
      key: "quantity",
      center: true,
      w: 150,
    },
    {
      label: "Đánh giá",
      key: "rate",
      center: true,
    },
    {
      label: "Thao tác",
      key: "actions",
      center: true,
    },
  ];

  const bodies =
    data?.products?.data?.map((prod) => ({
      id: prod._id,
      image: (
        <Image
          src={
            prod.image[0]?.url
              ? prod.image[0].url.split("://")[0] == "https"
                ? prod.image[0].url
                : appConfig.urlImg + prod.image[0].url
              : iconGroup
          }
          alt={
            prod.name.split("").length > 10
              ? prod.name.substring(0, 10).concat("...")
              : prod.name
          }
          width={50}
          height={50}
          className={
            prod.image[0]?.url
              ? "w-[50px] h-[50px] rounded-lg border border-gray-50"
              : ""
          }
        />
      ),
      sku: <span className="text-start">{prod?.sku ?? ""}</span>,
      name:
        prod.name.split("").length > 30 ? (
          <div className="text-start">
            {prod.name.substring(0, 30).concat("...")}
          </div>
        ) : (
          <div className="text-start">{prod.name}</div>
        ),
      active: (
        <div className={`status_${prod.isActive}`}>
          {prod.isActive ? "Đang có sẵn" : "Hết hàng"}
        </div>
      ),
      price: (
        <div className="w-142 flex gap-2 justify-end">
          <span className="text-16 font-500">{formatPrice(prod.price)}</span>{" "}
          <span className="text-16 font-500 underline">đ</span>
        </div>
      ),
      quantity: prod.quantity,
      rate: <Rating rating={prod.ratingCount} />,
      actions: (
        <div className="flex justify-center">
          <Link
            className="p-3 rounded-lg"
            href={Routers.product.pathUploadImage + `?prodId=${prod._id}`}
          >
            {editImgIcon}
          </Link>
          <Link
            className="p-3 rounded-lg"
            href={Routers.product.pathEditProduct + `?id=${prod._id}`}
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

  const addProducts = async (data: IFormProduct[]) => {
    try {
      const mutate = mutationProduct({
        variables: {
          prods: data,
        },
      });

      const resp = await toastPromise(mutate);

      const { data: dataResp, message } = resp.data?.createProduct!;

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
        addProducts(results.data);
      },
    });
    e.currentTarget.value = "";
  };

  const deleteProducts = async () => {
    try {
      const mutate = mutateMultiDeleteProd({
        variables: {
          prodIds: selected,
        },
      });

      const resp = await toastPromise(mutate);

      if (resp.data?.multipleDeleteProduct.success) {
        setSelected([]);
        refetch();
      } else {
        toastNotify("error", resp.data?.multipleDeleteProduct.message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchString = searchValue.trim();
    setSearchTag(searchString);
    refetch({ prodName: searchString, pageIndex: 1 });
  };

  const removeSearchTag = () => {
    setSearchTag(null);
    setSearchValue("");
    refetch({ active: null, pageIndex: 1 });
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
        Quản lý sản phẩm
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
          href={`${Routers.product.pathAddProduct}`}
          className="flex gap-1 bg-dark-color text-white h-[48px] p-[12px_24px] rounded-[12px]"
        >
          {plusIcon}
          Thêm sản phẩm mới
        </Link>
        <div className="flex gap-6">
          <button className="flex gap-1 h-[48px] p-[12px_24px] rounded-[12px] border border-dark-color text-dark-color">
            {uploadFileIcon}
            Xuất file
          </button>
          <button className="flex gap-1 h-[48px] p-[12px_24px] rounded-[12px] border border-dark-color text-dark-color">
            {importFileIcon}
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
          onClick={deleteProducts}
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
