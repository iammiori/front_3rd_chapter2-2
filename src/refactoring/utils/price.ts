export const formatCurrency = (
  amount: number,
  currencySymbol?: string,
  locale?: string,
  options?: Intl.NumberFormatOptions
) => {
  const formattedCurrencySymbol = currencySymbol ?? '';
  const formattedLocale = locale ?? 'ko-KR';

  const formattedAmount = new Intl.NumberFormat(
    formattedLocale,
    options
  ).format(amount);
  return `${formattedAmount}${formattedCurrencySymbol}`;
};
