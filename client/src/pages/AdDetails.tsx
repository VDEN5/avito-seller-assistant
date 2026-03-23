import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { getItem } from '../api/items';
import { formatPrice, formatDate, getMissingFields } from '../utils/helpers';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorAlert from '../components/ErrorAlert';

export default function AdDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: item, isLoading, error, refetch } = useQuery({
    queryKey: ['item', id],
    queryFn: () => getItem(Number(id!)),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorAlert message="Не удалось загрузить объявление" onRetry={() => refetch()} />;
  if (!item) return <ErrorAlert message="Объявление не найдено" />;

  const missingFields = getMissingFields(item);

  const renderParams = () => {
    if (item.category === 'auto') {
      const p = item.params as any;
      return (
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
              Марка:
            </Typography>
            <Typography variant="body2">{p.brand || '—'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
              Модель:
            </Typography>
            <Typography variant="body2">{p.model || '—'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
              Год выпуска:
            </Typography>
            <Typography variant="body2">{p.yearOfManufacture || '—'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
              Коробка передач:
            </Typography>
            <Typography variant="body2">
              {p.transmission === 'automatic'
                ? 'Автомат'
                : p.transmission === 'manual'
                ? 'Механика'
                : '—'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
              Пробег:
            </Typography>
            <Typography variant="body2">{p.mileage ? `${p.mileage} км` : '—'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
              Мощность:
            </Typography>
            <Typography variant="body2">{p.enginePower ? `${p.enginePower} л.с.` : '—'}</Typography>
          </Box>
        </Box>
      );
    }
    if (item.category === 'real_estate') {
      const p = item.params as any;
      return (
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
              Тип:
            </Typography>
            <Typography variant="body2">
              {p.type === 'flat'
                ? 'Квартира'
                : p.type === 'house'
                ? 'Дом'
                : p.type === 'room'
                ? 'Комната'
                : '—'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
              Адрес:
            </Typography>
            <Typography variant="body2">{p.address || '—'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
              Площадь:
            </Typography>
            <Typography variant="body2">{p.area ? `${p.area} м²` : '—'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
              Этаж:
            </Typography>
            <Typography variant="body2">{p.floor || '—'}</Typography>
          </Box>
        </Box>
      );
    }
    const p = item.params as any;
    return (
      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
            Тип:
          </Typography>
          <Typography variant="body2">
            {p.type === 'phone'
              ? 'Телефон'
              : p.type === 'laptop'
              ? 'Ноутбук'
              : p.type === 'misc'
              ? 'Другое'
              : '—'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
            Бренд:
          </Typography>
          <Typography variant="body2">{p.brand || '—'}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
            Модель:
          </Typography>
          <Typography variant="body2">{p.model || '—'}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
            Состояние:
          </Typography>
          <Typography variant="body2">
            {p.condition === 'new' ? 'Новый' : p.condition === 'used' ? 'Б/У' : '—'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
            Цвет:
          </Typography>
          <Typography variant="body2">{p.color || '—'}</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {item.title}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/ads/${id}/edit`)}
            sx={{ mt: 1, borderRadius: '7px' }}
          >
            Редактировать
          </Button>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h4" fontWeight="bold">
            {formatPrice(item.price)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Опубликовано: {formatDate(item.createdAt)}
          </Typography>
          {item.updatedAt && (
            <Typography variant="body2" color="text.secondary">
              Отредактировано: {formatDate(item.updatedAt)}
            </Typography>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: '#ffffff', border: '1px solid #e0e0e0' }}>
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/048/910/778/small_2x/default-image-missing-placeholder-free-vector.jpg"
              alt={item.title}
              style={{ width: '100%', height: 'auto', borderRadius: 8 }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8} sx={{ pr: 2 }}>
          {missingFields.length > 0 && (
            <Alert
              severity="warning"
              sx={{
                backgroundColor: '#ffeb3b',
                color: '#000000',
                mb: 2,
                width: '60%',
                borderRadius: '20px',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Требуются доработки
              </Typography>
              <p>У объявления не заполнены поля:</p>
              <Box component="ul" sx={{ margin: 0, paddingLeft: 2, mt: 0.5 }}>
                {missingFields.map((field, idx) => (
                  <li key={idx}>
                    <Typography variant="body2">{field}</Typography>
                  </li>
                ))}
              </Box>
            </Alert>
          )}

          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Характеристики
          </Typography>
          {renderParams()}
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Описание
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {item.description || 'Описание отсутствует'}
        </Typography>
      </Box>
    </Box>
  );
}