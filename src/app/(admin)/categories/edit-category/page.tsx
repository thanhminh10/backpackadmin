"use client";
import { useMutation, useQuery } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import ToggleSwitch from "@src/components/switchbtn/switchbtn";
import {
  MUTATE_EDIT_CATE,
  MUTATE_MULTI_DELETE_CATE,
} from "@src/graphql/category/mutation";
import { QUERY_CATEGORY } from "@src/graphql/category/query";
import { MUTATION_UPLOAD_SINGLE_IMAGE } from "@src/graphql/image/mutation";
import { appConfig, configImg } from "@src/utils/config";
import { uploadFileIcon } from "@src/utils/icon/icon";
import iconGroup from "@src/utils/images/group.png";
import { Routers } from "@src/utils/router";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IImage } from "../../../../interfaces/image";
import {
  IDeleteCategoryResponse,
  IFormCategory,
  IUploadSingleImageResponse,
} from "../_interface/category";
import {
  ICategoryRepository,
  IEditCategoryRepository,
} from "./_interface/category";

export default function EditCategory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [iconCate, setIconCate] = useState<IImage>();

  const { data, loading, refetch } = useQuery<ICategoryRepository>(
    QUERY_CATEGORY,
    {
      variables: {
        cateId: searchParams.get("id"),
      },
    }
  );
  const [newImages, setNewImages] = useState<File[]>();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormCategory>({
    defaultValues: {
      isActive: data?.category.isActive,
    },
  });

  const [mutateCategory] =
    useMutation<IEditCategoryRepository>(MUTATE_EDIT_CATE);
  const [mutateMultiDeleteCate] = useMutation<IDeleteCategoryResponse>(
    MUTATE_MULTI_DELETE_CATE
  );

  useEffect(() => {
    !searchParams.get("id") && router.push(Routers.category.pathCategories);
  });

  const [mutateUploadImage] = useMutation<IUploadSingleImageResponse>(
    MUTATION_UPLOAD_SINGLE_IMAGE
  );

  const onSubmit: SubmitHandler<IFormCategory> = async (
    data: IFormCategory
  ) => {
    try {
      const query = {
        cateId: searchParams.get("id"),
        category: {
          name: data.name,
          isActive: data.isActive,
          icon: iconCate?.url,
        },
        logo: newImages ? newImages[0] : undefined,
      };

      if (!newImages) delete query.logo;
      if (!iconCate) delete query.category.icon;

      const mutate = mutateCategory({
        variables: query,
      });

      const resp = await toastPromise(mutate);

      if (resp.data?.editCategory.success) {
        router.push(Routers.category.pathCategories);
      } else {
        toastNotify("error", resp.data?.editCategory.message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  const deleteCategorybyId = async (id: string) => {
    let listcate = [];
    listcate.push(id);
    try {
      const mutate = mutateMultiDeleteCate({
        variables: {
          cateIds: listcate,
        },
      });

      const resp = await toastPromise(mutate);

      if (resp.data?.multipleDeleteCategories.success) {
        router.push("/categories");
      } else {
      }
    } catch (error: any) {}
  };

  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const _files = Array.from(event.target.files);
      setNewImages(_files);
    }
  };

  const uploadIcon = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = Array.from(event.target.files)[0];

      const query = {
        imageFile: file,
        imageId: iconCate?._id,
      };

      if (!iconCate) delete query.imageId;

      mutateUploadImage({
        variables: {
          imageFile: file,
        },
      }).then((resp) => {
        if (resp.data?.uploadSingleImage.data) {
          setIconCate(resp.data?.uploadSingleImage.data[0]);
        }
      });
    }

    event.target.files = null;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="py-9 flex flex-col gap-6"
      >
        <h1 className="text-26 font-500 text-neutral-gray-80 ">
          Chỉnh sửa danh mục
        </h1>

        <div className="grid grid-cols-12  gap-9">
          <div className="flex flex-col gap-6 col-span-8">
            <div className="section-wrapper w-full">
              <div className="flex flex-col gap-2">
                <h3 className="section-label">Thông tin danh mục</h3>
                <div className="section-item">
                  <div className="grid grid-rows-2 grid-cols-12 gap-4">
                    <div className="row-span-2 col-span-4">
                      <h6 className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                        Hình ảnh
                      </h6>
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center border-2 border-dark-color border-dashed rounded-lg cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center w-full p-4">
                          <div className="relative rounded-full overflow-hidden w-16 h-16 bg-white">
                            <Image
                              src={
                                data?.category.logo
                                  ? configImg(data.category.logo, appConfig)
                                  : iconGroup
                              }
                              alt={data?.category.name ?? ""}
                              layout="fill"
                              className="absolute inset-0 object-cover"
                            />

                            {newImages &&
                              newImages.map((image, idx) => (
                                <Image
                                  key={idx}
                                  src={URL.createObjectURL(image)}
                                  alt={data?.category.name ?? ""}
                                  layout="fill"
                                  className="absolute inset-0 object-cover"
                                />
                              ))}
                          </div>
                          <p className="my-2 text-dark-color flex justify-center items-center gap-1">
                            {uploadFileIcon}
                            Tải ảnh lên từ thiết bị
                          </p>
                          <p className="text-xs text-gray-500">
                            (Dung lượng ảnh tối đa 2MB)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          className="hidden"
                          accept="image/png, image/jpeg"
                          type="file"
                          {...register("file")}
                          onChange={uploadImage}
                        />
                      </label>
                    </div>
                    <div className="row-span-1 col-span-8 px-2 py-1">
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Tên danh mục sản phẩm
                        </p>
                        <input
                          placeholder="Tên danh mục sản phẩm"
                          className=" input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
                          type="text"
                          defaultValue={data?.category.name}
                          {...register("name", {
                            required: {
                              value: true,
                              message: "Vui lòng nhập tên danh mục",
                            },
                            minLength: {
                              value: 4,
                              message: "Tên danh mục phải nhiều hơn 4 ký tự",
                            },
                          })}
                        />
                        {errors.name && (
                          <p className="text_error">
                            {errors.name.type === "required" &&
                              errors.name.message}
                            {errors.name.type === "minLength" &&
                              errors.name.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="row-span-1 col-span-8 px-2 py-1">
                      <div className="flex gap-12 items-center">
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Icon
                        </p>
                        <label
                          htmlFor="dropzone-file-icon"
                          className="flex gap-6 items-center cursor-pointer"
                        >
                          <span className="text-16-400">
                            Tải ảnh lên từ thiết bị
                          </span>
                          <div className="relative w-[58px] h-[58px] bg-main-bg-color rounded-lg border overflow-hidden">
                            <Image
                              src={
                                data?.category.icon
                                  ? configImg(data.category.icon, appConfig)
                                  : iconGroup
                              }
                              alt={data?.category.name ?? ""}
                              layout="fill"
                              className="absolute inset-0 object-cover"
                            />
                            {iconCate && (
                              <Image
                                src={
                                  iconCate?.url
                                    ? configImg(iconCate?.url, appConfig)
                                    : iconGroup
                                }
                                alt={iconCate.name || ""}
                                layout="fill"
                                className="absolute inset-0 object-cover"
                              />
                            )}
                          </div>
                        </label>

                        <input
                          id="dropzone-file-icon"
                          className="hidden"
                          accept="image/png, image/jpeg, image/webp"
                          type="file"
                          {...register("file")}
                          onChange={(event) => uploadIcon(event)}
                        />
                      </div>
                    </div>

                    <div className="row-span-2 col-span-12">
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Mô tả
                        </p>

                        <textarea
                          className="w-full border border-neutral-gray-40 rounded-lg p-4 input_animation_focus_2 "
                          rows={4}
                          placeholder="Nhập mô tả"
                          {...register("des")}
                          name="des"
                          id="des"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-4 flex flex-col col-start-9 gap-6">
            <div className="section-wrapper w-full py-6 px-9">
              <div className="section-item">
                <h3 className="section-label">Trạng thái</h3>
                <ToggleSwitch
                  control={control}
                  name="isActive"
                  defaultValue={data?.category.isActive}
                />
              </div>
            </div>
            <div className="section-wrapper w-full py-6 px-9">
              <div className="section-item">
                <h3 className="section-label">Ghi chú</h3>
                <textarea
                  className="w-full border border-neutral-gray-40 rounded-lg p-4 input_animation_focus_2 "
                  placeholder="Nhập ghi chú"
                  rows={3}
                  {...register("note")}
                  name="note"
                  id="note"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-6 justify-start">
            <button className="btn bg-dark-color text-white ">Chỉnh sửa</button>
            <Link
              href={Routers.category.pathCategories}
              className="btn text-dark-color border border-dark-color"
            >
              Hủy
            </Link>
          </div>

          <button
            className="flex gap-1 py-3 px-6  border  border-semantics-error text-semantics-error text-16-400 rounded-[12px]"
            onClick={() => deleteCategorybyId(data?.category._id ?? "")}
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
            Xóa danh mục
          </button>
        </div>
      </form>
    </>
  );
}
