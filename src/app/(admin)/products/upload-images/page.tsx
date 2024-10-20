"use client";
import { useMutation, useQuery } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import { QUERY_IMAGES } from "@src/graphql/product";
import {
  MUTATION_DELETE_IMAGE,
  MUTATION_UPLOAD_IMAGE,
} from "@src/graphql/product/mutation";
import { appConfig } from "@src/utils/config";
import { uploadFileIcon } from "@src/utils/icon/icon";
import { Routers } from "@src/utils/router";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect } from "react";
import {
  IDeleteImagesResponse,
  IImagesResponse,
  IUploadImageResponse,
} from "./_interface/upload-image";

export default function UploadImage() {
  const router = useRouter();
  // const [newImages, setNewImages] = useState<File[]>();
  const searchParams = useSearchParams();

  useEffect(() => {
    !searchParams.get("prodId") && router.back();
  }, [router, searchParams]);

  const [mutationUpload] = useMutation<IUploadImageResponse>(
    MUTATION_UPLOAD_IMAGE
  );

  const [mutationDelete] = useMutation<IDeleteImagesResponse>(
    MUTATION_DELETE_IMAGE
  );

  const { data, refetch } = useQuery<IImagesResponse>(QUERY_IMAGES, {
    variables: {
      prodId: searchParams.get("prodId"),
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  // const onSubmit = async () => {
  //   const prodId = searchParams.get("prodId");
  //   if (newImages) {
  //     try {
  //       const mutate = mutationUpload({
  //         variables: { prodId: prodId, files: newImages },
  //       });

  //       const resp = await toastPromise(mutate);
  //       if (resp.data && resp.data?.uploadImage) {
  //         const { data, success, message } = resp.data?.uploadImage;
  //         !success && toastNotify("error", message);
  //       }
  //     } catch (error) {
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const _files = Array.from(event.target.files);
    const prodId = searchParams.get("prodId");
    const mutate = mutationUpload({
      variables: { prodId: prodId, files: _files },
    });

    const resp = await toastPromise(mutate);
    if (resp.data && resp.data?.uploadImage) {
      const { data, success, message } = resp.data?.uploadImage;

      !success ? toastNotify("error", message) : refetch();
    }
  };

  const saveImage = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(Routers.product.pathProducts);
  };

  const saveAndAddMore = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(Routers.product.pathAddProduct);
  };

  const deleteImage = async (imageId: string) => {
    try {
      const mutate = mutationDelete({
        variables: {
          imageId,
        },
      });

      const resp = await toastPromise(mutate);
      if (data) {
        refetch();
      } else {
        toastNotify("error", resp.data?.deleteImage.message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  return (
    <div className="py-9">
      <form className="grid grid-cols-12 gap-4 ">
        <div className="flex flex-col gap-6 col-span-12 ">
          <h1 className="text-26 font-500  text-neutral-gray-80 ">
            Chỉnh sửa ảnh sản phẩm
          </h1>
          <div className="section-wrapper w-full gap-2">
            <h3 className="section-label">Ảnh sản phẩm </h3>
            <div className="section-item">
              <h6 className="section-item-label">Hình ảnh</h6>
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center border border-dashed border-neutral-gray-40 rounded-lg cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center w-full py-2 px-4">
                  <div className="flex max-h-[40px] gap-1 items-center py-3 px-6">
                    <p className="my-2 text-dark-color flex justify-center items-center gap-1">
                      {uploadFileIcon}
                      Tải ảnh lên từ thiết bị
                    </p>
                  </div>
                  <p className="hidden text-xs text-gray-500 ">
                    (Dung lượng ảnh tối đa 2MB)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept="image/*"
                  multiple
                  name="images"
                  className="hidden"
                  onChange={(e) => uploadImage(e)}
                />
              </label>
            </div>
            <div className="grid grid-cols-8 gap-3 flex-col lg:flex-row">
              {data?.images &&
                data.images.map((image, index) => {
                  return (
                    <div
                      key={index}
                      className="relative flex gap-1 border border-neutral-gray-20 overflow-hidden"
                    >
                      <svg
                        onClick={() => deleteImage(image._id)}
                        className="absolute top-0 left-0 cursor-pointer hover:bg-neutral-gray-40"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.9503 16.9498L7.05078 7.05029"
                          stroke="#B60202"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.9503 7.05021L7.05078 16.9497"
                          stroke="#B60202"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <Image
                        src={
                          image.url.split("://")[0] === "https"
                            ? image.url
                            : appConfig.urlImg + image.url
                        }
                        alt={image.name}
                        width={200}
                        height={200}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="flex gap-2 justify-start">
            <button
              type="button"
              className="btn bg-dark-color text-white"
              onClick={saveImage}
            >
              Lưu thay đổi
            </button>
            <Link
              href={Routers.product.pathProducts}
              className="btn text-dark-color border border-dark-color"
            >
              Hủy bỏ
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
