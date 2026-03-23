import { create } from 'zustand'
import { Category, SortColumn, SortDirection } from '../types'

interface FilterState {
  search: string
  categories: Category[]
  needsRevisionOnly: boolean
  sortColumn: SortColumn
  sortDirection: SortDirection
  categoriesExpanded: boolean 
  setSearch: (search: string) => void
  toggleCategory: (category: Category) => void
  setNeedsRevisionOnly: (value: boolean) => void
  setSort: (column: SortColumn, direction: SortDirection) => void
  resetFilters: () => void
  toggleCategoriesExpanded: () => void  
}

export const useFilterStore = create<FilterState>((set) => ({
  search: '',
  categories: [],
  needsRevisionOnly: false,
  sortColumn: 'createdAt',
  sortDirection: 'desc',
  categoriesExpanded: true, 

  setSearch: (search) => set({ search }),
  toggleCategory: (category) =>
    set((state) => ({
      categories: state.categories.includes(category)
        ? state.categories.filter((c) => c !== category)
        : [...state.categories, category],
    })),
  setNeedsRevisionOnly: (value) => set({ needsRevisionOnly: value }),
  setSort: (sortColumn, sortDirection) => set({ sortColumn, sortDirection }),
  resetFilters: () =>
    set({
      search: '',
      categories: [],
      needsRevisionOnly: false,
      sortColumn: 'createdAt',
      sortDirection: 'desc',
    }),
  toggleCategoriesExpanded: () =>
    set((state) => ({ categoriesExpanded: !state.categoriesExpanded })),
}))