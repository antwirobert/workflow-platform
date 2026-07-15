import { CreateOrganizationBody } from "./organizations.schemas";

export interface createOrganizationInput extends CreateOrganizationBody {
  userId: string;
}

export interface OrganizationResult {
  id: string;
  name: string;
  slug: string;
  role: string;
  createdAt: Date;
}
