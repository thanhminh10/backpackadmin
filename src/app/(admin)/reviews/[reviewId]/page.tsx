"use client";
import { useMutation, useQuery } from "@apollo/client";
import { MUTATION_TOGGLE_REVIEW, QUERY_REVIEW } from "@src/graphql/review";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { IDataReview, IToggleReview } from "../_interface/review";
import toastPromise from "@src/action/toast-promise";
import toastNotify from "@src/action/toast-notify";

export default function ReviewsDetail() {
  const router = useRouter();
  const reviewId = useParams();
  const { data, loading ,refetch } = useQuery<IDataReview>(QUERY_REVIEW, {
    variables: {
      reviewId: reviewId.reviewId,
    },
  });

  const [mutateToggleReview] = useMutation<IToggleReview>(
    MUTATION_TOGGLE_REVIEW
  );
  console.log(data);
  

  const toggleReview = async (reviewId: string) => {
    try {
      const mutate = mutateToggleReview
      ({
        variables: {
          reviewId,
        },
      });

      const resp = await toastPromise(mutate);

      if (resp.data?.toggleReview.success) {
        refetch();
      } else {
        toastNotify("error", resp.data?.toggleReview.message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="py-9 flex flex-col gap-6">
      <h1 className="text-26 font-500 text-neutral-gray-80 ">
        Chi tiết đánh giá & bình luận
      </h1>
      <div className="grid grid-cols-12  gap-9">
        <div className="flex flex-col gap-6 col-span-8">
          <div className="section-wrapper w-full">
            <div className="flex flex-col gap-2">
              <h3 className="section-label">Thông tin danh mục</h3>
              <div className="section-item">
                <h6 className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                  Hình ảnh
                </h6>
                <div className="flex flex-row gap-9">
                  {data?.review.images
                    ? data?.review.images.map((item, index) => (
                        <Image
                          key={index}
                          src={item.url ? item.url : "/User.svg"}
                          alt={data.review.user.userName}
                          width={120}
                          height={120}
                        />
                      ))
                    : ""}
                </div>
              </div>
              <div className="block">
                <div>Tên sản phẩm:</div>
                <span>{data?.review.prodId}</span>
              </div>

              <div className="block">
                <div>Nội dung:</div>
                <span>{data?.review.comment}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 col-span-4 ">
          <div className="section-wrapper w-full py-6 px-9">
            <div className="section-item">
              <h3 className="section-label">Trạng thái</h3>
              <label className="inline-flex items-center justify-between cursor-pointer border border-neutral-gray-40 rounded-lg px-4 py-2 ">
                <span
                  className={`text-16-400  ${
                    data?.review.active
                      ? "text-dark-color"
                      : "text-neutral-gray-60"
                  }`}
                >
                  {data?.review.active ? "Đang hoạt động" : "Không hoạt động"}
                </span>
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={data?.review.active}
                  onChange={() => toggleReview(String(reviewId.reviewId) ?? "")}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-1 rounded-full peer dark:bg-neutral-gray-40 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-dark-color"></div>
              </label>
            </div>
          </div>

          <div className="section-wrapper w-full py-6 px-9">
            <div className="section-item">
              <h3 className="section-label">Đánh giá</h3>
              <div className="flex justify-between items-center">
                <span className="text-16-400">{data?.review.rating ?? 0}</span>
                <span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.9718 2.70846C11.4382 1.93348 12.5618 1.93348 13.0282 2.70847L15.3586 6.58087C15.5262 6.85928 15.7995 7.05784 16.116 7.13116L20.5191 8.15091C21.4002 8.35499 21.7474 9.42356 21.1545 10.1066L18.1918 13.5196C17.9788 13.765 17.8744 14.0863 17.9025 14.41L18.2932 18.9127C18.3714 19.8138 17.4625 20.4742 16.6296 20.1214L12.4681 18.3583C12.1689 18.2316 11.8311 18.2316 11.5319 18.3583L7.37038 20.1214C6.53754 20.4742 5.62856 19.8138 5.70677 18.9127L6.09754 14.41C6.12563 14.0863 6.02124 13.765 5.80823 13.5196L2.8455 10.1066C2.25257 9.42356 2.59977 8.35499 3.48095 8.15091L7.88397 7.13116C8.20053 7.05784 8.47383 6.85928 8.64138 6.58087L10.9718 2.70846Z"
                      stroke="#525655"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav
        className="flex items-center flex-column flex-wrap md:flex-row justify-between"
        aria-label="Table navigation"
      >
        <button
          onClick={handleGoBack}
          className="flex gap-1 h-[48px] p-[12px_24px] rounded-[12px] border border-dark-color text-dark-color"
        >
          Quay lại
        </button>
      </nav>
    </div>
  );
}
