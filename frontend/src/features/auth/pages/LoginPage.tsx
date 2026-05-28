import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { ROUTE_PATHS } from "@/app/router/routePaths";

import { useAuthStore } from "../store/authStore";

import { loginUser } from "../services/auth.service";

import { loginSchema, type LoginFormValues } from "../schemas/loginSchema";

function LoginPage() {
  /*
   =========================
   NAVIGATION
   =========================
  */

  const navigate = useNavigate();

  /*
   =========================
   AUTH STORE
   =========================
  */

  const login = useAuthStore((state) => state.login);

  /*
   =========================
   FORM
   =========================
  */

  const {
    register,
    handleSubmit,
    setError,

    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  /*
   =========================
   SUBMIT
   =========================
  */
  const onSubmit = async (values: LoginFormValues) => {
    try {
      /*
     =========================
     LOGIN REQUEST
     =========================
    */
      console.log("FORM VALUES:", values);
      const response = await loginUser(values);
      console.log("LOGIN RESPONSE:", response);

      /*
     =========================
     SAVE AUTH STATE
     =========================
    */

      login(response.user, response.accessToken);

      /*
     =========================
     TEMP REDIRECT
     =========================
    */

      navigate(ROUTE_PATHS.DASHBOARD);
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      alert(error instanceof Error ? error.message : "Login failed");

      setError("root", {
        message:
          error instanceof Error ? error.message : "Invalid email or password",
      });
    }
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 dark:bg-slate-950">
      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-xl
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">DigiSchool ERP</h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to continue
          </p>
        </div>

        {/* ========================= */}
        {/* FORM */}
        {/* ========================= */}

        <form
          noValidate
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* EMAIL */}

          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email")}
          />

          {/* PASSWORD */}

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />

          {/* ROOT ERROR */}

          {errors.root ? (
            <p className="text-sm text-red-500">{errors.root.message}</p>
          ) : null}

          {/* SUBMIT */}

          <Button type="submit" isLoading={isSubmitting}>
            Sign In
          </Button>
        </form>

        {/* ========================= */}
        {/* DEMO ACCOUNTS */}
        {/* ========================= */}

        <div
          className="
            mt-8
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-4
            text-sm
            dark:border-slate-800
            dark:bg-slate-800
          "
        >
          <p className="mb-3 font-semibold text-slate-700 dark:text-slate-200">
            Demo Accounts
          </p>

          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <p>
              <span className="font-medium">Manager:</span> manager@gmail.com
            </p>

            <p>
              <span className="font-medium">Teacher:</span> teacher@gmail.com
            </p>

            <p>
              <span className="font-medium">Student:</span> student@gmail.com
            </p>

            <p>
              <span className="font-medium">Password:</span> 123456
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
