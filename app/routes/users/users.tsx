import GetAll from "~/services/users/getAll";
import type { Route } from "./+types/users";
import type { User } from "~/db/schemas";
import { Form, useSubmit, type ActionFunctionArgs } from "react-router";
import { UpdateUser } from "~/services/users/updateUser";

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();
  const userId = Number(data.get("userId"));
  const auth = data.get("auth") === "true";
  const res = await UpdateUser({ userId, data: { isBlocked: !auth } });
  return data;
}

export async function loader() {
  const users = (await GetAll()) as User[];
  if (!users) {
    throw Error("No users available");
  }
  return users;
}

export default function ({ loaderData }: Route.ComponentProps) {
  const users = loaderData;
  const submit = useSubmit();
  const formData = new FormData();

  const handleBlockUser = ({
    userId,
    auth,
  }: {
    userId: number;
    auth: boolean;
  }) => {
    formData.append("userId", userId.toString());
    formData.append("auth", auth.toString());
    submit(formData, { method: "post" });
  };

  return (
    <div>
      <table className="table">
        <th>
          <td>Username</td>
          <td>Auth</td>
          <td>Ation</td>
        </th>
        {users.map((u) => (
          <tbody key={u.id}>
            <tr>
              <td>{u.username}</td>
              <td>{u.auth}</td>
              <td>
                {u.isBlocked ? (
                  <button
                    className="btn btn-error"
                    onClick={() =>
                      handleBlockUser({ userId: u.id, auth: u.isBlocked })
                    }
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    className="btn btn-warning"
                    onClick={() =>
                      handleBlockUser({ userId: u.id, auth: u.isBlocked })
                    }
                  >
                    Block
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}
