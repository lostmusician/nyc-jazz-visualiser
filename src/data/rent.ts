export const RENT_DATA_YEARS = [1980, 1990, 2000, 2010, 2020] as const;
export type RentDataYear = (typeof RENT_DATA_YEARS)[number];

// BLS CPI-U annual averages (U.S. city average, all items).
// Used to compute constant 2020 dollar purchasing power.
export const CPI_U_ANNUAL: Record<RentDataYear, number> = {
  1980: 82.4,
  1990: 130.7,
  2000: 172.2,
  2010: 218.056,
  2020: 258.811,
};

// Official Census top-code thresholds where median contract rent falls into an open-ended upper bracket.
// Rather than treating sentinel codes (e.g. 2001 or 3501) as exact values, they represent lower bounds.
export const RENT_CAP_THRESHOLDS: Record<RentDataYear, number> = {
  1980: 500,  // STF1 median code 501 represents the upper interval; see README.
  1990: 1000, // STF3 Table H032B top bracket was $1,000+ (coded as 1001)
  2000: 2000, // SF3 Table H056A top bracket was $2,000+ (coded as 2001)
  2010: 2000, // ACS 5-year Table B25058 top bracket was $2,000+ (coded as 2001)
  2020: 3500, // ACS 5-year Table B25058 top bracket was $3,500+ (coded as 3501)
};

export const RENT_PERIOD_LABELS: Record<RentDataYear, string> = {
  1980: '1980 Census',
  1990: '1990 Census',
  2000: '2000 Census',
  2010: '2006–2010 estimate',
  2020: '2016–2020 estimate',
};

export const RENT_2020_DOLLAR_STOPS = [400, 700, 1000, 1300, 1600, 2000, 2600, 3400] as const;

export function isRentCapped(rent: number, year: RentDataYear): boolean {
  const threshold = RENT_CAP_THRESHOLDS[year];
  return rent === threshold + 1;
}

export function rentIn2020Dollars(nominalRent: number, year: RentDataYear): number {
  return Math.round(nominalRent * (CPI_U_ANNUAL[2020] / CPI_U_ANNUAL[year]));
}

export interface RentValuesResult {
  nominal: number;
  constant2020: number;
  year: RentDataYear;
  isCapped: boolean;
  capThreshold: number | null;
  displayNominal: string;
  displayConstant2020: string;
}

export function rentValues(
  nominalRent: number,
  year: RentDataYear,
  isCappedOverride?: boolean
): RentValuesResult {
  const isCapped = isCappedOverride ?? isRentCapped(nominalRent, year);
  const threshold = RENT_CAP_THRESHOLDS[year];
  const effectiveNominal = isCapped && threshold && nominalRent > threshold ? threshold : nominalRent;
  const constant = rentIn2020Dollars(effectiveNominal, year);
  const suffix = isCapped ? '+' : '';
  return {
    nominal: effectiveNominal,
    constant2020: constant,
    year,
    isCapped,
    capThreshold: isCapped ? threshold : null,
    displayNominal: `$${effectiveNominal.toLocaleString()}${suffix}`,
    displayConstant2020: `$${constant.toLocaleString()}${suffix}`,
  };
}
