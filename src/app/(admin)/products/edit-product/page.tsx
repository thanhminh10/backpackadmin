"use client";
import { useMutation, useQuery } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import Dropdown from "@src/components/dropdown/Dropdown";
import { MUTATE_ADD_BRAND, QUERY_BRANDS } from "@src/graphql/brand";
import { MUTATE_ADD_CATE } from "@src/graphql/category/mutation";
import { QUERY_CATEGORIES } from "@src/graphql/category/query";
import {
  MUTATION_DELETE_PRODUCT_BY_ID,
  MUTATION_EDIT_PRODUCT,
  QUERY_PRODUCT_DETAIL,
} from "@src/graphql/product";
import { configEditor } from "@src/utils/editor-config";
import { Routers } from "@src/utils/router";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IBrandResponse } from "../../brands/_interface/brand";
import { ICreateBrandResponse } from "../../brands/add-brand/_interface/add-brand";
import { ICategoryResponse } from "../../categories/_interface/category";
import { ICreateCategoryResponse } from "../../categories/add-category/_interface/category";
import { IDeleteProductbyId, IFormProduct } from "../_interface/product";
import {
  IDetailProductResponse,
  IEditProductResponse,
} from "./_interface/edit-product";

import AutoComplete from "@src/components/autocomplete/autocomplete";
import { client } from "@src/lib/client";

// Custom loading component
const LoadingComponent = () => <p>Loading editor, please wait...</p>;

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

