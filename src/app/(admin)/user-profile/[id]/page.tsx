"use client";
import { useMutation, useQuery } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import Modal from "@src/components/modal/modal";
import Table from "@src/components/table/table";
import Timeline from "@src/components/timeline/timeline";
import {
  MUTATION_EDIT_PROFILE_USER,
  QUERY_USER_DETAIL,
} from "@src/graphql/userprofile";
import { IHeader } from "@src/interfaces/table";
import { appConfig, configImg } from "@src/utils/config";
import { mapAccountType } from "@src/utils/enum/accountLevelTypes";
import { convertDateFormat } from "@src/utils/format/format";
import { uploadFileIcon } from "@src/utils/icon/icon";
import { Routers } from "@src/utils/router";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IFormUser, IUserDetailResponse } from "../../users/_interface/user";
import { IEditProfileResponse } from "../_interface/user";
import PasswordChangeForm from "../components/ChangePassword";
import StoreDetail from "../components/StoreDetail";

interface Props {
  params: { id: string };
}
const UserProfilePage = ({ params }: Props) => {
  const [mutationEditProfile] = useMutation<IEditProfileResponse>(
    MUTATION_EDIT_PROFILE_USER
  );

  const { data, loading, refetch } = useQuery<IUserDetailResponse>(
    QUERY_USER_DETAIL,
    {
      variables: {
        userId: params.id,
      },
    }
  );
  const [newImages, setNewImages] = useState<File[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalStoreDetailOpen, setIsModalStoreDetailOpen] = useState(false);
  const [isModalStoryTransaction, setIsModalStoryTransaction] = useState(false);
  const openModalChangePassword = () => setIsModalOpen(true);
  const openModalStoreDetail = () => setIsModalStoreDetailOpen(true);
  const openModalStoryTransaction = () => setIsModalStoryTransaction(true);
  const closeModal = () => setIsModalOpen(false);
  const closeModalStoreDetail = () => setIsModalStoreDetailOpen(false);
  const closeModalStoryTransaction = () => setIsModalStoryTransaction(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormUser>({});

  const onSubmit: SubmitHandler<IFormUser> = async (data: IFormUser) => {
    try {
      const mutate = mutationEditProfile({
        variables: {
          userId: params.id,
          profile: {
            userName: data.userName ?? "",
            email: data.email,
            userLevel: Number(data.userLevel),
            phone: data.phone,
            birthDay: convertDateFormat(data.birthDay ?? ""),
            gender: data.gender,
          },
          avatar: newImages?.length ? newImages[0] : null,
        },
      });
      const resp = await toastPromise(mutate);

      if (resp && resp.data) {
        const { data, success, message } = resp.data.editUser;
        if (data || success) {
          refetch();
        } else {
          toastNotify("error", message);
        }
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
  const timelineItems = [
    {
      date: "10/7/2024",
      time: "15:41",
      description: "Phong vừa cập nhật thông tin cho nhân viên A",
    },
    {
      date: "10/7/2024",
      time: "15:40",
      description: "Phong vừa cập nhật thông tin cho nhân viên A",
    },
    {
      date: "10/7/2024",
      time: "15:39",
      description: "Phong vừa cập nhật thông tin cho nhân viên A",
    },
  ];

  const header: IHeader[] = [
    {
      label: "Tên shop",
      key: "shopname",
    },
    {
      label: "Gói dịnh vụ",
      key: "package",
    },
    {
      label: "Ngày thanh toán",
      key: "datePayment",
    },
    {
      label: "Tổng thanh toán",
      key: "total",
    },
    {
      label: "Trạng thái",
      key: "active",
      center: true,
    },
  ];
  const bodies = [
    {
      shopname: "Shop đồ gia dụng",
      package: "Website",
      datePayment: "10/08/2024",
      total: "3.267.557 đ",
      active: <div className={`status_true`}>Đang hoạt động</div>,
    },
  ];

  const userLevel = mapAccountType.find((item) => {
    if (item.value === data?.user.userLevel) {
      return item;
    }
  });
  if (loading) return <>...Loading</>;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="py-9 flex flex-col gap-6"
      >
        <input
          type="hidden"
          defaultValue={data?.user.email ?? ""}
          {...register("email")}
          name="email"
        />

        <input
          className="hidden"
          type="number"
          defaultValue={1}
          {...register("userLevel")}
          name="userLevel"
        />
        <h1 className="text-26 font-500 text-neutral-gray-80 ">
          Thông tin cá nhân
        </h1>
        <div className="grid grid-cols-12  gap-9">
          <div className="flex flex-col gap-6 col-span-8">
            <div className="section-wrapper w-full">
              <div className="flex flex-col gap-2">
                <h3 className="section-label">Thông tin tài khoản của tôi</h3>
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
                          <div className="relative rounded-full overflow-hidden w-16 h-16 bg-main-bg-color">
                            <Image
                              src={
                                data?.user.avatar
                                  ? configImg(data?.user.avatar, appConfig)
                                  : "/User.svg"
                              }
                              alt={data?.user.userName ?? ""}
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
                          <p className="text-xs text-gray-500">
                            (Dung lượng ảnh tối đa 2MB)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          className="hidden"
                          accept="image/png, image/jpeg , image/webp"
                          type="file"
                          {...register("avatar")}
                          onChange={uploadImage}
                        />

                        {errors.avatar && errors.avatar.type === "required" && (
                          <p className="text_error">{errors.avatar.message}</p>
                        )}
                      </label>
                    </div>
                    <div className="row-span-1 col-span-8 px-2 py-1">
                      <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                        Email
                      </p>
                      <p className="text-[16px] font-400 text-neutral-gray-60 mb-2">
                        {data?.user.email ?? ""}
                      </p>
                    </div>
                    <div className="row-span-1 col-span-8 px-2 py-1">
                      
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Vai trò
                        </p>
                        <p className="inline-flex items-center  rounded-full bg-[#0099E91A] py-2 px-6 text-semantics-info text-16 font-500;">
                          {userLevel?.key ?? ""}
                        </p>
        
                    </div>

                    <div className="row-span-1 col-span-6 py-1">
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Họ và tên
                        </p>
                        <input
                          placeholder="Nhập họ và tên"
                          className=" input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
                          type="text"
                          defaultValue={data?.user.userName ?? ""}
                          {...register("userName", {
                            required: "Vui lòng nhập họ và tên", // Thông báo lỗi khi trường này trống
                          })}
                          name="userName"
                        />
                        {errors.userName && (
                          <p className="text_error mt-1">
                            {errors.userName.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="row-span-1 col-span-6 py-1">
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Số điện thoại
                        </p>
                        <input
                          placeholder="Nhập số điện thoại"
                          className=" input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
                          type="text"
                          defaultValue={data?.user.phone ?? ""}
                          {...register("phone")}
                          name="phone"
                        />
                      </div>
                    </div>
                    <div className="row-span-1 col-span-6 py-1">
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Ngày sinh
                        </p>
                        <input
                          className="input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
                          type="date"
                          defaultValue={convertDateFormat(
                            data?.user.birthDay ?? ""
                          )}
                          {...register("birthDay")}
                          name="birthDay"
                        />
                      </div>
                    </div>
                    <div className="row-span-1 col-span-6 py-1">
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Giới tính
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <input
                              id="male"
                              type="radio"
                              value="Nam"
                              defaultChecked={data?.user.gender === "Nam"}
                              {...register("gender")}
                              name="gender"
                            />
                            <label htmlFor="male">Nam</label>
                          </div>
                          <div className="flex gap-2 items-center">
                            <input
                              id="female"
                              type="radio"
                              value="Nữ"
                              defaultChecked={data?.user.gender === "Nữ"}
                              {...register("gender")}
                              name="gender"
                            />
                            <label htmlFor="female">Nữ</label>
                          </div>
                          <div className="flex gap-2 items-center">
                            <input
                              id="other"
                              type="radio"
                              value="khác"
                              defaultChecked={data?.user.gender === "khác"}
                              {...register("gender")}
                              name="gender"
                            />
                            <label htmlFor="other">Khác</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-wrapper w-full">
              <div className="flex flex-col gap-2">
                <h3 className="section-label">Mật khẩu</h3>
                <div
                  className="w-[166px] h-[48px] py-3 px-0 rounded-xl flex gap-1 cursor-pointer "
                  onClick={openModalChangePassword}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      stroke="#053729"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M17.5 12.5L10.5 12.5"
                      stroke="#053729"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.5 10.5L17.5 12.5"
                      stroke="#053729"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 10.5L15 12.5"
                      stroke="#053729"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="2"
                      cy="2"
                      r="2"
                      transform="matrix(-1 0 0 1 10.5 10.5)"
                      stroke="#053729"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span className="text-16-400 text-dark-color">
                    Thay đổi mật khẩu
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-4 flex flex-col col-start-9 gap-6">
            <div className="section-wrapper w-full px-9 py-6">
              <div className="section-item">
                <h3 className="section-label">Cửa hàng của tôi</h3>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_1318_23566)">
                        <mask
                          id="mask0_1318_23566"
                          style={{ maskType: "alpha" }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                        >
                          <rect width="24" height="24" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_1318_23566)">
                          <path
                            d="M5.07304 20.5C4.56804 20.5 4.14054 20.325 3.79054 19.975C3.44054 19.625 3.26554 19.1974 3.26554 18.6923V10.7038C2.86288 10.3731 2.56063 9.94392 2.35879 9.41625C2.15679 8.88875 2.15263 8.31925 2.34629 7.70775L3.35779 4.40375C3.49113 3.98325 3.71738 3.64417 4.03654 3.3865C4.35588 3.12883 4.73729 3 5.18079 3H18.8308C19.2745 3 19.6533 3.12308 19.9673 3.36925C20.2815 3.61542 20.5103 3.95392 20.6538 4.38475L21.6845 7.70775C21.8782 8.31925 21.874 8.88683 21.672 9.4105C21.4702 9.93433 21.168 10.3718 20.7653 10.723V18.6923C20.7653 19.1974 20.5903 19.625 20.2403 19.975C19.8903 20.325 19.4628 20.5 18.9578 20.5H5.07304ZM14.2155 10C14.7617 10 15.1723 9.833 15.4473 9.499C15.7223 9.165 15.8348 8.80633 15.7848 8.423L15.177 4.5H12.7653V8.45C12.7653 8.8705 12.9076 9.234 13.1923 9.5405C13.477 9.84683 13.818 10 14.2155 10ZM9.71554 10C10.1757 10 10.549 9.84683 10.8355 9.5405C11.1222 9.234 11.2655 8.8705 11.2655 8.45V4.5H8.85379L8.24629 8.4615C8.19229 8.81667 8.30379 9.16192 8.58079 9.49725C8.85779 9.83242 9.23604 10 9.71554 10ZM5.26554 10C5.63604 10 5.95463 9.87083 6.22129 9.6125C6.48796 9.35417 6.65271 9.0295 6.71554 8.6385L7.30379 4.5H5.18079C5.07179 4.5 4.98529 4.524 4.92129 4.572C4.85713 4.62017 4.80904 4.69233 4.77704 4.7885L3.81529 8.04225C3.68329 8.47175 3.74554 8.90542 4.00204 9.34325C4.25838 9.78108 4.67954 10 5.26554 10ZM18.7655 10C19.3065 10 19.7206 9.7875 20.0078 9.3625C20.295 8.9375 20.3642 8.49742 20.2155 8.04225L19.2038 4.76925C19.1718 4.67308 19.1238 4.60417 19.0598 4.5625C18.9956 4.52083 18.909 4.5 18.8 4.5H16.727L17.3153 8.6385C17.3781 9.0295 17.5429 9.35417 17.8095 9.6125C18.0762 9.87083 18.3949 10 18.7655 10ZM5.07304 19H18.9578C19.0475 19 19.1211 18.9712 19.1788 18.9135C19.2366 18.8558 19.2655 18.7821 19.2655 18.6923V11.4115C19.1565 11.4513 19.0655 11.476 18.9923 11.4855C18.9193 11.4952 18.8437 11.5 18.7655 11.5C18.3155 11.5 17.9197 11.4186 17.578 11.2558C17.2364 11.0929 16.9052 10.832 16.5845 10.473C16.3039 10.7858 15.9719 11.0353 15.5885 11.2213C15.2052 11.4071 14.768 11.5 14.277 11.5C13.8527 11.5 13.4527 11.4118 13.077 11.2355C12.7014 11.0593 12.3475 10.8052 12.0155 10.473C11.7065 10.8052 11.3565 11.0593 10.9655 11.2355C10.5744 11.4118 10.1782 11.5 9.77704 11.5C9.32571 11.5 8.90263 11.4183 8.50779 11.2548C8.11296 11.0913 7.76554 10.8307 7.46554 10.473C7.04488 10.8935 6.65729 11.1698 6.30279 11.302C5.94846 11.434 5.60271 11.5 5.26554 11.5C5.18721 11.5 5.10638 11.4952 5.02304 11.4855C4.93971 11.476 4.85379 11.4513 4.76529 11.4115V18.6923C4.76529 18.7821 4.79421 18.8558 4.85204 18.9135C4.90971 18.9712 4.98338 19 5.07304 19Z"
                            fill="#0E1010"
                          />
                        </g>
                      </g>
                      <defs>
                        <clipPath id="clip0_1318_23566">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    Đồ gia dụng
                  </div>

                  <button type="button" onClick={openModalStoreDetail}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.20057 12.7844C2.93314 12.2954 2.93314 11.7045 3.20058 11.2154C4.9 8.10803 8.20336 6 12 6C15.7966 6 19.1 8.10809 20.7994 11.2156C21.0669 11.7046 21.0669 12.2956 20.7994 12.7846C19.1 15.892 15.7966 18 12 18C8.20336 18 4.89997 15.8919 3.20057 12.7844Z"
                        stroke="#0099E9"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#0099E9"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="section-wrapper w-full px-9 py-6">
              <div className="section-item">
                <h3 className="section-label">Lịch sử thanh toán</h3>
                <div className="flex justify-between">
                  <div className="flex gap-2">Lịch sử giao dịch</div>

                  <button type="button" onClick={openModalStoryTransaction}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.20057 12.7844C2.93314 12.2954 2.93314 11.7045 3.20058 11.2154C4.9 8.10803 8.20336 6 12 6C15.7966 6 19.1 8.10809 20.7994 11.2156C21.0669 11.7046 21.0669 12.2956 20.7994 12.7846C19.1 15.892 15.7966 18 12 18C8.20336 18 4.89997 15.8919 3.20057 12.7844Z"
                        stroke="#0099E9"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#0099E9"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="section-wrapper w-full px-9 py-6">
              <div className="section-item">
                <h3 className="section-label">Hoạt động gần đây</h3>
                <Timeline items={timelineItems} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-start gap-6">
          <button className="btn bg-dark-color text-white ">
            Lưu thay đổi
          </button>
          <Link
            href={Routers.user.pathUsers}
            className="btn text-dark-color border border-dark-color"
          >
            Hủy
          </Link>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Thay đổi mật khẩu"
      >
        <PasswordChangeForm email={data?.user.email ?? ""} />
      </Modal>

      <Modal
        isOpen={isModalStoreDetailOpen}
        onClose={closeModalStoreDetail}
        title="Chi tiết cửa hàng"
        w={900}
      >
        <StoreDetail />
      </Modal>

      <Modal
        isOpen={isModalStoryTransaction}
        onClose={closeModalStoryTransaction}
        title="Lịch sử giao dịch"
        w={900}
      >
        {bodies && header && <Table headers={header} bodies={bodies} />}
      </Modal>
    </>
  );
};

export default UserProfilePage;
