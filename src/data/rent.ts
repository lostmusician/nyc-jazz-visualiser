export const RENT_DATA_YEARS = [1980, 1990, 2000, 2010, 2020] as const;
export type RentDataYear = (typeof RENT_DATA_YEARS)[number];

// BLS CPI-U annual averages. Values are kept beside the conversion so the
// derived map measure is reproducible without altering the NHGIS source data.
export const CPI_U_ANNUAL: Record<RentDataYear, number> = {
  1980: 82.4,
  1990: 130.7,
  2000: 172.2,
  2010: 218.056,
  2020: 258.811,
};

export const RENT_2020_DOLLAR_STOPS = [400, 700, 1000, 1300, 1600, 2000, 2600, 3400] as const;

export function rentIn2020Dollars(nominalRent: number, year: RentDataYear): number {
  return Math.round(nominalRent * (CPI_U_ANNUAL[2020] / CPI_U_ANNUAL[year]));
}

export function rentValues(nominalRent: number, year: RentDataYear) {
  return { nominal: nominalRent, constant2020: rentIn2020Dollars(nominalRent, year), year };
}
