"use client";
import { useMutation, useQuery } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";

import AutoComplete from "@src/components/autocomplete/autocomplete";
import ToggleSwitch from "@src/components/switchbtn/switchbtn";
import { MUTATE_ADD_BANNER } from "@src/graphql/banner";
import { MUTATE_ADD_CATE } from "@src/graphql/category/mutation";
import { QUERY_CATEGORIES } from "@src/graphql/category/query";
import { client } from "@src/lib/client";
import { uploadFileIcon } from "@src/utils/icon/icon";
import { Routers } from "@src/utils/router";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ICategoryResponse } from "../../categories/_interface/category";
import { ICreateCategoryResponse } from "../../categories/add-category/_interface/category";
import { IFormBanner } from "../_interface/banner";
import { ICreateBannerResponse } from "./_interface/add-banner";

export default function AddBanner() {
  const router = useRouter();
  const [mutateBanner] = useMutation<ICreateBannerResponse>(MUTATE_ADD_BANNER);
  const [mutateCategory] =
    useMutation<ICreateCategoryResponse>(MUTATE_ADD_CATE);
  const [newImages, setNewImages] = useState<File[]>();
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    clearErrors,
  } = useForm<IFormBanner>({
    defaultValues: {
      isActive: true,
    },
  });
  const [cateSearchValue, setCateSearchValue] = useState("");

  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const _files = Array.from(event.target.files);
      setNewImages(_files);
      clearErrors("file");
    }
  };

  const onSubmit: SubmitHandler<IFormBanner> = async (data: IFormBanner) => {
    try {
      const mutate = mutateBanner({
        variables: {
          file: newImages![0],
          banner: {
            url: data.url,
            title: data.title,
            isActive: data.isActive,
            cateId: data.cateId,
          },
        },
      });

      const resp = await toastPromise(mutate);

      if (resp.data?.createBanner.success) {
        router.push(Routers.banner.pathBanners);
      } else {
        toastNotify("error", resp.data?.createBanner.message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
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

  const formatDataCate = dataCates?.categories?.data?.map((item) => ({
    keyword: item.name,
    value: item._id,
  }));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="py-9 flex flex-col gap-6"
    >
      <h1 className="text-26 font-500 text-neutral-gray-80 ">
        Thêm banner mới
      </h1>
      <div className="grid grid-cols-12 gap-4">
        <div className="flex flex-col gap-6 col-span-8">
          <div className="section-wrapper w-full">
            <h3 className="section-label">Thông tin banner</h3>
            <div className="section-item">
              <div className="grid grid-rows-2 grid-cols-12 gap-4">
                <div className="row-span-2 col-span-12 ">
                  <h6 className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                    Hình ảnh
                  </h6>
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center border-2 border-dark-color border-dashed rounded-lg cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center w-full p-4">
                      <div className="relative rounded-lg overflow-hidden w-full h-[70px] bg-main-bg-color">
                        {newImages &&
                          newImages.map((image, idx) => (
                            <Image
                              key={idx}
                              src={URL.createObjectURL(image)}
                              alt={"Hình ảnh danh mục"}
                              layout="fill"
                              className="absolute inset-0 object-cover"
                            />
                          ))}
                      </div>
                      <p className="my-2 text-dark-color flex justify-center items-center gap-1">
                        {uploadFileIcon}
                        Tải ảnh lên từ thiết bị
                      </p>
                      {/* <p className="text-xs text-gray-500">
                          (Dung lượng ảnh tối đa 2MB)
                        </p> */}
                    </div>
                    <input
                      id="dropzone-file"
                      className="hidden"
                      accept="image/png, image/jpeg, image/webp"
                      type="file"
                      onChange={uploadImage}
                    />
                  </label>
                </div>
                <div className="row-span-2 col-span-12">
                  <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                    Tiêu đề
                  </p>
                  <input
                    type="text"
                    {...register("title", {
                      required: true,
                    })}
                    placeholder="Nhập tên tiêu đề"
                    className="input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
                  />
                  {errors.title && errors.title.type && (
                    <p className="text_error">Title is required</p>
                  )}
                </div>

                <div className="row-span-2 col-span-12">
                  <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                    URL
                  </p>
                  <input
                    type="text"
                    {...register("url", {
                      required: true,
                    })}
                    placeholder="Nhập URL"
                    className="input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
                  />
                  {errors.url && errors.url.type && (
                    <p className="text_error">URL is required</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 col-span-4">
          <div className="section-wrapper w-full">
            <div className="section-item">
              <h3 className="section-label">Trạng thái</h3>
              <ToggleSwitch control={control} name="isActive" />
            </div>
          </div>

          <div className="section-wrapper w-full">
            <div className="section-item">
              <h3 className="section-label">Phân loại</h3>
              <p className="text-[14PX] font-400 text-neutral-gray-60">
                Danh mục
              </p>
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
              {errors.cateId && errors.cateId.type === "required" && (
                <p className="text_error">Category is required</p>
              )}
            </div>
          </div>

          <div className="section-wrapper w-full">
            <div className="section-item">
              <h3 className="section-label">Ghi chú</h3>
              <textarea
                className="w-full border border-neutral-gray-40 rounded-lg p-4 input_animation_focus_2 "
                placeholder="Nhập ghi chú"
                rows={3}
                id="note"
                {...register("note")}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-start gap-6">
        <button type="submit" className="btn bg-dark-color text-white ">
          Thêm mới
        </button>
        <Link
          href={Routers.brand.pathBrands}
          className="btn text-dark-color border border-dark-color"
        >
          Hủy
        </Link>
      </div>
    </form>
  );
}
