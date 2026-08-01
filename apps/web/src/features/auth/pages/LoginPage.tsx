import { Link } from "react-router-dom";
import AuthCardWrapper from "../components/AuthCardWrapper ";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex flex-col min-h-svh justify-center items-center">
      <AuthCardWrapper
        title="Welcome back"
        description="Sign in to reach every organization you belong to."
      >
        <LoginForm />
      </AuthCardWrapper>
      <p className="mt-4 text-sm">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="underline underline-offset-4 font-semibold"
        >
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
