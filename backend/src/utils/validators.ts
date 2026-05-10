export const validatePassport = (series: string, number: string): boolean => {
  return /^\d{4}$/.test(series) && /^\d{6}$/.test(number);
};

export const validateVin = (vin: string): boolean => {
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
};

export const validatePlate = (plate: string): boolean => {
  return /^[А-Я]{1}\d{3}[А-Я]{2}\d{2,3}$/i.test(plate) || /^[A-Z]{1}\d{3}[A-Z]{2}\d{2,3}$/i.test(plate);
};