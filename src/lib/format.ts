const nf = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 });

/** 85000 → "₦85,000" */
export const formatNaira = (amount: number): string => `₦${nf.format(Math.round(amount))}`;

export const toKobo = (naira: number): number => Math.round(naira * 100);
