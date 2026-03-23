export type Category = 'auto' | 'real_estate' | 'electronics';

export interface AutoParams {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: 'automatic' | 'manual';
  mileage?: number;
  enginePower?: number;
}

export interface RealEstateParams {
  type?: 'flat' | 'house' | 'room';
  address?: string;
  area?: number;
  floor?: number;
}

export interface ElectronicsParams {
  type?: 'phone' | 'laptop' | 'misc';
  brand?: string;
  model?: string;
  condition?: 'new' | 'used';
  color?: string;
}

export type ItemParams = AutoParams | RealEstateParams | ElectronicsParams;

export interface Item {
  id: number;
  category: Category;
  title: string;
  description?: string;
  price: number;
  createdAt: string;
  updatedAt?: string;
  params: ItemParams;
  needsRevision?: boolean;
}

export interface ItemsResponse {
  items: Array<{
    id: number;
    category: Category;
    title: string;
    price: number;
    needsRevision: boolean;
  }>;
  total: number;
}

export type SortColumn = 'title' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface ItemsFilters {
  q?: string;
  limit?: number;
  skip?: number;
  needsRevision?: boolean;
  categories?: Category[];
  sortColumn?: SortColumn;
  sortDirection?: SortDirection;
}

export const categoryLabels: Record<Category, string> = {
  auto: 'Транспорт',
  real_estate: 'Недвижимость',
  electronics: 'Электроника',
};