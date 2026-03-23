import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Alert,
  Snackbar,
  Divider,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  Container,
} from '@mui/material';
import { Save, Cancel, AutoAwesome, TrendingUp, Close, Refresh } from '@mui/icons-material';
import { getItem, updateItem } from '../api/items';
import { Category, ItemParams, categoryLabels } from '../types';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorAlert from '../components/ErrorAlert';
import { generateDescription, generatePriceRecommendations } from '../api/ai';
const STORAGE_KEY = 'ad_draft_';

// Компонент вертикальных полей характеристик (без изменений)
function CharacteristicFieldsVertical({
  category,
  params,
  onChange,
}: {
  category: Category;
  params: ItemParams;
  onChange: (params: ItemParams) => void;
}) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...params, [field]: value });
  };

  if (category === 'auto') {
    const p = params as any;
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="body2" gutterBottom>Тип</Typography>
          <TextField fullWidth placeholder="Например, седан" value={p.type || ''} onChange={(e) => handleChange('type', e.target.value)} />
        </Box>
        <Box>
          <Typography variant="body2" gutterBottom>Бренд</Typography>
          <TextField fullWidth placeholder="Например, Toyota" value={p.brand || ''} onChange={(e) => handleChange('brand', e.target.value)} />
        </Box>
        <Box>
          <Typography variant="body2" gutterBottom>Модель</Typography>
          <TextField fullWidth placeholder="Например, Camry" value={p.model || ''} onChange={(e) => handleChange('model', e.target.value)} />
        </Box>
        <Box>
          <Typography variant="body2" gutterBottom>Год выпуска</Typography>
          <TextField fullWidth type="number" placeholder="Например, 2020" value={p.yearOfManufacture || ''} onChange={(e) => handleChange('yearOfManufacture', e.target.value ? Number(e.target.value) : undefined)} />
        </Box>
        <Box>
          <Typography variant="body2" gutterBottom>Коробка передач</Typography>
          <Select fullWidth value={p.transmission || ''} onChange={(e) => handleChange('transmission', e.target.value)} displayEmpty>
            <MenuItem value="">Не выбрано</MenuItem>
            <MenuItem value="automatic">Автомат</MenuItem>
            <MenuItem value="manual">Механика</MenuItem>
          </Select>
        </Box>
        <Box>
          <Typography variant="body2" gutterBottom>Пробег (км)</Typography>
          <TextField fullWidth type="number" placeholder="Например, 50000" value={p.mileage || ''} onChange={(e) => handleChange('mileage', e.target.value ? Number(e.target.value) : undefined)} />
        </Box>
        <Box>
          <Typography variant="body2" gutterBottom>Мощность (л.с.)</Typography>
          <TextField fullWidth type="number" placeholder="Например, 150" value={p.enginePower || ''} onChange={(e) => handleChange('enginePower', e.target.value ? Number(e.target.value) : undefined)} />
        </Box>
        <Box>
          <Typography variant="body2" gutterBottom>Цвет</Typography>
          <TextField fullWidth placeholder="Например, черный" value={p.color || ''} onChange={(e) => handleChange('color', e.target.value)} />
        </Box>
      </Box>
    );
  }

  if (category === 'real_estate') {
    const p = params as any;
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="body2" gutterBottom>Тип</Typography>
          <Select fullWidth value={p.type || ''} onChange={(e) => handleChange('type', e.target.value)} displayEmpty>
            <MenuItem value="">Не выбрано</MenuItem>
            <MenuItem value="flat">Квартира</MenuItem>
            <MenuItem value="house">Дом</MenuItem>
            <MenuItem value="room">Комната</MenuItem>
          </Select>
        </Box>
        <Box>
          <Typography variant="body2" gutterBottom>Адрес</Typography>
          <TextField fullWidth placeholder="Например, г. Москва, ул. Ленина, д. 1" value={p.address || ''} onChange={(e) => handleChange('address', e.target.value)} />
        </Box>
        <Box>
          <Typography variant="body2" gutterBottom>Площадь (м²)</Typography>
          <TextField fullWidth type="number" placeholder="Например, 45" value={p.area || ''} onChange={(e) => handleChange('area', e.target.value ? Number(e.target.value) : undefined)} />
        </Box>
        <Box>
          <Typography variant="body2" gutterBottom>Этаж</Typography>
          <TextField fullWidth type="number" placeholder="Например, 5" value={p.floor || ''} onChange={(e) => handleChange('floor', e.target.value ? Number(e.target.value) : undefined)} />
        </Box>
      </Box>
    );
  }

  const p = params as any;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography variant="body2" gutterBottom>Тип</Typography>
        <Select fullWidth value={p.type || ''} onChange={(e) => handleChange('type', e.target.value)} displayEmpty>
          <MenuItem value="">Не выбрано</MenuItem>
          <MenuItem value="phone">Телефон</MenuItem>
          <MenuItem value="laptop">Ноутбук</MenuItem>
          <MenuItem value="misc">Другое</MenuItem>
        </Select>
      </Box>
      <Box>
        <Typography variant="body2" gutterBottom>Бренд</Typography>
        <TextField fullWidth placeholder="Например, Apple" value={p.brand || ''} onChange={(e) => handleChange('brand', e.target.value)} />
      </Box>
      <Box>
        <Typography variant="body2" gutterBottom>Модель</Typography>
        <TextField fullWidth placeholder="Например, iPhone 13" value={p.model || ''} onChange={(e) => handleChange('model', e.target.value)} />
      </Box>
      <Box>
        <Typography variant="body2" gutterBottom>Состояние</Typography>
        <Select fullWidth value={p.condition || ''} onChange={(e) => handleChange('condition', e.target.value)} displayEmpty>
          <MenuItem value="">Не выбрано</MenuItem>
          <MenuItem value="new">Новый</MenuItem>
          <MenuItem value="used">Б/У</MenuItem>
        </Select>
      </Box>
      <Box>
        <Typography variant="body2" gutterBottom>Цвет</Typography>
        <TextField fullWidth placeholder="Например, черный" value={p.color || ''} onChange={(e) => handleChange('color', e.target.value)} />
      </Box>
    </Box>
  );
}

