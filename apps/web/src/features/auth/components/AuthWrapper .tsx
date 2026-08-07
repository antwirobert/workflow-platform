interface AuthWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const AuthWrapper = ({ title, description, children }: AuthWrapperProps) => {
  return (
    <div className="w-full max-w-sm space-y-6">
      <p className="hidden max-md:block text-[10px] font-medium uppercase tracking-[0.18em]">
        One Account · Every Organization
      </p>
      <div className="space-y-1.5">
        <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight">
          {title}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default AuthWrapper;
