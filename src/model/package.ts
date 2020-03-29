export interface Package {
  version: string;
  name: string;
  shortName: string;
  repository: PackageRepository;
}

export interface PackageRepository {
  type: string;
  url: string;
  template_url: string;
}
