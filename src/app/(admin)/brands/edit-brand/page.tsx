"use client";
import { useMutation, useQuery } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import ToggleSwitch from "@src/components/switchbtn/switchbtn";
import {
  MUTATE_EDIT_BRAND,
  MUTATE_MULTi_DELETE_BRAND,
  QUERY_BRAND,
} from "@src/graphql/brand";
import { appConfig, configImg } from "@src/utils/config";
import { uploadFileIcon } from "@src/utils/icon/icon";
import iconGroup from "@src/utils/images/group.png";
import { Routers } from "@src/utils/router";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IDeleteBrandResponse, IFormBrand } from "../_interface/brand";
import {
  IBrandRepository,
  IEditBrandRepository,
} from "./_interface/edit-brand";

export default function EditBrand() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newImages, setNewImages] = useState<File[]>();
  const { data, loading } = useQuery<IBrandRepository>(QUERY_BRAND, {
    variables: {
      brandId: searchParams.get("id"),
    },
  });
  const [mutateBrand] = useMutation<IEditBrandRepository>(MUTATE_EDIT_BRAND);
  const [mutateMultiDeleteBrand] = useMutation<IDeleteBrandResponse>(
    MUTATE_MULTi_DELETE_BRAND
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormBrand>({
    defaultValues: {
      isActive: data?.brand.isActive,
    },
  });

  useEffect(() => {
    !searchParams.get("id") && router.push(Routers.brand.pathBrands);
  });

  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const _files = Array.from(event.target.files);
      setNewImages(_files);
    }
  };
  const deleteBrandbyId = async (id: string) => {
    let brandlist = [];
    brandlist.push(id);
    try {
      const mutate = mutateMultiDeleteBrand({
        variables: {
          brandIds: brandlist,
        },
      });

      const resp = await toastPromise(mutate);

      if (resp.data?.multipleDeleteBrand?.success) {
        router.push("/brands");
      } else {
        toastNotify("error", resp.data?.multipleDeleteBrand?.message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };
  const onSubmit: SubmitHandler<IFormBrand> = async (data: IFormBrand) => {
    try {
      const mutate = mutateBrand({
        variables: {
          brandId: searchParams.get("id"),
          brand: {
            name: data.name,
            isActive: data.isActive,
           
          },
          file: newImages?.length ? newImages[0] : null,
        },
      });

      const resp = await toastPromise(mutate);
      const { success, message } = resp.data?.editBrand!;
      if (success) {
        router.push(Routers.brand.pathBrands);
      } else {
        toastNotify("error", message);
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
        Chỉnh sửa thương hiệu
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
                        <Image
                          src={
                            data?.brand.logo
                              ? configImg(data.brand.logo, appConfig)
                              : iconGroup
                          }
                          alt={data?.brand.name ?? ""}
                          layout="fill"
                          className="absolute inset-0 object-cover"
                        />
                          {newImages &&
                    newImages.map((image, idx) => (
                      <Image
                        key={idx}
                        src={URL.createObjectURL(image)}
                        alt={data?.brand.name ?? ""}
                        width="100"
                        height="100"
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
                  {errors.logo && (
                    <p className="text_error">Logo is required</p>
                  )}
                 
                </div>
                <div className="row-span-2 col-span-12">
                  <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                    Tên thương hiệu
                  </p>
                  <input
                    placeholder="Tên danh mục sản phẩm"
                    className=" input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
                    type="text"
                    defaultValue={data?.brand.name}
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
                    {...register("des")}
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
              <ToggleSwitch
                control={control}
                name="isActive"
                defaultValue={data?.brand.isActive}
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
          <button className="btn bg-dark-color text-white">Chỉnh sửa</button>
          <Link
            href={Routers.brand.pathBrands}
            className="btn text-dark-color border border-dark-color"
          >
            Hủy
          </Link>
        </div>
        <button
          className="flex gap-1 py-3 px-6  border  border-semantics-error text-semantics-error text-16-400 rounded-[12px]"
          onClick={() => deleteBrandbyId(data?.brand._id ?? "")}
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
          Xóa thương hiệu
        </button>
      </div>
    </form>
  );
}