export default function AdEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const titleRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState<Category>('electronics');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [params, setParams] = useState<ItemParams>({});
  const [showDraftRestored, setShowDraftRestored] = useState(false);
  const [loadingAI, setLoadingAI] = useState<{ description?: boolean; price?: boolean }>({});
  const [priceRecommendationsOpen, setPriceRecommendationsOpen] = useState(false);
  const [aiPriceRecommendations, setAiPriceRecommendations] = useState<{
    advice: string;
    details: string[];
  } | null>(null);

  const [titleError, setTitleError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['item', id],
    queryFn: () => getItem(Number(id!)),
    enabled: !!id,
  });

  useEffect(() => {
    if (item) {
      const draft = localStorage.getItem(`${STORAGE_KEY}${id}`);
      if (draft) {
        const parsed = JSON.parse(draft);
        setCategory(parsed.category);
        setTitle(parsed.title);
        setPrice(parsed.price.toString());
        setDescription(parsed.description || '');
        setParams(parsed.params);
        setShowDraftRestored(true);
      } else {
        setCategory(item.category);
        setTitle(item.title);
        setPrice(item.price.toString());
        setDescription(item.description || '');
        setParams(item.params);
      }
    }
  }, [item, id]);

  useEffect(() => {
    if (title || price || description || Object.keys(params).length > 0) {
      const draft = { category, title, price: parseFloat(price) || 0, description, params };
      localStorage.setItem(`${STORAGE_KEY}${id}`, JSON.stringify(draft));
    }
  }, [category, title, price, description, params, id]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateItem(Number(id!), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item', id] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      localStorage.removeItem(`${STORAGE_KEY}${id}`);
      navigate(`/ads/${id}`);
    },
  });

  const handleSave = () => {
    let isValid = true;
    let firstInvalidField: 'title' | 'price' | null = null;

    if (!title.trim()) {
      setTitleError(true);
      isValid = false;
      firstInvalidField = 'title';
    } else {
      setTitleError(false);
    }

    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      setPriceError(true);
      isValid = false;
      if (firstInvalidField === null) firstInvalidField = 'price';
    } else {
      setPriceError(false);
    }

    if (!isValid) {
      if (firstInvalidField === 'title' && titleRef.current) {
        titleRef.current.focus();
      } else if (firstInvalidField === 'price' && priceRef.current) {
        priceRef.current.focus();
      }
      return;
    }

    updateMutation.mutate({
      category,
      title: title.trim(),
      price: parseFloat(price),
      description: description.trim() || undefined,
      params,
    });
  };

  const handleCancel = () => {
    localStorage.removeItem(`${STORAGE_KEY}${id}`);
    navigate(`/ads/${id}`);
  };

  const fetchPriceRecommendations = async () => {
    setLoadingAI({ ...loadingAI, price: true });
    try {
      const recommendations = await generatePriceRecommendations(
        title,
        categoryLabels[category],
        params,
        parseFloat(price) || 0
      );
      setAiPriceRecommendations({
        advice: `Средняя цена на ${title || 'товар'}:`,
        details: recommendations.details,
      });
      setPriceRecommendationsOpen(true);
    } catch (err: any) {
      alert(err.message || 'Ошибка получения рекомендаций');
    } finally {
      setLoadingAI({ ...loadingAI, price: false });
    }
  };

  const applyPriceRecommendation = () => {
    if (aiPriceRecommendations?.details[1]) {
      const match = aiPriceRecommendations.details[1].match(/(\d[\d\s]*)\s*₽/);
      if (match) {
        const recommendedPrice = parseInt(match[1].replace(/\s/g, ''), 10);
        if (!isNaN(recommendedPrice)) setPrice(recommendedPrice.toString());
      }
    }
  };

  const closePriceRecommendations = () => setPriceRecommendationsOpen(false);
  const repeatPriceRequest = () => fetchPriceRecommendations();

  const handleImproveDescription = async () => {
    setLoadingAI({ ...loadingAI, description: true });
    try {
      const improved = await generateDescription(
        title,
        categoryLabels[category],
        params,
        description
      );
      setDescription(improved);
    } catch (err: any) {
      alert(err.message || 'Ошибка генерации описания');
    } finally {
      setLoadingAI({ ...loadingAI, description: false });
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorAlert message="Не удалось загрузить объявление" />;

  return (
    <Container maxWidth="lg" sx={{ bgcolor: '#ffffff', py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Редактирование объявления
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Категория
            </Typography>
            <FormControl fullWidth>
              <Select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Название
            </Typography>
            <TextField
              inputRef={titleRef}
              fullWidth
              placeholder="Введите название"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError(false);
              }}
              error={titleError}
              helperText={titleError ? 'Обязательное поле' : ''}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Цена
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                inputRef={priceRef}
                fullWidth
                type="number"
                placeholder="Введите цену"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (priceError) setPriceError(false);
                }}
                error={priceError}
                helperText={priceError ? 'Введите корректную цену (больше 0)' : ''}
                InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₽</Typography> }}
              />
              <Button
                variant="outlined"
                startIcon={loadingAI.price ? <CircularProgress size={20} /> : <TrendingUp />}
                onClick={fetchPriceRecommendations}
                disabled={loadingAI.price}
                sx={{
                  backgroundColor: '#ffeb3b',
                  color: '#000000',
                  borderColor: '#ffeb3b',
                  whiteSpace: 'nowrap',
                  minWidth: 'max-content',
                  '&:hover': { backgroundColor: '#ffdd33' },
                }}
              >
                {loadingAI.price ? 'Анализ...' : 'Рекомендации от ИИ'}
              </Button>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Характеристики
            </Typography>
            <CharacteristicFieldsVertical category={category} params={params} onChange={setParams} />
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          {priceRecommendationsOpen && aiPriceRecommendations && (
            <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 'none' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Ответ AI:
                  </Typography>
                  <IconButton size="small" onClick={closePriceRecommendations}>
                    <Close />
                  </IconButton>
                </Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {aiPriceRecommendations.advice}
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                  {aiPriceRecommendations.details.map((item, idx) => (
                    <li key={idx}>
                      <Typography variant="body2">{item}</Typography>
                    </li>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button variant="contained" size="small" onClick={applyPriceRecommendation}>
                    Применить
                  </Button>
                  <Button variant="outlined" size="small" onClick={closePriceRecommendations}>
                    Закрыть
                  </Button>
                </Box>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<Refresh />}
                  onClick={repeatPriceRequest}
                  disabled={loadingAI.price}
                >
                  Повторить запрос
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Описание
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Опишите ваш товар подробнее..."
          helperText={`${description.length} символов`}
          sx={{ mb: 2 }}
        />
        <Button
          variant="outlined"
          startIcon={loadingAI.description ? <CircularProgress size={20} /> : <AutoAwesome />}
          onClick={handleImproveDescription}
          disabled={loadingAI.description}
          sx={{
            backgroundColor: '#ffeb3b',
            color: '#000000',
            borderColor: '#ffeb3b',
            '&:hover': { backgroundColor: '#ffdd33' },
          }}
        >
          {loadingAI.description ? 'Генерация...' : 'Придумать описание'}
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
        </Button>
        <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel}>
          Отменить
        </Button>
      </Box>

      <Snackbar
        open={showDraftRestored}
        autoHideDuration={4000}
        onClose={() => setShowDraftRestored(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setShowDraftRestored(false)}>
          Восстановлен черновик из localStorage
        </Alert>
      </Snackbar>
    </Container>
  );
}