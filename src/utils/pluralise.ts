export const pluraliseTerm = (count: number, singleTerm: string, pluralTerm?: string) =>
  count === 1 ? singleTerm : pluralTerm ?? `${singleTerm}s`;

export const pluralise = (count: number, term: string, pluralTerm?: string) =>
  `${count} ${pluraliseTerm(count, term, pluralTerm)}`;
