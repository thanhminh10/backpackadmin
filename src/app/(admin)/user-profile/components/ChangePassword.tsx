import { useMutation } from "@apollo/client";
import toastNotify from "@src/action/toast-notify";
import toastPromise from "@src/action/toast-promise";
import { MUTATION_CHANGPASSWORD_USER } from "@src/graphql/userprofile";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
// Define the form data type
interface FormData {
  email: string;
  currentPassword: string;
  password: string;
}

interface Props {
  email: string;
}

const PasswordChangeForm = ({ email }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [changepassword] = useMutation(MUTATION_CHANGPASSWORD_USER);

  // Two separate states for toggling visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const toggleCurrentPasswordVisibility = () =>
    setShowCurrentPassword(!showCurrentPassword);
  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const mutate = changepassword({
        variables: { ...data },
      });

      const resp = await toastPromise(mutate);
      if (resp && resp.data) {
        const { success, message } = resp.data.resetPassword;
        if (!success) {
          toastNotify("error", message);
        }
      }
    } catch (error: any) {
      toastNotify("error", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <input type="hidden" defaultValue={email} {...register("email")} />

      {/* Current Password Input */}
      <div className="row-span-1 col-span-8">
        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
          Mật khẩu hiện tại
        </p>
        <div className="relative">
          <input
            placeholder="Nhập mật khẩu"
            className="input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px] w-full"
            type={showCurrentPassword ? "text" : "password"}
            {...register("currentPassword", { required: "Điền mật khẩu" })}
          />
          <button
            type="button"
            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
            onClick={toggleCurrentPasswordVisibility}
          >
            {/* Toggle Icon for Current Password */}
            {showCurrentPassword ? <EyeIcon /> : <EyeOffIcon />}
          </button>
          {errors.currentPassword && (
            <p className="text-red-500">{errors.currentPassword.message}</p>
          )}
        </div>
      </div>

      {/* New Password Input */}
      <div className="row-span-1 col-span-8">
        <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
          Mật khẩu mới
        </p>
        <div className="relative">
          <input
            placeholder="Nhập mật khẩu mới"
            className="input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px] w-full"
            type={showNewPassword ? "text" : "password"}
            {...register("password", { required: "Điền mật khẩu mới" })}
          />
          <button
            type="button"
            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
            onClick={toggleNewPasswordVisibility}
          >
            {/* Toggle Icon for New Password */}
            {showNewPassword ? <EyeIcon /> : <EyeOffIcon />}
          </button>
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 bg-dark-color text-white rounded-xl "
      >
        Thay đổi mật khẩu
      </button>
    </form>
  );
};

// Example icons for toggling password visibility
const EyeIcon = () => (
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
);

const EyeOffIcon = () => (
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
    <circle cx="12" cy="12" r="3" stroke="#525655" strokeWidth="1.5" />
  </svg>
);

export default PasswordChangeForm;
