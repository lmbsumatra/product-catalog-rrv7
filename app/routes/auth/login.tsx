import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  redirect,
} from "react-router";
import {
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { getUserId, createUserSession } from "~/utils/auth.server";
import { LoginSchema, type LoginFormData } from "../../db/schemas/Auth";
import { authenticateUser } from "~/utils/authenticateUser";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/");
  }
  return {};
}

export async function action({ request }: ActionFunctionArgs) {

  const formData = await request.formData();
  const data: Record<string, any> = {};

  formData.forEach((value, key) => {
    data[key] = value;
  });

  const validationResult = LoginSchema.safeParse(data);

  if (!validationResult.success) {
    throw new Error("Validation error");
  }

  const { username, password, redirectTo } = validationResult.data;

  try {
    const authUser = await authenticateUser(username, password);
    if (!authUser?.user) {
      return {
        errors: { general: authUser?.message ?? "Invalid username or password" },
        status: 400,
      };
    }

    return createUserSession(
      authUser.user.id,
      authUser.user.username,
      authUser.user.auth,
      redirectTo || "/"
    );
  } catch (error) {
    return {
      errors: { general: "An unexpected error occurred" },
      status: 500,
    };
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    submit(formData, { method: "post" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            or{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="fieldset w-full space-y-4"
        >
          <div className="flex flex-col gap-1">
            <div>
              <label className="label">
                <span className="label-text">Username *</span>
              </label>
              <input
                {...register("username")}
                type="text"
                autoComplete="username"
                className={`input input-bordered w-full ${errors.username ? "input-error" : ""}`}
                placeholder="Username"
              />
              {errors.username && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {errors.username.message}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Password *</span>
              </label>
              <input
                {...register("password")}
                type="password"
                autoComplete="current-password"
                className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
                placeholder="Password"
              />
              {errors.password && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </div>
              )}
            </div>
          </div>

          <input {...register("redirectTo")} type="hidden" />

          {actionData?.errors?.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-red-800 text-sm">
                {actionData.errors.general}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
