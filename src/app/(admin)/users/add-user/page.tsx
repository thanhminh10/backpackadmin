"use client";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import AutoCompleteWithOutAdd from "@src/components/autocomplete/autocompleteWithoutAdd";
import {
  QUERY_DISTRICT,
  QUERY_PROVINCE,
  QUERY_WARD,
} from "@src/graphql/address/query";
import { MUTATION_ADD_USER } from "@src/graphql/user";
import { uploadFileIcon } from "@src/utils/icon/icon";
import { Routers } from "@src/utils/router";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  DistrictResponse,
  ProvinceResponse,
  WardResponse,
} from "../_interface/address";
import { IFormUser } from "../_interface/user";
import { IAddUserResponse } from "./_interface/add-user";

export default function AddUser() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Show hide password start
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);
  // Show hide password end

  const [mutationAddUser] = useMutation<IAddUserResponse>(MUTATION_ADD_USER);
  const [newImages, setNewImages] = useState<File[]>();

  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>("");
  const [selectedWardCode, setSelectedWardCode] = useState<string>("");
  const { data: provinceData } = useQuery<ProvinceResponse>(QUERY_PROVINCE);
  const memorizedProvinceData = useMemo(() => provinceData, [provinceData]);

  const [fetchDistricts, { data: districtData }] =
    useLazyQuery<DistrictResponse>(QUERY_DISTRICT);
  const memorizedDistrictData = useMemo(() => districtData, [districtData]);

  const [fetchWards, { data: wardData }] =
    useLazyQuery<WardResponse>(QUERY_WARD);
  const memorizedWardData = useMemo(() => wardData, [wardData]);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<IFormUser>({
    defaultValues: {
      address: {
        district: "",
        province: "",
        ward: "",
      },
    },
  });
  useEffect(() => {
    if (selectedProvinceCode) {
      // Gọi API để lấy dữ liệu quận khi provinceCode thay đổi

      setSelectedDistrictCode(""); // Đặt lại mã quận khi province thay đổi
      setSelectedWardCode(""); // Đặt lại mã phường khi province thay đổi
      fetchDistricts({ variables: { provinceCode: selectedProvinceCode } });
    }
  }, [selectedProvinceCode, fetchDistricts, provinceData]);

  useEffect(() => {
    if (selectedDistrictCode) {
      // Gọi API để lấy dữ liệu phường khi DistrictCode thay đổi
      setSelectedWardCode(""); // Đặt lại mã phường khi district thay đổi
      fetchWards({ variables: { districtCode: selectedDistrictCode } });
    }
  }, [selectedDistrictCode, fetchWards, districtData]);

  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const _files = Array.from(event.target.files);
      setNewImages(_files);
    }
  };

  const onSubmit: SubmitHandler<IFormUser> = async (data: IFormUser) => {
    const provinceName = provinceData?.provinces.find((item) => {
      if (item.code == selectedProvinceCode) {
        return item;
      }
    });

    const districtName = districtData?.districts.find((item) => {
      if (item.code == selectedDistrictCode) {
        return item;
      }
    });

    const wardName = wardData?.wards.find((item) => {
      if (item.code == selectedWardCode) {
        return item;
      }
    });

    const detailedAddress = data.address?.detailedAddress || "";
    const ward = wardName?.name || "";
    const district = districtName?.name || "";
    const province = provinceName?.name || "";
    const fullAddress = `${detailedAddress}, ${ward}, ${district}, ${province}`
      .replace(/(^, )|(^, $)|(, ,)/g, "")
      .trim();

    const queryData: IFormUser = {
      email: data.email,
      phone: data.phone,
      userName: data.userName,
      userLevel: +data.userLevel,
      password: data.password,
    };

    try {
      const mutate = mutationAddUser({
        variables: {
          userRegister: {
            ...queryData,
            // address: fullAddress,
          },
        },
      });

      const resp = await toastPromise(mutate);

      const { message, success } = resp.data?.register!;

      if (success) {
        router.push(Routers.user.pathUsers);
      } else {
        toastNotify("error", message);
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  const handleProvinceChange = (changeId: string) => {
    setSelectedProvinceCode(changeId);
    setSelectedDistrictCode("");
    setSelectedWardCode("");
    reset({
      address: {
        ...getValues("address"), // Lấy đúng giá trị của address
        province: changeId,
        district: "",
        ward: "",
      },
    });
  };

  const handleDistrictChange = (changeId: string) => {
    setSelectedDistrictCode(changeId);
    setSelectedWardCode("");
    reset({
      address: {
        ...getValues("address"), // Lấy đúng giá trị của address
        district: changeId,
        ward: "",
      },
    });
  };

  const handleWardChange = (changeId: string) => {
    setSelectedWardCode(changeId);
    reset({
      address: {
        ...getValues("address"), // Lấy đúng giá trị của address
        ward: changeId,
      },
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="py-9 flex flex-col gap-6"
      >
        <h1 className="text-26 font-500 text-neutral-gray-80 ">
          Thêm tài khoản mới
        </h1>
        <div className="grid grid-cols-12  gap-9">
          <div className="flex flex-col gap-6 col-span-8">
            <div className="section-wrapper w-full">
              <div className="flex flex-col gap-2">
                <h3 className="section-label">Thông tin tài khoản</h3>
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
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Email
                        </p>
                        <input
                          placeholder="Nhập Email"
                          className=" input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
                          type="email"
                          {...register("email", {
                            required: "Vui lòng nhập email", // Thông báo lỗi khi trường này trống
                            pattern: {
                              value:
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                              message: "Email không hợp lệ", // Thông báo lỗi khi định dạng email không đúng
                            },
                          })}
                          name="email"
                        />
                        {errors.email && (
                          <p className="text_error mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="row-span-1 col-span-8 px-2 py-1">
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Mật khẩu
                        </p>
                        <div className="relative">
                          <input
                            placeholder="Nhập mật khẩu"
                            className="input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px] w-full"
                            type={showPassword ? "text" : "password"}
                            {...register("password", {
                              required: "Vui lòng nhập mật khẩu", // Thông báo lỗi khi trường này trống
                            })}
                            name="password"
                          />
                          <button
                            type="button"
                            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M20.7994 11.2156L21.4575 10.8557L20.7994 11.2156ZM20.7994 12.7846L21.4574 13.1444L20.7994 12.7846ZM3.20058 11.2154L3.8586 11.5753L3.20058 11.2154ZM3.20057 12.7844L2.54254 13.1443H2.54254L3.20057 12.7844ZM19.5236 8.30907C19.227 8.0199 18.7522 8.0259 18.463 8.32247C18.1738 8.61904 18.1798 9.09387 18.4764 9.38304L19.5236 8.30907ZM9.68628 16.9596C9.28505 16.8567 8.87638 17.0986 8.7735 17.4998C8.67062 17.9011 8.91249 18.3097 9.31372 18.4126L9.68628 16.9596ZM14.604 6.34114L14.4099 7.06559L14.604 6.34114ZM7.07264 16.7089L6.70374 17.3619L7.50475 16.0959L7.07264 16.7089ZM3.8586 11.5753C5.43153 8.69919 8.4879 6.75 12 6.75V5.25C7.91882 5.25 4.36847 7.51686 2.54256 10.8556L3.8586 11.5753ZM20.1414 12.4247C18.5685 15.3008 15.5121 17.25 12 17.25V18.75C16.0812 18.75 19.6315 16.4831 21.4574 13.1444L20.1414 12.4247ZM20.1414 11.5754C20.2862 11.8402 20.2862 12.1599 20.1414 12.4247L21.4574 13.1444C21.8475 12.4312 21.8475 11.569 21.4575 10.8557L20.1414 11.5754ZM2.54256 10.8556C2.15249 11.5688 2.15248 12.431 2.54254 13.1443L3.8586 12.4246C3.7138 12.1598 3.7138 11.8401 3.8586 11.5753L2.54256 10.8556ZM18.4764 9.38304C19.1347 10.0249 19.6974 10.7635 20.1414 11.5754L21.4575 10.8557C20.9413 9.91179 20.2876 9.05403 19.5236 8.30907L18.4764 9.38304ZM12 17.25C11.2002 17.25 10.4251 17.1491 9.68628 16.9596L9.31372 18.4126C10.1732 18.633 11.0735 18.75 12 18.75V17.25ZM12 6.75C12.8346 6.75 13.6423 6.85991 14.4099 7.06559L14.7981 5.6167C13.905 5.37739 12.9668 5.25 12 5.25V6.75ZM5.92995 14.9904C5.09529 14.2678 4.39151 13.399 3.8586 12.4246L2.54254 13.1443C3.16202 14.2771 3.97944 15.2858 4.94816 16.1244L5.92995 14.9904ZM7.44154 16.0559C6.90181 15.751 6.3956 15.3935 5.92995 14.9904L4.94816 16.1244C5.48873 16.5924 6.07659 17.0076 6.70374 17.3619L7.44154 16.0559ZM5.00695 16.1704L6.64054 17.3219L7.50475 16.0959L5.87116 14.9444L5.00695 16.1704ZM14.4099 7.06559C15.1269 7.2577 15.8096 7.53359 16.4471 7.88219L17.1668 6.56615C16.426 6.161 15.6321 5.84016 14.7981 5.6167L14.4099 7.06559Z"
                                  fill="#0E1010"
                                />
                                <path
                                  d="M19.4609 4.46436L4.46094 19.4644"
                                  stroke="#0E1010"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M9 12C9 10.3431 10.3431 9 12 9"
                                  stroke="#0E1010"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                              </svg>
                            ) : (
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M3.20057 12.7844C2.93314 12.2954 2.93314 11.7045 3.20058 11.2154C4.9 8.10803 8.20336 6 12 6C15.7966 6 19.1 8.10809 20.7994 11.2156C21.0669 11.7046 21.0669 12.2956 20.7994 12.7846C19.1 15.892 15.7966 18 12 18C8.20336 18 4.89997 15.8919 3.20057 12.7844Z"
                                  stroke="#525655"
                                  strokeWidth="1.5"
                                />
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="3"
                                  stroke="#525655"
                                  strokeWidth="1.5"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text_error mt-1">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="row-span-1 col-span-12 px-2 py-1">
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Họ và tên
                        </p>
                        <input
                          placeholder="Nhập họ và tên"
                          className=" input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
                          type="text"
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

                    <div className="row-span-1 col-span-6 px-2 py-1">
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Vai trò
                        </p>
                        <select
                          className="select_custom"
                          {...register("userLevel")}
                        >
                          <option value="3">Người bán</option>
                          <option value="4">Nhân viên bán hàng</option>
                          <option value="5">Khách hàng</option>
                        </select>
                      </div>
                    </div>
                    <div className="row-span-1 col-span-6 px-2 py-1">
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Số điện thoại
                        </p>
                        <input
                          placeholder="Nhập số điện thoại"
                          className=" input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
                          type="text"
                          {...register("phone")}
                          name="phone"
                        />
                      </div>
                    </div>
                    <div className="row-span-1 col-span-6 px-2 py-1">
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Ngày sinh
                        </p>
                        <input
                          className="input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
                          type="date"
                          {...register("birthDay")}
                          name="birthDay"
                        />
                      </div>
                    </div>
                    <div className="row-span-1 col-span-6 px-2 py-1">
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Giới tính
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <input
                              id="male"
                              type="radio"
                              value="male"
                              {...register("gender")}
                              name="gender"
                            />
                            <label htmlFor="male">Nam</label>
                          </div>
                          <div className="flex gap-2 items-center">
                            <input
                              id="female"
                              type="radio"
                              value="female"
                              {...register("gender")}
                              name="gender"
                            />
                            <label htmlFor="female">Nữ</label>
                          </div>
                          <div className="flex gap-2 items-center">
                            <input
                              id="other"
                              type="radio"
                              value="other"
                              {...register("gender")}
                              name="gender"
                            />
                            <label htmlFor="other">Khác</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row-span-1 col-span-6 px-2 py-1">
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Thành phố
                        </p>
                        <Controller
                          name="address.province"
                          control={control}
                          // rules={{ required: "Vui lòng chọn Thành phố" }}
                          render={({ formState: { errors }, field }) => (
                            <AutoCompleteWithOutAdd
                              hiddenInputName="address.province"
                              data={memorizedProvinceData?.provinces ?? []}
                              onChange={handleProvinceChange}
                              value={field.value}
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="row-span-1 col-span-6 px-2 py-1">
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Quận/ Huyện
                        </p>
                        <Controller
                          control={control}
                          name="address.district"
                          // rules={{ required: "Chọn danh mục là bắt buộc" }}
                          defaultValue={selectedDistrictCode}
                          render={({ formState: { errors }, field }) => (
                            <div>
                              <AutoCompleteWithOutAdd
                                data={memorizedDistrictData?.districts ?? []}
                                hiddenInputName="address.district"
                                value={field.value}
                                onChange={handleDistrictChange}
                              />
                              {errors && (
                                <p className="text-red-500">
                                  {errors.address?.message}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </div>
                    </div>

                    <div className="row-span-1 col-span-6 px-2 py-1">
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Phường/ Xã
                        </p>

                        <Controller
                          control={control}
                          name="address.ward"
                          // rules={{ required: "Chọn danh mục là bắt buộc" }}
                          defaultValue={selectedWardCode}
                          render={({ formState: { errors }, field }) => (
                            <div>
                              <AutoCompleteWithOutAdd
                                data={memorizedWardData?.wards ?? []}
                                hiddenInputName="address.ward"
                                value={field.value}
                                onChange={handleWardChange}
                              />
                              {errors && (
                                <p className="text-red-500">
                                  {errors.address?.message}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </div>
                    </div>

                    <div className="row-span-1 col-span-6 px-2 py-1">
                      <div>
                        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                          Địa chỉ cụ thể
                        </p>
                        <input
                          placeholder="Địa chỉ cụ thể"
                          className=" input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
                          type="text"
                          {...register("address.detailedAddress")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-4 flex flex-col col-start-9 gap-6">
            <div className="section-wrapper w-full px-9 py-6">
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
            href={Routers.user.pathUsers}
            className="btn text-dark-color border border-dark-color"
          >
            Hủy
          </Link>
        </div>
      </form>
    </>
  );
}
