"use client";
import { useMutation } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import ToggleSwitch from "@src/components/switchbtn/switchbtn";
import { MUTATE_ADD_BRAND } from "@src/graphql/brand";
import { uploadFileIcon } from "@src/utils/icon/icon";
import { Routers } from "@src/utils/router";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IFormBrand } from "../_interface/brand";
import { ICreateBrandResponse } from "./_interface/add-brand";

export default function AddBrand() {
  const router = useRouter();
  const [newImages, setNewImages] = useState<File[]>([]);
  const [mutateBrand] = useMutation<ICreateBrandResponse>(MUTATE_ADD_BRAND);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormBrand>({
    defaultValues: {
      isActive: true,
    },
  });

  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const _files = Array.from(event.target.files);
      setNewImages(_files);
    }
  };

  const onSubmit: SubmitHandler<IFormBrand> = async (data: IFormBrand) => {
    try {
      const mutate = mutateBrand({
        variables: {
          brand: {
            name: data.name,
            isActive: data.isActive,
            note: data.note,
            des: data.des,
          },
          file: newImages?.length ? newImages[0] : null,
        },
      });

      const resp = await toastPromise(mutate);

      const { success, message } = resp.data?.createBrand!;
      if (success) {
        router.push(Routers.brand.pathBrands);
      } else {
        toastNotify("error", message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="py-9 flex flex-col gap-6"
    >
      <h1 className="text-26 font-500 text-neutral-gray-80 ">
        Thêm thương hiệu mới
      </h1>

      <div className="grid grid-cols-12 gap-9">
        <div className="flex flex-col gap-6 col-span-8">
          <div className="section-wrapper w-full">
            <h3 className="section-label">Thông tin thương hiệu</h3>
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
                      <div className="relative rounded-full overflow-hidden w-16 h-16 bg-main-bg-color">
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
                      {...register("logo", {
                        required: false,
                      })}
                      onChange={uploadImage}
                    />
                  </label>
                </div>
                <div className="row-span-2 col-span-12">
                  <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                    Tên thương hiệu
                  </p>
                  <input
                    type="text"
                    placeholder="Nhập tên thương hiệu"
                    className="input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
                    {...register("name", {
                      required: {
                        value: true,
                        message: "Vui lòng nhập tên thương hiệu",
                      },
                      minLength: {
                        value: 4,
                        message: "Tên thương hiệu phải nhiều hơn 4 ký tự",
                      },
                    })}
                  />
                  {errors.name && (
                    <p className="text_error">
                      {errors.name.type === "required" && errors.name.message}
                      {errors.name.type === "minLength" && errors.name.message}
                    </p>
                  )}
                </div>

                <div className="row-span-2 col-span-12">
                  <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                    Mô tả
                  </p>
                  <textarea
                    className="w-full border border-neutral-gray-40 rounded-lg p-4 input_animation_focus_2 "
                    rows={4}
                    placeholder="Nhập mô tả"
                    name="des"
                    id="des"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 col-span-4">
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
