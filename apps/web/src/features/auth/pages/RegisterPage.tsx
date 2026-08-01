import RegisterForm from "../components/RegisterForm";
import AuthCardWrapper from "../components/AuthCardWrapper ";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div className="flex flex-col min-h-svh justify-center items-center">
      <AuthCardWrapper
        title="Create your account"
        description="Join an existing organization with an invite, or start your own."
      >
        <RegisterForm />
      </AuthCardWrapper>
      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="underline underline-offset-4 font-semibold"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
