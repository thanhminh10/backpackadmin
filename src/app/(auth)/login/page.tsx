"use client";
import { useMutation } from "@apollo/client";
import { MUTATION_LOGIN } from "@src/graphql/auth";
import { IAccount } from "@src/interfaces/account";
import { AccountLevelType } from "@src/utils/enum/accountLevelTypes";
import { Routers } from "@src/utils/router";
import { decode } from "jsonwebtoken";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ButtonSubmit from "./_component/button-submit";
import { ILoginResponse } from "./_interface/login";
import toastNotify from "@src/action/toast-notify";

export default function Login() {
  const router = useRouter();
  const [mutationLogin] = useMutation<ILoginResponse>(MUTATION_LOGIN);

  async function onSubmit(event: FormData) {
    const email = event.get("email");
    const password = event.get("password");
    
    
    mutationLogin({ variables: { userLogin: { email, password } } }).then(
      ({ data }) => {
        const token = data?.login.data?.token;
        if (token) {
      
          handleCheckRedirect(token);
        } else {
          toastNotify("error", data?.login.message ?? "Login failed");
        }
      }
    );
  }

  const handleCheckRedirect = async (token: string) => {
    const account = (await decode(token)) as IAccount;
    if (account.level != AccountLevelType.USER) {
      localStorage.setItem("token", token);
      window.location.href = Routers.dashboard.pathDashboard;
    } else {
      toastNotify("error", "You don't have permission");
    }
  };

  return (
    <div className="w-full max-w-xs bg-white shadow-md rounded p-8 m-auto">
      <h4 className="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        Sign in
      </h4>
      <form action={onSubmit}>
        <div className="flex flex-col gap-6 mb-1">
          <div>
            <h6 className="font-semibold text-blue-gray-900">Email</h6>
            <input
              placeholder="Email"
              className="input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
              name="email"
              type="email"
            />
          </div>
          <div>
            <h6 className="font-semibold text-blue-gray-900">Password</h6>
            <input
              type="password"
              placeholder="Password"
              className="input_animation_focus_1 border-neutral-gray-40 rounded-lg px-4 py-2 h-[42px]"
              name="password"
            />
          </div>
        </div>
        <ButtonSubmit />
        <p className="block mt-4 font-sans text-base antialiased font-normal leading-relaxed text-center text-gray-700">
          Already have an account?
          <Link href={"register"} className="font-medium text-gray-900">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
