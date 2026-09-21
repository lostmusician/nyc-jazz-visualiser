import type { VenueSimulationInput, VenueSimulationPreset, VenueSimulationResult } from '../types';

const WEEKS_PER_MONTH = 4.33;

export function calculateVenueModel(preset: VenueSimulationPreset, input: VenueSimulationInput): VenueSimulationResult {
  const performances = input.performancesPerWeek * WEEKS_PER_MONTH;
  const audiencePerNight = preset.capacity * input.attendanceRate;
  const monthlyRevenue = audiencePerNight * input.ticketPrice * performances;
  const artistPay = monthlyRevenue * input.artistShare;
  const operatingCosts = preset.monthlyRent + preset.fixedOperatingCost + performances * 240;
  const monthlyBalance = monthlyRevenue - artistPay - operatingCosts;
  const experimentalNights = Math.max(0, Math.floor(Math.max(monthlyBalance, 0) / 650));

  return {
    monthlyRevenue,
    artistPay,
    operatingCosts,
    monthlyBalance,
    audienceCost: input.ticketPrice,
    experimentalNights,
  };
}
