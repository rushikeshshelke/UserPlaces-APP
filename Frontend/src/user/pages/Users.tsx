import UserList from "../components/UserList";
import { Fragment, useEffect, useState } from "react";
import ErrorModal from "../../shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/Components/UIElements/LoadingSpinner";

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [loadedUsers, setLoadedUsers] = useState();
  useEffect(() => {
    const sendRequest = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          import.meta.env.VITE_APP_BACKEND_URL + "/api/users",
          {
            method: "GET",
          }
        );
        const responseData = await response.json();
        console.log(responseData.users);
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedUsers(responseData.users);
        setIsLoading(false);
      } catch (err: any) {
        console.log(err);
        setError(
          err.message || "Something went wrong, Please refresh the page!"
        );
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={errorHandler}></ErrorModal>
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay></LoadingSpinner>
        </div>
      )}
      {!isLoading && loadedUsers && <UserList items={loadedUsers}></UserList>}
    </Fragment>
  );
};

export default Users;
