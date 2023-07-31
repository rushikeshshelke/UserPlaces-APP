import "./PlaceItem.css";

import Card from "../../shared/Components/UIElements/Card";
import Button from "../../shared/Components/FormElements/Button";
import { useState, useContext } from "react";
import Modal from "../../shared/Components/UIElements/Modal";
import { Fragment } from "react";
import Map from "../../shared/Components/UIElements/Map";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/Components/UIElements/LoadingSpinner";

interface PlaceItemProps {
  id: string;
  name: string;
  image: string;
  title: string;
  description: string;
  address: string;
  createdBy: string;
  coordinates: any;
  onDelete: any;
}

const PlaceItem = ({
  id,
  name,
  image,
  title,
  description,
  address,
  createdBy,
  coordinates,
  onDelete,
}: PlaceItemProps) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  const openMapHandler = () => {
    setShowMap(true);
  };

  const closeMapHandler = () => {
    setShowMap(false);
  };

  const openDeleteHandler = () => {
    setShowDelete(true);
  };

  const closeDeleteHandler = () => {
    setShowDelete(false);
  };

  const deletePlaceHandler = async () => {
    setShowDelete(false);
    try {
      setIsLoading(true);
      await fetch(import.meta.env.VITE_APP_BACKEND_URL + `/api/places/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      // const responseData = await response.json();
      // if (!response.ok) {
      //   throw new Error(responseData.message);
      // }
      // const responseData = await response.json();
      // if (!response.ok) {
      //   throw new Error(responseData.message);
      // }
      onDelete(id);
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Something went wrong, Please try again!!");
    }
    setIsLoading(false);
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={errorHandler}></ErrorModal>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className="map-container">
          <Map center={coordinates} zoom={16}></Map>
        </div>
      </Modal>
      <Modal
        header="Are you sure?"
        show={showDelete}
        onCancel={closeDeleteHandler}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={
          <Fragment>
            <Button inverse onClick={closeDeleteHandler}>
              No
            </Button>
            <Button danger onClick={deletePlaceHandler}>
              Yes
            </Button>
          </Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isloading && <LoadingSpinner asOverlay></LoadingSpinner>}
          <div className="place-item__image">
            <img
              src={`${import.meta.env.VITE_APP_BACKEND_URL}/${image}`}
              alt={title}
            ></img>
          </div>
          <div className="place-item__info">
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              View on Map
            </Button>
            {auth.userId === createdBy && (
              <Button to={`/places/${id}`}>Edit</Button>
            )}
            {auth.userId === createdBy && (
              <Button danger onClick={openDeleteHandler}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </Fragment>
  );
};

export default PlaceItem;
