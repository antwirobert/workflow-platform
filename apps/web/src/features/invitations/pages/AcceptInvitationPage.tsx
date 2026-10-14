import { useAuthStore } from "@/stores/authStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAcceptInvitation } from "../hooks/useAcceptInvitation";
import { useEffect } from "react";

const AcceptInvitationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const {
    mutate: acceptInvitation,
    isPending,
    isSuccess,
    isError,
    error,
  } = useAcceptInvitation();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      return;
    }

    if (!accessToken) {
      localStorage.setItem("pendingInviteToken", token);
      navigate("/login?redirect=invitation");
      return;
    }

    acceptInvitation(token, {
      onSuccess: () => {
        localStorage.removeItem("pendingInviteToken");
        setTimeout(() => navigate("/organizations"), 2000);
      },
    });
  }, [acceptInvitation, accessToken, navigate, searchParams]);

  if (isPending) return <p>Processing your invitation...</p>;
  if (isSuccess)
    return <p>✅ You have successfully joined the organization.</p>;
  if (isError) return <p>❌ {(error as Error).message}</p>;

  return <p>Processing your invitation...</p>;
};

export default AcceptInvitationPage;
