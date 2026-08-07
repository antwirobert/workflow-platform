import RegisterForm from "../components/RegisterForm";
import AuthWrapper from "../components/AuthWrapper ";
import { Link } from "react-router-dom";
import AuthSidebar from "../components/AuthSidebar";

const RegisterPage = () => {
  return (
    <div className="flex min-h-svh w-full">
      <div className="relative flex w-full flex-col items-center justify-center px-6 py-12 md:w-1/2">
        <AuthWrapper
          title="Create your account"
          description="Join an existing organization with an invite, or start your own."
        >
          <RegisterForm />
        </AuthWrapper>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      <AuthSidebar />
    </div>
  );
};

export default RegisterPage;
