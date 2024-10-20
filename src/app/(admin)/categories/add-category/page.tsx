"use client";
import { useMutation } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import ToggleSwitch from "@src/components/switchbtn/switchbtn";
import { MUTATE_ADD_CATE } from "@src/graphql/category/mutation";
import { MUTATION_UPLOAD_SINGLE_IMAGE } from "@src/graphql/image/mutation";
import { appConfig } from "@src/utils/config";
import { uploadFileIcon } from "@src/utils/icon/icon";
import iconGroup from "@src/utils/images/group.png";
import { Routers } from "@src/utils/router";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IImage } from "../../../../interfaces/image";
import {
  IFormCategory,
  IUploadSingleImageResponse,
} from "../_interface/category";
import { ICreateCategoryResponse } from "./_interface/category";

export default function AddCategory() {
  const [newImages, setNewImages] = useState<File[]>();
  const [iconCate, setIconCate] = useState<IImage>();

  const router = useRouter();

  const [mutateCategory] =
    useMutation<ICreateCategoryResponse>(MUTATE_ADD_CATE);
  const [mutateUploadImage] = useMutation<IUploadSingleImageResponse>(
    MUTATION_UPLOAD_SINGLE_IMAGE
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormCategory>({
    defaultValues: {
      isActive: true,
    },
  });

  const onSubmit: SubmitHandler<IFormCategory> = async (
    data: IFormCategory
  ) => {
    try {
      const query = {
        cate: {
          name: data.name,
          isActive: data.isActive,
          icon: iconCate?.url,
        },
        logo: newImages ? newImages[0] : undefined,
      };

      if (!newImages) delete query.logo;
      if (!iconCate) delete query.cate.icon;

      const mutate = mutateCategory({
        variables: query,
      });

      const resp = await toastPromise(mutate);

      if (resp.data?.createCategory.success) {
        router.push(Routers.category.pathCategories);
      } else {
        toastNotify("error", resp.data?.createCategory.message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
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

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="py-9 flex flex-col gap-6"
      >
        <h1 className="text-26 font-500 text-neutral-gray-80 ">
          Thêm danh mục mới
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
                          name="name"
                        />
                      </div>
                      {errors.name && (
                        <p className="text_error">
                          {errors.name.type === "required" &&
                            errors.name.message}
                          {errors.name.type === "minLength" &&
                            errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="row-span-1 col-span-8 px-2 py-1">
                      <div className="flex gap-12 items-center">
                        <p className="text-[14px] font-400 text-neutral-gray-60">
                          Icon
                        </p>
                        <label
                          htmlFor="dropzone-file-icon"
                          className="flex gap-6 items-center cursor-pointer"
                        >
                          <p className="my-2 text-dark-color flex justify-center items-center gap-1">
                            {uploadFileIcon}
                            Tải ảnh lên từ thiết bị
                          </p>
                          <div className="relative w-[58px] h-[58px] bg-main-bg-color rounded-lg">
                            {iconCate && (
                              <Image
                                src={
                                  iconCate?.url
                                    ? appConfig.urlImg + iconCate.url
                                    : iconGroup
                                }
                                alt={iconCate.name || ""}
                                width="100"
                                height="100"
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
                <ToggleSwitch control={control} name="isActive" />
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
        <div className="flex items-center justify-start gap-6">
          <button className="btn bg-dark-color text-white ">Thêm mới</button>
          <Link
            href={Routers.category.pathCategories}
            className="btn text-dark-color border border-dark-color"
          >
            Hủy
          </Link>
        </div>
      </form>
    </>
  );
}
