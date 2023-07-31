import PlaceList from "../components/PlaceList";

import { useParams } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import ErrorModal from "../../shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/Components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState<any>(false);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();
  const userId = useParams<any>().userId;
  console.log(`User ID ${userId}`);
  const sendRequest = async () => {
    try {
      console.log("Inside try block");
      setIsLoading(true);
      const response = await fetch(
        import.meta.env.VITE_APP_BACKEND_URL + `/api/places/user/${userId}`,
        {
          method: "GET",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setLoadedPlaces(responseData.places);
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Something went wrong, Please try again!!");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    sendRequest();
  }, [userId]);

  const errorHandler = () => {
    setError(null);
  };

  const deletePlaceHandler = (deletedPlaceId: any) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place: any) => place._id !== deletedPlaceId)
    );
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={errorHandler}></ErrorModal>
      {isloading && (
        <div className="center">
          <LoadingSpinner asOverlay></LoadingSpinner>
        </div>
      )}
      {!isloading && loadedPlaces && (
        <PlaceList
          items={loadedPlaces}
          onDeletePlace={deletePlaceHandler}
        ></PlaceList>
      )}
    </Fragment>
  );
};

export default UserPlaces;
