"use client";
import { useMutation } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import { MUTATION_ADD_ARTICLE } from "@src/graphql/article";
import { configEditor } from "@src/utils/editor-config";
import { uploadFileIcon } from "@src/utils/icon/icon";
import { Routers } from "@src/utils/router";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IFormArticle } from "../_interface/article";
import { ICreateArticleResponse } from "./_interface/add-article";
// Custom loading component
const LoadingComponent = () => <p>Loading editor, please wait...</p>;

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

export default function AddArticle() {
  const [newImages, setNewImages] = useState<File[]>();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm<IFormArticle>();
  const content = useRef("");
  const editor = useRef(null);
  const [mutateArticle] =
    useMutation<ICreateArticleResponse>(MUTATION_ADD_ARTICLE);
  const router = useRouter();

  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const _files = Array.from(event.target.files);
      setNewImages(_files);
      clearErrors("file");
    }
  };

  const onSubmit: SubmitHandler<IFormArticle> = async (data: IFormArticle) => {
    if (!content.current) {
      setError("content", {
        message: "Content is required",
        type: "required",
      });
      return;
    }
    try {
      const mutate = mutateArticle({
        variables: {
          file: newImages![0],
          article: {
            title: data.title,
            content: content.current,
            hot: data.hot,
            keyword: data.keyword,
          },
        },
      });

      const resp = await toastPromise(mutate);

      if (resp.data?.createArticle.success) {
        router.push(Routers.article.pathArticle);
      } else {
        toastNotify("error", resp.data?.createArticle.message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  const onCheckErr = () => {
    if (content.current) {
      clearErrors("content");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="py-9 flex flex-col gap-6"
    >
      <h1 className="text-26 font-500 text-neutral-gray-80 ">
        Thêm bài viết mới
      </h1>
      <div className="grid grid-cols-12 gap-9">
        <div className="flex flex-col gap-6 col-span-8">
          <div className="section-wrapper w-full">
            <h3 className="section-label">Thông tin bài viết</h3>
            <div className="section-item">
              <div className="grid grid-rows-2 grid-cols-12 gap-4">
                <div className="row-span-2 col-span-11">
                  <h6 className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                    Hình ảnh
                  </h6>
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center border-2 border-dark-color border-dashed rounded-lg cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center w-full p-4">
                      <div className="relative rounded-lg overflow-hidden w-16 h-16 bg-main-bg-color">
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
                      {...register("file", {
                        required: false,
                      })}
                      onChange={uploadImage}
                    />
                  </label>
                  {errors.file && errors.file.type && (
                    <p className="text_error">{errors.file.message}</p>
                  )}
                </div>
                <div className="row-span-2 col-span-12">
                  <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                    Tiêu đề
                  </p>
                  <input
                    type="text"
                    placeholder="Nhập tiêu đề"
                    {...register("title", {
                      required: true,
                    })}
                    className="input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
                  />
                  {errors.title && errors.title.type && (
                    <p className="text_error">{errors.title.message}</p>
                  )}
                </div>

                <div className="row-span-2 col-span-12">
                  <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                    Nội dung
                  </p>
                  <JoditEditor
                    value={content.current}
                    onChange={(value) => {
                      content.current = value;
                    }}
                    config={configEditor}
                    ref={editor}
                  />
                  {errors.content && errors.content.type && (
                    <p className="text_error">{errors.content.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 col-span-4">
          <div className="section-wrapper w-full py-6 px-9">
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
                    Bài viết nổi bật
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="section-wrapper w-full py-6 px-9">
            <div className="flex flex-col gap-2">
              <h3 className="section-label">Từ khóa</h3>
              <div className="section-item">
                <input
                  type="text"
                  placeholder="Keyword"
                  className="input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
                  {...register("keyword", {
                    required: true,
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-start gap-6">
        <button type="submit" className="btn bg-dark-color text-white ">
          Thêm mới
        </button>
        <Link
          href={Routers.article.pathArticle}
          className="btn text-dark-color border border-dark-color"
        >
          Hủy
        </Link>
      </div>
    </form>
  );
}
