import Input from "../../shared/Components/FormElements/Input";
import Button from "../../shared/Components/FormElements/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/Components/UIElements/Card";
import "./Login.css";
import { Fragment, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/Components/UIElements/LoadingSpinner";

const Login = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [formState, inputHandler] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = async (event: any) => {
    event.preventDefault();

    const data = JSON.stringify({
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
    });
    try {
      setIsLoading(true);
      const response = await fetch(
        import.meta.env.VITE_APP_BACKEND_URL + "/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      auth.login(responseData.userId, responseData.token);
      history.push("/");
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Something went wrong, Please try again!");
    }
    setIsLoading(false);
  };

  const switchToSignUpHandler = () => {
    history.push("/register");
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={errorHandler}></ErrorModal>
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
        <h2>Login Required</h2>
        <hr />
        <form className="place-form" onSubmit={authSubmitHandler}>
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
          <Button type="submit" disabled={!formState.isValid}>
            Log in
          </Button>
        </form>
        <Card className="signup">
          <p>Don't have an account?</p>
          <Button inverse onClick={switchToSignUpHandler}>
            Sign up
          </Button>
        </Card>
      </Card>
    </Fragment>
  );
};

export default Login;
