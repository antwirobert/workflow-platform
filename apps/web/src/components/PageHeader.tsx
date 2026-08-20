interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const PageHeader = ({
  title,
  description,
  action,
  children,
}: PageHeaderProps) => {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {action && <div>{action}</div>}
        </div>
        {children}
      </div>
    </section>
  );
};

export default PageHeader;
