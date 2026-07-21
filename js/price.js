(() => {
  const BASE = "AUD";

  const REGION_CURRENCY = {
    AU: "AUD",
    NZ: "NZD",
    US: "USD",
    GB: "GBP",
    CA: "CAD",
    JP: "JPY",
    KR: "KRW",
    CN: "CNY",
    HK: "HKD",
    SG: "SGD",
    IN: "INR",
    CH: "CHF",
    SE: "SEK",
    NO: "NOK",
    DK: "DKK",
    PL: "PLN",
    CZ: "CZK",
    HU: "HUF",
    RO: "RON",
    TR: "TRY",
    MX: "MXN",
    BR: "BRL",
    AR: "ARS",
    CL: "CLP",
    ZA: "ZAR",
    AE: "AED",
    SA: "SAR",
    IL: "ILS",
    TH: "THB",
    MY: "MYR",
    ID: "IDR",
    PH: "PHP",
    VN: "VND",
    TW: "TWD",
    AT: "EUR",
    BE: "EUR",
    CY: "EUR",
    DE: "EUR",
    EE: "EUR",
    ES: "EUR",
    FI: "EUR",
    FR: "EUR",
    GR: "EUR",
    HR: "EUR",
    IE: "EUR",
    IT: "EUR",
    LT: "EUR",
    LU: "EUR",
    LV: "EUR",
    MT: "EUR",
    NL: "EUR",
    PT: "EUR",
    SI: "EUR",
    SK: "EUR",
  };

  const getLocale = () =>
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    "en-AU";

  const getRegion = (locale) => {
    try {
      const region = new Intl.Locale(locale).maximize().region;
      if (region) return region;
    } catch (_) {}
    const parts = String(locale).split(/[-_]/);
    return (parts[1] || parts[0] || "AU").toUpperCase();
  };

  const getCurrency = (region) => REGION_CURRENCY[region] || "USD";

  const formatMoney = (amount, currency, locale) => {
    const zeroDecimal = ["JPY", "KRW", "VND", "CLP", "IDR"].includes(currency);
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: zeroDecimal ? 0 : 2,
      minimumFractionDigits: zeroDecimal ? 0 : 2,
    }).format(amount);
  };

  const fetchRate = async (currency) => {
    if (currency === BASE) return 1;
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=${BASE}&to=${currency}`
    );
    if (!res.ok) throw new Error("rate fetch failed");
    const data = await res.json();
    return data.rates[currency];
  };

  const paint = (nodes, text) => {
    nodes.forEach((el) => {
      el.textContent = text;
    });
  };

  const run = async () => {
    const nodes = document.querySelectorAll("[data-price-aud]");
    if (!nodes.length) return;

    const locale = getLocale();
    const region = getRegion(locale);
    const currency = getCurrency(region);

    // Show AUD immediately so nothing flashes empty
    nodes.forEach((el) => {
      const aud = Number(el.dataset.priceAud);
      if (!Number.isFinite(aud)) return;
      el.textContent = formatMoney(aud, BASE, "en-AU");
    });

    try {
      const rate = await fetchRate(currency);
      nodes.forEach((el) => {
        const aud = Number(el.dataset.priceAud);
        if (!Number.isFinite(aud)) return;
        el.textContent = formatMoney(aud * rate, currency, locale);
      });
    } catch (_) {
      nodes.forEach((el) => {
        const aud = Number(el.dataset.priceAud);
        if (!Number.isFinite(aud)) return;
        el.textContent = formatMoney(aud, BASE, "en-AU");
      });
    }
  };

  run();
})();
