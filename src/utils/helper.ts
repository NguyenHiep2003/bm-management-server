import { ThirdPartyService } from 'src/modules/auth/guards/key-auth.guard';
import { FeeName, ThirdPartyFeeName } from './enums/attribute/fee-name';
import { FeeUnit } from './enums/attribute/fee-unit';

export const getRatio = (date: number) => {
  if (date > 5 && date <= 12) return 0.75;
  else if (date > 12 && date <= 19) return 0.5;
  else if (date > 19 && date < 25) return 0.25;
  return 0;
};
export const validateCreateFeeInput = (name: FeeName, unit: FeeUnit) => {
  if (
    unit === FeeUnit.MONTH &&
    (name === FeeName.CAR || name === FeeName.MOTORBIKE)
  )
    return true;
  else if (
    unit === FeeUnit.AREA &&
    (name === FeeName.MANAGEMENT || name === FeeName.SERVICE)
  )
    return true;
  else return false;
};

export const validateCreateBillInput = (
  name: ThirdPartyFeeName,
  unit: FeeUnit,
) => {
  if (name === ThirdPartyFeeName.ELECTRICITY_FEE && unit === FeeUnit.INDEX)
    return true;
  if (name === ThirdPartyFeeName.WATER_FEE && unit === FeeUnit.BLOCK)
    return true;
  if (name === ThirdPartyFeeName.INTERNET_FEE && unit === FeeUnit.MONTH)
    return true;
  return false;
};
export const validateCreateBillTime = (month: number, year: number) => {
  const date = new Date();
  if (date.getFullYear() >= year && date.getMonth() + 1 > month) return false;
  return true;
};
export const getFeeName = (serviceName: ThirdPartyService) => {
  if (serviceName === ThirdPartyService.ELECTRICITY_SERVICE)
    return ThirdPartyFeeName.ELECTRICITY_FEE;
  else if (serviceName === ThirdPartyService.WATER_SERVICE)
    return ThirdPartyFeeName.WATER_FEE;
  else return ThirdPartyFeeName.INTERNET_FEE;
};
