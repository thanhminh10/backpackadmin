"use client";
import { useMutation, useQuery } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";

import AutoComplete from "@src/components/autocomplete/autocomplete";
import ToggleSwitch from "@src/components/switchbtn/switchbtn";
import {
  MUTATE_DELETE_BANNER,
  MUTATE_EDIT_BANNER,
  QUERY_BANNER,
} from "@src/graphql/banner";
import { MUTATE_ADD_CATE } from "@src/graphql/category/mutation";
import { QUERY_CATEGORIES } from "@src/graphql/category/query";
import { client } from "@src/lib/client";
import { appConfig, configImg } from "@src/utils/config";
import { uploadFileIcon } from "@src/utils/icon/icon";
import iconGroup from "@src/utils/images/group.png";
import { Routers } from "@src/utils/router";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ICategoryResponse } from "../../categories/_interface/category";
import { ICreateCategoryResponse } from "../../categories/add-category/_interface/category";
import { IDeleteBannerResponse, IFormBanner } from "../_interface/banner";
import {
  IBannerRepository,
  IEditBannerRepository,
} from "./_interface/edit-banner";

export default function EditBanner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: dataBanner, loading } = useQuery<IBannerRepository>(
    QUERY_BANNER,
    {
      variables: {
        bannerId: searchParams.get("id"),
      },
    }
  );
  const { data: dataCates, refetch: cateRefetch } = useQuery<ICategoryResponse>(
    QUERY_CATEGORIES,
    {
      variables: {
        pageIndex: 1,
        pageSize: 100,
        active: true,
      },
    }
  );

  const [mutateBanner] = useMutation<IEditBannerRepository>(MUTATE_EDIT_BANNER);
  const [newImages, setNewImages] = useState<File[]>();
  const [mutateCategory] =
    useMutation<ICreateCategoryResponse>(MUTATE_ADD_CATE);
  const [mutateDeleteBanner] =
    useMutation<IDeleteBannerResponse>(MUTATE_DELETE_BANNER);
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IFormBanner>({
    defaultValues: {
      isActive: dataBanner?.banner.isActive,
    },
  });

  const [cateSearchValue, setCateSearchValue] = useState("");

  useEffect(() => {
    if (dataBanner?.banner.category?.name) {
      setCateSearchValue(dataBanner?.banner.category?.name);
      setValue("cateId", dataBanner?.banner.category?._id); // Set luôn giá trị cho cateId
      handleSearchCate(dataBanner?.banner.category?.name);
    }
  }, [dataBanner, setValue]);

  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const _files = Array.from(event.target.files);
      setNewImages(_files);
    }
  };

  const onSubmit: SubmitHandler<IFormBanner> = async (data: IFormBanner) => {
    try {
      const query = {
        banner: {
          title: data.title,
          cateId: data.cateId,
          url: data.url,
          isActive: data.isActive,
        },
        bannerId: searchParams.get("id"),
        file: newImages ? newImages[0] : undefined,
      };

      if (!newImages) delete query.file;

      const mutate = mutateBanner({
        variables: query,
      });

      const resp = await toastPromise(mutate);

      if (resp.data?.editBanner.success) {
        router.push(Routers.banner.pathBanners);
      } else {
        toastNotify("error", resp.data?.editBanner.message);
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

  const deleteBanner = async (bannerId: string) => {
    try {
      const mutate = mutateDeleteBanner({
        variables: {
          bannerId: bannerId,
        },
      });

      const resp = await toastPromise(mutate);

      if (resp.data?.deleteBanner.success) {
        cateRefetch();
      } else {
        toastNotify("error", resp.data?.deleteBanner.message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="py-9 flex flex-col gap-6"
    >
      <h1 className="text-26 font-500 text-neutral-gray-80 ">
        Chỉnh sửa banner
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
                        <Image
                          src={
                            dataBanner?.banner.imageUrl
                              ? configImg(dataBanner.banner.imageUrl, appConfig)
                              : iconGroup
                          }
                          alt={dataBanner?.banner.title ?? ""}
                          layout="fill"
                          className="absolute inset-0 object-cover"
                        />
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
                    defaultValue={dataBanner?.banner.title}
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
                    defaultValue={dataBanner?.banner.url}
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
              <ToggleSwitch
                control={control}
                defaultValue={dataBanner?.banner.isActive}
                name="isActive"
              />
            </div>
          </div>

          <div className="section-wrapper w-full">
            <div className="section-item">
              <h3 className="section-label">Phân loại</h3>
              <p className="text-[14PX] font-400 text-neutral-gray-60">
                Danh mục
              </p>
              <Controller
                control={control}
                name="cateId"
                defaultValue={dataBanner?.banner.category?.name} // Set the default value
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
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <button type="submit" className="btn bg-dark-color text-white ">
            Lưu thay đổi
          </button>
          <Link
            href={Routers.brand.pathBrands}
            className="btn text-dark-color border border-dark-color"
          >
            Hủy
          </Link>
        </div>

        <button
          onClick={() => deleteBanner(dataBanner?.banner?._id ?? "")}
          className="btn text-semantics-error border border-semantics-error"
        >
          Xóa banner
        </button>
      </div>
    </form>
  );
}
