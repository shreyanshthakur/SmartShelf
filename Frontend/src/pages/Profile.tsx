import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const Profile = () => {
  // get user first name, last name, email
  const { firstName, lastName, email } = useSelector(
    (state: RootState) => state.user,
  );

  return (
    <div>
      <div>
        UserName: {firstName} {lastName}
      </div>
      <div>Email: {email}</div>
    </div>
  );
};
