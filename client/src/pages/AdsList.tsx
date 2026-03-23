import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Checkbox,
  Button,
  Typography,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Paper,
  Collapse,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { ViewModule, ViewList, ExpandMore, ExpandLess } from '@mui/icons-material';
import { getItems } from '../api/items';
import { useFilterStore } from '../store/filterStore';
import { useDebounce } from '../hooks/useDebounce';
import { categoryLabels, Category, SortColumn, SortDirection } from '../types';
import AdCard from '../components/AdCard';
import AdListItem from '../components/AdListItem';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorAlert from '../components/ErrorAlert';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

export default function AdsList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    search,
    categories,
    needsRevisionOnly,
    sortColumn,
    sortDirection,
    categoriesExpanded,
    setSearch,
    toggleCategory,
    setNeedsRevisionOnly,
    setSort,
    resetFilters,
    toggleCategoriesExpanded,
  } = useFilterStore();

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['items', debouncedSearch, categories, needsRevisionOnly, sortColumn, sortDirection, page],
    queryFn: () =>
      getItems({
        q: debouncedSearch || undefined,
        categories: categories.length > 0 ? categories : undefined,
        needsRevision: needsRevisionOnly || undefined,
        sortColumn,
        sortDirection,
        limit: ITEMS_PER_PAGE,
        skip: (page - 1) * ITEMS_PER_PAGE,
      }),
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categories, needsRevisionOnly, sortColumn, sortDirection]);

  const handleSortChange = (value: string) => {
    const [column, direction] = value.split('-') as [SortColumn, SortDirection];
    setSort(column, direction);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return <ErrorAlert message="Не удалось загрузить объявления" onRetry={() => refetch()} />;
  }

  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Мои объявления
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {data?.total ?? 0} объявлений
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 4, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '20px' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            placeholder="Найти объявление..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flexGrow: 1, borderRadius: '20px' }}
            InputProps={{
              sx: { backgroundColor: '#ffffff' },
            }}
          />
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
            aria-label="view mode"
          >
            <ToggleButton value="grid" aria-label="grid view">
              <ViewModule />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Сортировка</InputLabel>
            <Select
              value={`${sortColumn}-${sortDirection}`}
              label="Сортировка"
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <MenuItem value="createdAt-desc">По новизне (сначала новые)</MenuItem>
              <MenuItem value="createdAt-asc">По новизне (сначала старые)</MenuItem>
              <MenuItem value="title-asc">По названию (А–Я)</MenuItem>
              <MenuItem value="title-desc">По названию (Я–А)</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start'}}>
        {/* Левая часть */}
        <Box sx={{ width: 280, flexShrink: 0 }}>
          {/* Панель фильтров */}
          <Paper sx={{ p: 2, mb: 2, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '10px'  }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Фильтры
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={toggleCategoriesExpanded}
              >
                <Typography variant="subtitle1">Категории</Typography>
                <IconButton size="small">
                  {categoriesExpanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              <Collapse in={categoriesExpanded}>
                <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <FormControlLabel
                      key={value}
                      control={
                        <Checkbox
                          checked={categories.includes(value as Category)}
                          onChange={() => toggleCategory(value as Category)}
                        />
                      }
                      label={label}
                    />
                  ))}
                </Box>
              </Collapse>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={needsRevisionOnly}
                  onChange={(e) => setNeedsRevisionOnly(e.target.checked)}
                />
              }
              label="Только требующие доработок"
              labelPlacement="start"
              sx={{display: 'flex',justifyContent: 'space-between',width: '100%',marginRight: 0,mb: 2}}
            />
          </Paper>

          <Button fullWidth variant="outlined" onClick={resetFilters} sx={{backgroundColor: 'white', borderRadius: '10px'}}>
            Сбросить фильтры
          </Button>
        </Box>

        <Box sx={{ flex: 1 }}>
          {isLoading ? (
            <LoadingSkeleton />
          ) : data?.items.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#ffffff', border: '1px solid #e0e0e0' }}>
              <Typography variant="body1" color="text.secondary">
                Объявления не найдены
              </Typography>
            </Paper>
          ) : viewMode === 'grid' ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(5, 1fr)',
                },
                gap: 2,
              }}
            >
              {data?.items.map((item) => (
                <AdCard key={item.id} item={item} onClick={() => navigate(`/ads/${item.id}`)} />
              ))}
            </Box>
          ) : (
            <Paper sx={{ bgcolor: '#ffffff', border: '1px solid #e0e0e0' }}>
              {data?.items.map((item) => (
                <AdListItem key={item.id} item={item} onClick={() => navigate(`/ads/${item.id}`)} />
              ))}
            </Paper>
          )}

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
                <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                shape="rounded"
                variant="outlined"
                color="primary"
                size="large"
                showFirstButton={false}showLastButton={false}
                sx={{
                    '& .MuiPaginationItem-root': {backgroundColor: '#ffffff',
                        borderColor: '#e0e0e0',
                        borderRadius: '8px',
                    },
                    '& .Mui-selected': {
                        backgroundColor: '#ffffff !important',
                        borderColor: '#1976d2',
                        color: '#1976d2',
                    },
                }}
                />
                </Box>
                )}
        </Box>
      </Box>
    </Box>
  );
}