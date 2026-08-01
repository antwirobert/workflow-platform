import { useOrganizations } from "../hooks/useOrganizations";
import { Building2 } from "lucide-react";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import OrganizationCard from "../components/OrganizationCard";
import { Skeleton } from "@/components/ui/skeleton";
import CreateOrganizationDialog from "../components/CreateOrganizationDialog";

const OrganizationsPage = () => {
  const {
    data: organizations,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useOrganizations();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Organizations
            </h1>
            <p className="text-sm text-muted-foreground">
              Every org you belong to. Switch context or spin up a new one.
            </p>
          </div>
          <CreateOrganizationDialog />
        </div>

        {organizations && organizations.length === 0 && (
          <EmptyState
            title="No organizations yet"
            description="Create your first organization to invite teammates and start collaborating."
            btnCaption="New organization"
            icon={Building2}
          />
        )}

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card p-4"
              >
                <div className="flex items-center gap-3.5">
                  <Skeleton className="size-11 shrink-0 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <ErrorState
            title="Couldn't load organizations"
            description="We hit a snag reaching the organizations service. Try again in a moment."
            onRetry={refetch}
            isRetrying={isFetching}
          />
        )}

        {organizations && organizations.length > 0 && (
          <div className="space-y-3">
            {organizations.map((org) => (
              <OrganizationCard key={org.id} {...org} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrganizationsPage;
