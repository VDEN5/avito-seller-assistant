import { Category, Item, AutoParams, RealEstateParams, ElectronicsParams } from '../types';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const categoryLabels: Record<Category, string> = {
  auto: 'Транспорт',
  real_estate: 'Недвижимость',
  electronics: 'Электроника',
};

// Определяем, все ли обязательные поля заполнены
export const getMissingFields = (item: Item): string[] => {
  const missing: string[] = [];

  if (!item.description || item.description.trim() === '') {
    missing.push('Описание');
  }

  const params = item.params;
  if (item.category === 'auto') {
    const auto = params as AutoParams;
    if (!auto.brand) missing.push('Марка');
    if (!auto.model) missing.push('Модель');
    if (!auto.yearOfManufacture) missing.push('Год выпуска');
    if (!auto.transmission) missing.push('Коробка передач');
    if (!auto.mileage) missing.push('Пробег');
    if (!auto.enginePower) missing.push('Мощность двигателя');
  } else if (item.category === 'real_estate') {
    const real = params as RealEstateParams;
    if (!real.type) missing.push('Тип недвижимости');
    if (!real.address) missing.push('Адрес');
    if (!real.area) missing.push('Площадь');
    if (!real.floor) missing.push('Этаж');
  } else if (item.category === 'electronics') {
    const elec = params as ElectronicsParams;
    if (!elec.type) missing.push('Тип');
    if (!elec.brand) missing.push('Бренд');
    if (!elec.model) missing.push('Модель');
    if (!elec.condition) missing.push('Состояние');
    if (!elec.color) missing.push('Цвет');
  }

  return missing;
};