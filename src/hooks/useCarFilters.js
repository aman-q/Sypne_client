import { useState, useMemo } from 'react';
import useDebounce from './useDebounce';

const BATCH = 6;

const useCarFilters = (sourceList, initialSearch = '') => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filters, setFilters] = useState({
    company: '', driveType: '', minPrice: '', maxPrice: '', sortBy: '',
  });

  const debouncedSearch = useDebounce(searchTerm, 300);

  const companies  = useMemo(() => [...new Set(sourceList.map((c) => c.company).filter(Boolean))].sort(), [sourceList]);
  const driveTypes = useMemo(() => [...new Set(sourceList.map((c) => c.driveType).filter(Boolean))].sort(), [sourceList]);

  const filteredCars = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    let result = sourceList.filter((car) => {
      const matchSearch  = !q || car.title?.toLowerCase().includes(q) || car.company?.toLowerCase().includes(q) || car.description?.toLowerCase().includes(q);
      const matchCompany = !filters.company   || car.company   === filters.company;
      const matchDrive   = !filters.driveType || car.driveType === filters.driveType;
      const price        = Number(car.price);
      const matchMin     = !filters.minPrice  || price >= Number(filters.minPrice);
      const matchMax     = !filters.maxPrice  || price <= Number(filters.maxPrice);
      return matchSearch && matchCompany && matchDrive && matchMin && matchMax;
    });
    if (filters.sortBy === 'price_asc')  result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    if (filters.sortBy === 'price_desc') result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    if (filters.sortBy === 'year_desc')  result = [...result].sort((a, b) => Number(b.yearOfManufacture) - Number(a.yearOfManufacture));
    if (filters.sortBy === 'year_asc')   result = [...result].sort((a, b) => Number(a.yearOfManufacture) - Number(b.yearOfManufacture));
    return result;
  }, [sourceList, debouncedSearch, filters]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const clearFilters = () => setFilters({ company: '', driveType: '', minPrice: '', maxPrice: '', sortBy: '' });

  return {
    searchTerm, setSearchTerm,
    filters, setFilters,
    filteredCars,
    companies, driveTypes,
    activeFilterCount, clearFilters,
    BATCH,
  };
};

export default useCarFilters;