export default function EditProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<IFormProduct>();

  const editor = useRef(null);
  const description = useRef("");

  const {
    data: dataProduct,
    loading: productLoading,
    refetch,
  } = useQuery<IDetailProductResponse>(QUERY_PRODUCT_DETAIL);

  
  const {
    data: dataCates,
    loading: cateLoading,
    refetch: cateRefetch,
  } = useQuery<ICategoryResponse>(QUERY_CATEGORIES, {
    variables: {
      pageIndex: 1,
      pageSize: 100,
      active: true,
    },
  });
  const {
    data: dataBrands,
    loading: brandLoading,
    refetch: brandRefetch,
  } = useQuery<IBrandResponse>(QUERY_BRANDS, {
    variables: {
      pageIndex: 1,
      pageSize: 100,
      active: true,
    },
  });

  const [selectedValue, setSelectedValue] = useState(
    dataProduct?.product.data?.isActive
  );
  const [cateSearchValue, setCateSearchValue] = useState("");
  const [brandSearchValue, setBrandSearchValue] = useState("");

  const [mutationEditProduct] = useMutation<IEditProductResponse>(
    MUTATION_EDIT_PRODUCT
  );
  const [mutateDeleteById] = useMutation<IDeleteProductbyId>(
    MUTATION_DELETE_PRODUCT_BY_ID
  );
  const [mutateCategory] =
    useMutation<ICreateCategoryResponse>(MUTATE_ADD_CATE);
  const [mutateBrand] = useMutation<ICreateBrandResponse>(MUTATE_ADD_BRAND);

  useEffect(() => {
    !searchParams.get("id") && router.back();
    refetch({ prodId: searchParams.get("id") });
    cateRefetch();
    brandRefetch();
  }, [brandRefetch, cateRefetch, refetch, router, searchParams]);

  const onSubmit: SubmitHandler<IFormProduct> = async (data: IFormProduct) => {
   
    
    if (!description.current) {
      setError("description", {
        message: "Description is required",
        type: "required",
      });
      return;
    }

    data.isActive = selectedValue;
    if (!data.quantity) data.quantity = 0;
    if (!data.quantitySold) data.quantitySold = 0;
    if (!data.keyword) delete data.keyword;

    data.slug = data.slug?.trim().split(" ").join("-");

    try {
      const mutate =  await mutationEditProduct({
        variables: {
          prodId: searchParams.get("id"),
          product: {
            ...data,
            description: description.current,
          },
        },
      });
      
      if (mutate && mutate.data) {
        const { data, success, message } = mutate.data.editProduct;
        console.log(data);
        
        if(success && data) {
          router.push(
            Routers.product.pathUploadImage + `?prodId=${data._id}`
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

  const deleteProductById = async (prodId: string) => {
    try {
      // Perform the mutation with the product ID
      const { data } = await mutateDeleteById({
        variables: { prodId },
      });

      // Check if the response contains success information
      if (data?.deleteProduct?.success) {
        refetch(); // Refresh the product list or perform another action
        toastNotify("success", "Product deleted successfully");
        router.push("/products");
      } else {
        // Handle errors or unsuccessful deletion
        toastNotify(
          "error",
          data?.deleteProduct?.message || "Failed to delete product"
        );
      }
    } catch (error: any) {
      // Handle unexpected errors
      toastNotify("error", error.message);
    }
  };

  const onCheckErr = () => {
    if (description.current) {
      clearErrors("description");
    }
  };

  useEffect(() => {
    if (dataProduct?.product.data?.description) {
      description.current = dataProduct.product.data.description;
    }
    if (dataProduct?.product.data?.isActive !== undefined) {
      setSelectedValue(dataProduct?.product.data?.isActive);
    }
    if (dataProduct?.product.data?.brand?.name) {
      setBrandSearchValue(dataProduct?.product.data?.brand?.name);
      handleSearchBrand(dataProduct?.product.data?.brand?.name);
    }
    if (dataProduct?.product.data?.category?.name) {
      setCateSearchValue(dataProduct?.product.data?.category?.name);
      handleSearchCate(dataProduct?.product.data?.category?.name);
    }
  }, [
    dataProduct,
    dataProduct?.product.data?.brand?.name,
    dataProduct?.product.data?.category?.name,
  ]);

  const formatDataCate = dataCates?.categories?.data?.map((item) => ({
    keyword: item.name,
    value: item._id,
  }));

  const formatDatabrand = dataBrands?.brands?.data?.map((item) => ({
    keyword: item.name,
    value: item._id,
  }));

  // Handle select change as string
  const handleChange = (value: string) => {
    setSelectedValue(value === "true"); // Convert 'true'/'false' string to boolean
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
      brandRefetch(); // Refresh lại data sau khi thêm
      return data.brands.data.map((item: { name: string; _id: string }) => ({
        keyword: item.name,
        value: item._id,
      }));
    } catch (error) {
      console.error("Search failed", error);
      return [];
    }
  };
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
  const options = [
    { value: "true", label: "Đang có sẵn" },
    { value: "false", label: "Hết hàng" },
  ];

  if (productLoading || brandLoading || cateLoading)
    return <div>Loading....</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="py-9 flex flex-col gap-6"
    >
      <h1 className="text-26 font-500  text-neutral-gray-80 ">
        Chỉnh sửa sản phẩm
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
                  defaultValue={dataProduct?.product.data?.name}
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
                  defaultValue={dataProduct?.product.data?.sku}
                  {...register("sku", { required: false })}
                />
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
                    defaultValue={dataProduct?.product.data?.price}
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
                    defaultValue={dataProduct?.product.data?.quantity}
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
                  onChange={(value) => (description.current = value)}
                  value={dataProduct?.product.data?.description ?? ""}
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
                  <Controller
                    control={control}
                    name="hot"
                    defaultValue={dataProduct?.product.data?.hot}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <input
                        id="hotProductCheckbox"
                        className="w-4 h-4 border-gray-300 rounded"
                        type="checkbox"
                        checked={value === true}
                        onChange={(e) => onChange(e.target.checked)}
                      />
                    )}
                  />
                  <span className="text-16-400 text-neutral-gray-60">
                    Sản phẩm nổi bật
                  </span>
                </label>
              </div>
              <div className="section-item">
                <h6 className="section-item-label">Thương hiệu</h6>
                <Controller
                  control={control}
                  name="brandId"
                  render={({ field: { onChange, value } }) => (
                    <AutoComplete
                      data={formatDatabrand ?? []}
                      value={value || brandSearchValue} // Display brandSearchValue
                      onChange={(val: string) => {
                        onChange(val); // Update the form control value
                        setBrandSearchValue(val); // Update the local state
                      }}
                      onSearch={handleSearchBrand}
                      onKeywordAdd={handleKeywordAddBrand}
                      field="Nhập thương hiệu"
                      hiddenInputName="brandId"
                    />
                  )}
                />
              </div>
              {errors.brandId && errors.brandId.type === "required" && (
                <p className="text_error">Chọn thương hiệu</p>
              )}
            </div>
            <div className="section-item">
              <h6 className="section-item-label">Danh mục</h6>
              <Controller
                control={control}
                name="cateId"
                render={({ field: { onChange, value } }) => (
                  <AutoComplete
                    data={formatDataCate ?? []}
                    value={value || cateSearchValue} // Display cateSearchValue
                    onChange={(val: string) => {
                      onChange(val); // Updates form control value
                      setCateSearchValue(val); // Updates the local state
                    }}
                    onSearch={handleSearchCate}
                    onKeywordAdd={handleKeywordAddCate}
                    field="Nhập danh mục"
                    hiddenInputName="cateId"
                  />
                )}
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
                defaultValue={dataProduct?.product.data?.keyword ?? ""}
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
                  defaultValue={dataProduct?.product.data?.linkBuyProductOne}
                  {...register("linkBuyProductOne")}
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
                  defaultValue={dataProduct?.product.data?.linkBuyProductTwo}
                  {...register("linkBuyProductTwo")}
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
                  defaultValue={dataProduct?.product.data?.linkBuyProductThree}
                  {...register("linkBuyProductThree")}
                />
                {errors.name && errors.name.type === "required" && (
                  <p className="text_error">Link Shopee</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-6 justify-start">
          <button
            className="btn bg-dark-color text-white "
            onClick={onCheckErr}
          >
            Chỉnh sửa
          </button>
          <Link
            href={Routers.product.pathProducts}
            className="btn text-dark-color border border-dark-color"
          >
            Hủy bỏ
          </Link>
        </div>

        <button
          type="button"
          className="btn text-semantics-error border border-semantics-error"
          onClick={() =>
            deleteProductById(dataProduct?.product?.data?._id ?? "")
          }
        >
          Xóa sản phẩm
        </button>
      </div>
    </form>
  );
}
