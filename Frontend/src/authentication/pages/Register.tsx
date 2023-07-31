import { Fragment, useState } from "react";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/Components/FormElements/Input";
import ErrorModal from "../../shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/Components/UIElements/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_MATCHPASSWORDS,
} from "../../shared/util/validators";
import Button from "../../shared/Components/FormElements/Button";
import Card from "../../shared/Components/UIElements/Card";
import ImageUpload from "../../shared/Components/FormElements/ImageUpload";
import "./Login.css";
import { useHistory } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";

const Register = () => {
  // const [isPasswordMatched, setIsPasswordMatched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      confirmpassword: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = async (event: any) => {
    event.preventDefault();

    console.log(formState.inputs);

    // const data = JSON.stringify({
    //   name: formState.inputs.name.value,
    //   email: formState.inputs.email.value,
    //   password: formState.inputs.password.value,
    // });
    // console.log(`Form Input Data : ${data}`);
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("email", formState.inputs.email.value);
      formData.append("name", formState.inputs.name.value);
      formData.append("password", formState.inputs.password.value);
      formData.append("image", formState.inputs.image.value);
      const response = await fetch(
        import.meta.env.VITE_APP_BACKEND_URL + "/api/users/signup",
        {
          method: "POST",
          // headers: {
          //   "Content-Type": "application/json",
          // },
          body: formData,
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      console.log(responseData);
      setIsLoading(false);
      auth.login(responseData.userId, responseData.token);
      history.push("/");
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Something went wrong, Please try again.");
    }
    setIsLoading(false);
    // const options = {
    //   headers: { "Content-Type": "application/json" },
    // };
    // let response;
    // try {
    //   response = await axios.post(
    //     "http://127.0.0.1:5000/api/users/signup",
    //     data,
    //     options
    //   );
    //   const responseData = await response.json();
    //   console.log(responseData);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const switchToLoginHandler = () => {
    history.push("/login");
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={errorHandler}></ErrorModal>
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
        <h2>Signup Required</h2>
        <hr />
        <form className="place-form" onSubmit={authSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name."
            onInput={inputHandler}
          ></Input>
          <Input
            id="email"
            element="input"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email."
            onInput={inputHandler}
          ></Input>
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(8)]}
            errorText="Please enter a valid password (at least 8 characters)."
            onInput={inputHandler}
          ></Input>
          <Input
            id="confirmpassword"
            element="input"
            type="password"
            label="Confirm Password"
            validators={[
              VALIDATOR_MATCHPASSWORDS({
                val1: formState.inputs.password.value,
                val2: formState.inputs.confirmpassword.value,
              }),
            ]}
            errorText="Confirm password is not matched"
            onInput={inputHandler}
          ></Input>
          <ImageUpload
            center
            id="image"
            onInput={inputHandler}
            errorText="Please upload an valid image!"
          ></ImageUpload>
          <Button type="submit" disabled={!formState.isValid}>
            Sign up
          </Button>
        </form>
        <Card className="signup">
          <p>Already have an account?</p>
          <Button inverse onClick={switchToLoginHandler}>
            Log in
          </Button>
        </Card>
      </Card>
    </Fragment>
  );
};

export default Register;
