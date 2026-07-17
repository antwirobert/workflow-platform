import { CreateOrganizationPayload } from "./organizations.schemas";

export interface createOrganizationInput extends CreateOrganizationPayload {
  userId: string;
}

export interface OrganizationResult {
  id: string;
  name: string;
  slug: string;
  role: string;
  createdAt: Date;
}
