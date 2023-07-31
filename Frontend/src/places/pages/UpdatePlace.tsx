import { useParams, useHistory } from "react-router-dom";
import "../../App.css";
import Input from "../../shared/Components/FormElements/Input";
import Button from "../../shared/Components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import "./FormPlace.css";
import { useForm } from "../../shared/hooks/form-hook";
import { Fragment, useEffect, useState, useContext } from "react";
import Card from "../../shared/Components/UIElements/Card";
import ErrorModal from "../../shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/Components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
  const placeId = useParams<any>().placeId;

  const [loadedPlace, setLoadedPlace] = useState();
  const [error, setError] = useState<any>();
  const [isLoding, setIsLoding] = useState(true);
  const history = useHistory();
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const sendRequest = async () => {
      try {
        setIsLoding(true);
        const response = await fetch(
          import.meta.env.VITE_APP_BACKEND_URL + `/api/places/${placeId}`,
          {
            method: "GET",
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
        setIsLoding(false);
      } catch (err: any) {
        console.log(err);
        setError(
          err.message || "Something went wrong, Please refresh the page!"
        );
      }
    };
    sendRequest();
  }, [placeId, setFormData]);

  if (isLoding) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay></LoadingSpinner>
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  const updatePlaceSubmitHandler = async (event: any) => {
    event.preventDefault();
    const data = JSON.stringify({
      title: formState.inputs.title.value,
      description: formState.inputs.description.value,
    });
    try {
      setIsLoding(true);
      const response = await fetch(
        import.meta.env.VITE_APP_BACKEND_URL + `/api/places/${placeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: data,
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Something went wrong, Please refresh the page!");
    }
    setIsLoding(false);
    history.push(`/${auth.userId}/places`);
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={errorHandler}></ErrorModal>
      <form className="place-form" onSubmit={updatePlaceSubmitHandler}>
        {isLoding && <LoadingSpinner asOverlay></LoadingSpinner>}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          value={formState.inputs.title.value}
          valid={formState.inputs.title.isValid}
          onInput={inputHandler}
        ></Input>
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          value={formState.inputs.description.value}
          valid={formState.inputs.description.isValid}
          onInput={inputHandler}
          rows={6}
        ></Input>
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>
    </Fragment>
  );
};

export default UpdatePlace;
