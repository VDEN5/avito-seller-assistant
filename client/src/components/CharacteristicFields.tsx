import { TextField, MenuItem, Grid } from '@mui/material';
import { Category, ItemParams, AutoParams, RealEstateParams, ElectronicsParams } from '../types';

interface CharacteristicFieldsProps {
  category: Category;
  params: ItemParams;
  onChange: (params: ItemParams) => void;
}

export default function CharacteristicFields({ category, params, onChange }: CharacteristicFieldsProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...params, [field]: value });
  };

  if (category === 'auto') {
    const autoParams = params as AutoParams;
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Марка"
            value={autoParams.brand || ''}
            onChange={(e) => handleChange('brand', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Модель"
            value={autoParams.model || ''}
            onChange={(e) => handleChange('model', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Год выпуска"
            type="number"
            value={autoParams.yearOfManufacture || ''}
            onChange={(e) => handleChange('yearOfManufacture', e.target.value ? Number(e.target.value) : undefined)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Коробка передач"
            value={autoParams.transmission || ''}
            onChange={(e) => handleChange('transmission', e.target.value)}
          >
            <MenuItem value="automatic">Автомат</MenuItem>
            <MenuItem value="manual">Механика</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Пробег (км)"
            type="number"
            value={autoParams.mileage || ''}
            onChange={(e) => handleChange('mileage', e.target.value ? Number(e.target.value) : undefined)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Мощность (л.с.)"
            type="number"
            value={autoParams.enginePower || ''}
            onChange={(e) => handleChange('enginePower', e.target.value ? Number(e.target.value) : undefined)}
          />
        </Grid>
      </Grid>
    );
  }

  if (category === 'real_estate') {
    const realParams = params as RealEstateParams;
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Тип"
            value={realParams.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <MenuItem value="flat">Квартира</MenuItem>
            <MenuItem value="house">Дом</MenuItem>
            <MenuItem value="room">Комната</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Адрес"
            value={realParams.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Площадь (м²)"
            type="number"
            value={realParams.area || ''}
            onChange={(e) => handleChange('area', e.target.value ? Number(e.target.value) : undefined)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Этаж"
            type="number"
            value={realParams.floor || ''}
            onChange={(e) => handleChange('floor', e.target.value ? Number(e.target.value) : undefined)}
          />
        </Grid>
      </Grid>
    );
  }

  const elecParams = params as ElectronicsParams;
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          select
          label="Тип"
          value={elecParams.type || ''}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          <MenuItem value="phone">Телефон</MenuItem>
          <MenuItem value="laptop">Ноутбук</MenuItem>
          <MenuItem value="misc">Другое</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Бренд"
          value={elecParams.brand || ''}
          onChange={(e) => handleChange('brand', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Модель"
          value={elecParams.model || ''}
          onChange={(e) => handleChange('model', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          select
          label="Состояние"
          value={elecParams.condition || ''}
          onChange={(e) => handleChange('condition', e.target.value)}
        >
          <MenuItem value="new">Новый</MenuItem>
          <MenuItem value="used">Б/У</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Цвет"
          value={elecParams.color || ''}
          onChange={(e) => handleChange('color', e.target.value)}
        />
      </Grid>
    </Grid>
  );
}