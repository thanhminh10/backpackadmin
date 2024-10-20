"use client";
import { useMutation, useQuery } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import {
  MUTATION_EDIT_ARTICLE,
  MUTATION_MULTI_DELETE_ARTICLE,
  QUERY_ARTICLE,
} from "@src/graphql/article";
import { appConfig, configImg } from "@src/utils/config";
import { configEditor } from "@src/utils/editor-config";
import { uploadFileIcon } from "@src/utils/icon/icon";
import iconGroup from "@src/utils/images/group.png";
import { Routers } from "@src/utils/router";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IDeleteArticleResponse, IFormArticle } from "../_interface/article";
import {
  IArticleRepository,
  IEditArticleRepository,
} from "./_interface/edit-article";

// Custom loading component
const LoadingComponent = () => <p>Loading editor, please wait...</p>;

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

export default function AddBanner() {
  const editor = useRef(null);
  const content = useRef("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, loading } = useQuery<IArticleRepository>(QUERY_ARTICLE, {
    variables: {
      articleId: searchParams.get("id"),
    },
  });
  const [mutateDeleteArticle] = useMutation<IDeleteArticleResponse>(
    MUTATION_MULTI_DELETE_ARTICLE
  );

  const [mutateArticle] = useMutation<IEditArticleRepository>(
    MUTATION_EDIT_ARTICLE
  );
  const [newImages, setNewImages] = useState<File[]>();
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<IFormArticle>();

  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const _files = Array.from(event.target.files);
      setNewImages(_files);
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
          article: {
            content: content.current,
            hot: data.hot,
            title: data.title,
            keyword: data.keyword,
          },
          file: newImages?.length ? newImages[0] : null,
          articleId: searchParams.get("id"),
        },
      });

      const resp = await toastPromise(mutate);
      if (resp.data?.editArticle.success) {
        router.push(Routers.article.pathArticle);
      } else {
        toastNotify("error", resp.data?.editArticle.message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  useEffect(() => {
    if (data?.article.data?.content) {
      content.current = data.article.data.content;
    }
  }, [data]);

  const onCheckErr = () => {
    if (content.current) {
      clearErrors("content");
    }
  };

  const deleteArticles = async (id: string) => {
    let articleList = [];
    articleList.push(id);
    try {
      const mutate = mutateDeleteArticle({
        variables: {
          brandIds: articleList,
        },
      });

      const resp = await toastPromise(mutate);

      if (resp.data?.multiDeleteArticle?.success) {
        router.push("/brands");
      } else {
        toastNotify("error", resp.data?.multiDeleteArticle?.message);
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
        Chỉnh sửa bài viết
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
                        <Image
                          src={
                            data?.article.data?.thumbnail
                              ? data.article.data.thumbnail.split("://")[0] ===
                                "https"
                                ? data.article.data.thumbnail
                                : configImg(
                                    data.article.data.thumbnail,
                                    appConfig
                                  )
                              : iconGroup
                          }
                          alt={data?.article.data?.title ?? ""}
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
                    defaultValue={data?.article.data?.title}
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
                    value={data?.article?.data?.content ?? ""}
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
                    defaultChecked={data?.article.data?.hot}
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
                  defaultValue={data?.article.data?.keyword}
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
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-6 justify-start">
          <button className="btn bg-dark-color text-white">Lưu thay đổi</button>
          <Link
            href={Routers.brand.pathBrands}
            className="btn text-dark-color border border-dark-color"
          >
            Hủy
          </Link>
        </div>
        <button
          className="flex gap-1 py-3 px-6  border  border-semantics-error text-semantics-error text-16-400 rounded-[12px]"
          onClick={() => deleteArticles(data?.article.data?._id ?? "")}
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
          Xóa bài viết
        </button>
      </div>
    </form>
  );
}
