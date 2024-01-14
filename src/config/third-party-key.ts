import { registerAs } from '@nestjs/config';

export default registerAs('thirdPartyKey', () => ({
  internetServiceKey: process.env.INTERNET_SERVICE_KEY,
  waterServiceKey: process.env.WATER_SERVICE_KEY,
  electricityServiceKey: process.env.ELECTRICITY_SERVICE_KEY,
}));
