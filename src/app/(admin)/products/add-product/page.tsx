"use client";
import { useMutation, useQuery } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import AutoComplete from "@src/components/autocomplete/autocomplete";
import Dropdown from "@src/components/dropdown/Dropdown";
import { MUTATE_ADD_BRAND, QUERY_BRANDS } from "@src/graphql/brand";
import { MUTATE_ADD_CATE } from "@src/graphql/category/mutation";
import { QUERY_CATEGORIES } from "@src/graphql/category/query";
import { MUTATION_CREATE_PRODUCT } from "@src/graphql/product/mutation";
import { client } from "@src/lib/client";
import { configEditor } from "@src/utils/editor-config";
import { Routers } from "@src/utils/router";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IBrandResponse } from "../../brands/_interface/brand";
import { ICreateBrandResponse } from "../../brands/add-brand/_interface/add-brand";
import { ICategoryResponse } from "../../categories/_interface/category";
import { ICreateCategoryResponse } from "../../categories/add-category/_interface/category";
import { IFormProduct } from "../_interface/product";
import { ICreateProductResponse } from "./_interface/upsert-product";

// Custom loading component
const LoadingComponent = () => <p>Loading editor, please wait...</p>;

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

export default function AddProduct() {
  const description = useRef("");
  const [selectedValue, setSelectedValue] = useState(true);
  const editor = useRef(null);
  const router = useRouter();

  const [mutationProduct, { loading }] = useMutation<ICreateProductResponse>(
    MUTATION_CREATE_PRODUCT
  );

  const {
    register,
    handleSubmit,
    setError,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<IFormProduct>();

  const { data: dataCates, refetch: cateRefetch } = useQuery<ICategoryResponse>(
    QUERY_CATEGORIES,
    {
      variables: {
        pageIndex: 1,
        pageSize: 10,
        active: true,
      },
    }
  );

  const { data: dataBrands, refetch: brandRefetch } = useQuery<IBrandResponse>(
    QUERY_BRANDS,
    {
      variables: {
        pageIndex: 1,
        pageSize: 10,
        active: true,
      },
    }
  );

  useEffect(() => {
    cateRefetch();
    brandRefetch();
  });

  const onSubmit: SubmitHandler<IFormProduct> = async (data: IFormProduct) => {
    console.log(data);

    if (!description.current) {
      setError("description", {
        message: "Description is required",
        type: "required",
      });
      return;
    }
    data.isActive = selectedValue;
    if (!data.brandId) delete data.brandId;
    if (!data.quantity) delete data.quantity;
    if (!data.quantitySold) delete data.quantitySold;
    if (!data.linkBuyProductOne) delete data.linkBuyProductOne;
    if (!data.linkBuyProductTwo) delete data.linkBuyProductTwo;
    if (!data.linkBuyProductThree) delete data.linkBuyProductThree;
    if (!data.keyword) delete data.keyword;

    try {
      const mutate = await  mutationProduct({
        variables: {
          prods: [
            {
              ...data,
              description: description.current,
            },
          ],
        },
      });
      if (mutate && mutate.data) {
        const { data, success, message } = mutate.data.createProduct;

        if(success && data && data.length > 0) {
          router.push(
            Routers.product.pathUploadImage + `?prodId=${data[0]._id}`
          );
        }
        else {
          toastNotify("error", message);
        }
      }
    
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  const onCheckErr = () => {
    if (description.current) {
      clearErrors("description");
    }
  };

  const handleChange = (value: string) => {
    setSelectedValue(value === "true"); // Convert 'true'/'false' string to boolean
  };

  const [mutateCategory] =
    useMutation<ICreateCategoryResponse>(MUTATE_ADD_CATE);
  const [mutateBrand] = useMutation<ICreateBrandResponse>(MUTATE_ADD_BRAND);

  const [cateSearchValue, setCateSearchValue] = useState("");
  const [brandSearchValue, setBrandSearchValue] = useState("");

  const formatDataCate = dataCates?.categories?.data?.map((item) => ({
    keyword: item.name,
    value: item._id,
  }));

  const formatDatabrand = dataBrands?.brands?.data?.map((item) => ({
    keyword: item.name,
    value: item._id,
  }));

  const handleKeywordAddCate = async (name: string) => {
    try {
      const { data } = await mutateCategory({
        variables: {
          cate: {
            name: name,
            isActive: true,
          },
        },
      });

      // Kiểm tra xem _id có phải là undefined không
      const newCategoryId = data?.createCategory.data?._id;
      if (!newCategoryId) {
        throw new Error("Failed to create category: ID is undefined");
      }

      cateRefetch(); // Refresh lại data sau khi thêm
      return { keyword: name, value: newCategoryId }; // Trả về keyword và id của danh mục mới
    } catch (error) {
      console.error("Error adding keyword:", error);
      throw error;
    }
  };

  const handleSearchCate = async (searchTerm: string) => {
    try {
      const { data } = await client.query({
        query: QUERY_CATEGORIES,
        variables: {
          cateName: searchTerm,
          pageIndex: 1,
          pageSize: 10,
          sort: -1,
        },
      });
      return data.categories.data.map(
        (item: { name: string; _id: string }) => ({
          keyword: item.name,
          value: item._id,
        })
      );
    } catch (error) {
      console.error("Search failed", error);
      return [];
    }
  };

  const handleKeywordAddBrand = async (name: string) => {
    try {
      const { data } = await mutateBrand({
        variables: {
          brand: {
            name: name,
            isActive: true,
          },
        },
      });

      // Kiểm tra xem _id có phải là undefined không
      const id = data?.createBrand.data?._id;
      if (!id) {
        throw new Error("Failed to create category: ID is undefined");
      }

      cateRefetch(); // Refresh lại data sau khi thêm
      return { keyword: name, value: id }; // Trả về keyword và id của danh mục mới
    } catch (error) {
      console.error("Error adding keyword:", error);
      throw error;
    }
  };

  const handleSearchBrand = async (searchTerm: string) => {
    try {
      const { data } = await client.query({
        query: QUERY_BRANDS,
        variables: {
          brandName: searchTerm,
          pageIndex: 1,
          pageSize: 10,
          sort: -1,
        },
      });
      return data.brands.data.map((item: { name: string; _id: string }) => ({
        keyword: item.name,
        value: item._id,
      }));
    } catch (error) {
      console.error("Search failed", error);
      return [];
    }
  };
  const options = [
    { value: "true", label: "Đang có sẵn" },
    { value: "false", label: "Hết hàng" },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="py-9 flex flex-col gap-6"
    >
      <h1 className="text-26 font-500 text-neutral-gray-80 ">
        Thêm sản phẩm mới
      </h1>
      <div className="grid grid-cols-12  gap-9">
        <div className="flex flex-col gap-6 col-span-8">
          <div className="section-wrapper w-full">
            <div className="flex flex-col gap-2">
              <h3 className="section-label">Thông tin sản phẩm</h3>
              <div className="section-item">
                <h6 className="section-item-label">Tên sản phẩm</h6>
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm"
                  className="section-item-input"
                  {...register("name", { required: true })}
                />
                {errors.name && errors.name.type === "required" && (
                  <p className="text_error">Nhập tên sản phẩm</p>
                )}
              </div>
              <div className="section-item">
                <h6 className="section-item-label">SKU</h6>
                <input
                  type="text"
                  placeholder="Nhập mã sản phẩm"
                  className="section-item-input"
                  {...register("sku", { required: false })}
                />
                {errors.sku && errors.sku.type === "required" && (
                  <p className="text_error">Nhập sku</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="section-label">Thông tin giá, số lượng</h3>
              <div className="flex flex-row gap-9">
                <div className="section-item-1-2">
                  <h6 className="section-item-label">Đơn giá</h6>
                  <input
                    type="number"
                    placeholder="0"
                    className="section-item-input"
                    {...register("price", {
                      required: true,
                      min: 1,
                      valueAsNumber: true,
                    })}
                  />
                  {errors.price && errors.price.type === "required" && (
                    <p className="text_error">Nhập đơn giá</p>
                  )}
                  {errors.price && errors.price.type === "min" && (
                    <p className="text_error">Price must be greater than 1</p>
                  )}
                </div>
                <div className="section-item-1-2">
                  <h6 className="section-item-label">Số lượng</h6>
                  <input
                    type="number"
                    placeholder="0"
                    className="section-item-input"
                    {...register("quantity", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="section-wrapper w-full">
            <div className="flex flex-col gap-2">
              <h3 className="section-label">Mô tả sản phẩm</h3>
              <div className="section-item">
                <JoditEditor
                  value={description.current}
                  onChange={(value) => {
                    description.current = value;
                  }}
                  config={configEditor}
                  ref={editor}
                />
              </div>
              {errors.description && errors.description.type && (
                <p className="text_error">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col col-start-9 gap-6">
          <div className="section-wrapper w-full">
            <div className="flex flex-col gap-2">
              <h3 className="section-label">Trạng thái</h3>
              <div className="section-item">
                <div>
                  <Dropdown
                    {...register("isActive")}
                    options={options}
                    onSelect={handleChange}
                    value={`${selectedValue}`}
                    hiddenInputName="isActive"
                    menuPosition="bottom"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="section-wrapper w-full ">
            <div className="flex flex-col gap-2">
              <h3 className="section-label">Phân loại</h3>
              <div className="section-item">
                <label
                  htmlFor="hotProductCheckbox"
                  className="flex items-center justify-start h-[42px] px-4 gap-2 rounded-lg border border-neutral-gray-40 bg-white cursor-pointer hover:bg-gray-100"
                >
                  <input
                    id="hotProductCheckbox"
                    className="w-4 h-4 border-gray-300 rounded"
                    type="checkbox"
                    {...register("hot")}
                  />
                  <span className="text-16-400 text-neutral-gray-60">
                    Sản phẩm nổi bật
                  </span>
                </label>
              </div>
              <div className="section-item">
                <h6 className="section-item-label">Thương hiệu</h6>
                <AutoComplete
                  data={formatDatabrand ?? []}
                  value={brandSearchValue}
                  {...register("brandId")}
                  onChange={(val: string) => {
                    setValue("brandId", val);
                    setBrandSearchValue(val);
                  }}
                  onSearch={handleSearchBrand}
                  onKeywordAdd={handleKeywordAddBrand}
                  field="Nhập thương hiệu"
                  hiddenInputName="brandId"
                />
              </div>
              {errors.brandId && errors.brandId.type === "required" && (
                <p className="text_error">Chọn thương hiệu</p>
              )}
            </div>
            <div className="section-item">
              <h6 className="section-item-label">Danh mục</h6>
              <AutoComplete
                data={formatDataCate ?? []}
                value={cateSearchValue}
                {...register("cateId")}
                onChange={(val: string) => {
                  setValue("cateId", val);
                  setCateSearchValue(val);
                }}
                onSearch={handleSearchCate}
                onKeywordAdd={handleKeywordAddCate}
                field="Nhập danh mục"
                hiddenInputName="cateId"
              />

              {errors.cateId && (
                <p className="text_error">{errors.cateId.message}</p>
              )}
            </div>
            <div className="section-item">
              <h6 className="section-item-label">Từ khóa</h6>
              <input
                type="text"
                placeholder="Từ khóa"
                className="input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
                {...register("keyword")}
              />
            </div>
          </div>

          <div className="section-wrapper w-full ">
            <div className="flex flex-col gap-2">
              <h3 className="section-label">Đường dẫn</h3>
              <div className="section-item">
                <h6 className="section-item-label">Link Lazada</h6>
                <input
                  type="text"
                  placeholder="Link Lazada"
                  className="section-item-input"
                  {...register("linkBuyProductOne", { required: false })}
                />
                {errors.name && errors.name.type === "required" && (
                  <p className="text_error">Link Lazada</p>
                )}
              </div>
              <div className="section-item">
                <h6 className="section-item-label">Link Tiki</h6>
                <input
                  type="text"
                  placeholder="Link Tiki"
                  className="section-item-input"
                  {...register("linkBuyProductTwo", { required: false })}
                />
                {errors.name && errors.name.type === "required" && (
                  <p className="text_error">Link Tiki</p>
                )}
              </div>
              <div className="section-item">
                <h6 className="section-item-label">Shopee</h6>
                <input
                  type="text"
                  placeholder="Link Shopee"
                  className="section-item-input"
                  {...register("linkBuyProductThree", { required: false })}
                />
                {errors.name && errors.name.type === "required" && (
                  <p className="text_error">Link Shopee</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-start gap-6">
        <button className="btn bg-dark-color text-white " onClick={onCheckErr}>
          Thêm mới
        </button>
        <Link
          href={Routers.product.pathProducts}
          className="btn text-dark-color border border-dark-color"
        >
          Hủy bỏ
        </Link>
      </div>
    </form>
  );
}
