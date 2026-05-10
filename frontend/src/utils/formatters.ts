export const formatMoney = (amount: number): string => {
  return amount.toLocaleString('ru-RU') + ' ₽';
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};

export const formatPassport = (series: string, number: string): string => {
  return `${series} ${number}`;
};

export const formatVin = (vin: string): string => {
  return vin.toUpperCase();
};

export const formatPlate = (plate: string): string => {
  return plate.toUpperCase();
};