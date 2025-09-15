import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  redirect,
} from "react-router";
import { Link, useActionData, useNavigation, useSubmit } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { createUserSession, getUserId } from "~/utils/auth.server";
import { RegisterSchema, type RegisterFormData } from "~/db/schemas/Auth";
import { FindUserByUsername } from "~/services/users/findUserByUsername";
import { createUser } from "~/services/users/createUser";

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

  const validationResult = RegisterSchema.safeParse(data);

  if (!validationResult.success) {
    throw new Error("Validation error");
  }

  const { username, password, confirmPassword } = validationResult.data;

  try {
    const existingUser = await FindUserByUsername(username);
    if (existingUser) {
      return {
        errors: {
          fields: { username: "A user with this username already exists" },
        },
        status: 400,
      };
    }

    const user = await createUser({ username, password, confirmPassword });

    if (!user) {
      throw new Error("User not found");
    }

    return createUserSession(user.id, user.username, "/");
  } catch (error) {
    return {
      errors: { general: "An unexpected error occurred" },
      status: 500,
    };
  }
}

export default function Register() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  });

  const password = watch("password");

  const onSubmit = (data: RegisterFormData) => {
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to existing account
            </Link>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="fieldset w-full space-y-4"
        >
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Username *</span>
              </label>
              <input
                {...register("username")}
                type="text"
                autoComplete="username"
                className={`input input-bordered w-full ${errors.username ? "input-error" : ""}`}
                placeholder="johndoe"
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
                autoComplete="new-password"
                className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
                placeholder="Minimum 6 characters"
              />
              {errors.password && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Confirm Password *</span>
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                autoComplete="new-password"
                className={`input input-bordered w-full ${errors.confirmPassword ? "input-error" : ""}`}
                placeholder="Repeat your password"
              />
              {errors.confirmPassword && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {errors.confirmPassword.message}
                  </span>
                </div>
              )}
            </div>
          </div>

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
                  Creating account...
                </div>
              ) : (
                "Create account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
