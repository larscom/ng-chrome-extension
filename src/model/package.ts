export interface Package {
  version: string;
  name: string;
  shortName: string;
  repository: PackageRepository;
}

export interface PackageRepository {
  type: string;
  url: string;
  zip_url: string;
}
