import { nonnegative } from './tax-rules.js?v=99b8aaacdca1';

export function employeeHealthAnnual(gross, additionalRate, ceiling = 69750) {
  return Math.min(nonnegative(gross, 'annual gross'), nonnegative(ceiling, 'contribution ceiling')) * (.146 + nonnegative(additionalRate, 'additional contribution rate', 10) / 100) / 2;
}
export function taxClassSocial2026(gross, state, healthRate, careCode) {
  nonnegative(gross, 'annual gross');
  const careRates = { none: .024, one: .018, two: .0155, three: .013, four: .0105, five: .008, under23: .018 };
  if (!Object.hasOwn(careRates, careCode)) throw Error('Choose a valid care-insurance case.');
  const pension = Math.min(gross, 101400) * .093;
  const unemployment = Math.min(gross, 101400) * .013;
  const health = employeeHealthAnnual(gross, healthRate);
  const care = Math.min(gross, 69750) * (careRates[careCode] + (state === 'Saxony (Sachsen)' ? .005 : 0));
  return { pension, unemployment, health, care, total: pension + unemployment + health + care };
}
export function investmentProjection(initial, monthly, years, annualPercent) {
  nonnegative(initial, 'initial investment'); nonnegative(monthly, 'monthly contribution');
  nonnegative(years, 'duration', 60);
  if (!Number.isInteger(years)) throw Error('Use a whole number of years.');
  if (!Number.isFinite(annualPercent) || annualPercent < -20 || annualPercent > 30) throw Error('Use an annual return between -20% and 30%.');
  const rate = annualPercent / 1200;
  let value = initial;
  for (let month = 0; month < years * 12; month++) value = value * (1 + rate) + monthly;
  return { value, invested: initial + monthly * years * 12 };
}
export function doubleHouseholdCandidate(monthly, months, trips, distance) {
  nonnegative(monthly, 'monthly accommodation', 50000); nonnegative(months, 'months', 12);
  nonnegative(trips, 'actual trips', 53); nonnegative(distance, 'full one-way land kilometres', 2000);
  if (![months, trips, distance].every(Number.isInteger)) throw Error('Use whole months, trips and land kilometres.');
  const housing = Math.min(monthly, 1000) * months;
  const homeTrips = trips * distance * .38;
  return { housing, homeTrips, combined: housing + homeTrips };
}
