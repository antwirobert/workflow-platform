import { Link } from "react-router-dom";
import AuthWrapper from "../components/AuthWrapper ";
import LoginForm from "../components/LoginForm";
import AuthSidebar from "../components/AuthSidebar";

const LoginPage = () => {
  return (
    <div className="flex min-h-svh w-full">
      <div className="relative flex w-full flex-col items-center justify-center px-6 py-12 md:w-1/2">
        <AuthWrapper
          title="Welcome back"
          description="Sign in to reach every organization you belong to."
        >
          <LoginForm />
        </AuthWrapper>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>

      <AuthSidebar />
    </div>
  );
};

export default LoginPage;
