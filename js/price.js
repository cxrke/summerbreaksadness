(() => {
  const PRICES = {
    hoodie: {
      AUD: 120,
      USD: 79,
      NZD: 130,
      GBP: 62,
      EUR: 74,
    },
    polo: {
      AUD: 85,
      USD: 56,
      NZD: 92,
      GBP: 44,
      EUR: 52,
    },
  };

  const SUPPORTED_CURRENCIES = ["AUD", "USD", "NZD", "GBP", "EUR"];
  const EURO_REGIONS = new Set([
    "AT",
    "BE",
    "CY",
    "DE",
    "EE",
    "ES",
    "FI",
    "FR",
    "GR",
    "HR",
    "IE",
    "IT",
    "LT",
    "LU",
    "LV",
    "MT",
    "NL",
    "PT",
    "SI",
    "SK",
  ]);

  const getSuggestedCurrency = () => {
    try {
      const locale =
        (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        "en-AU";
      const region = new Intl.Locale(locale).maximize().region;
      if (region === "AU") return "AUD";
      if (region === "NZ") return "NZD";
      if (region === "GB") return "GBP";
      if (EURO_REGIONS.has(region)) return "EUR";
    } catch (_) {
      // Use USD when the browser does not expose a valid locale.
    }
    return "USD";
  };

  const formatMoney = (amount, currency) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(amount);

  const getSavedCurrency = () => {
    try {
      return localStorage.getItem("currency");
    } catch (_) {
      return null;
    }
  };

  const saveCurrency = (currency) => {
    try {
      localStorage.setItem("currency", currency);
    } catch (_) {
      // The selection still works for this page if storage is unavailable.
    }
  };

  const displayPrices = (currency) => {
    document.querySelectorAll("[data-product]").forEach((element) => {
      const product = PRICES[element.dataset.product];
      const amount = product && product[currency];
      if (typeof amount !== "number") return;
      element.textContent = formatMoney(amount, currency);
    });
  };

  const selector = document.querySelector(".currency-selector");
  if (!selector) return;

  const savedCurrency = getSavedCurrency();
  const currency = SUPPORTED_CURRENCIES.includes(savedCurrency)
    ? savedCurrency
    : getSuggestedCurrency();

  selector.value = currency;
  displayPrices(currency);

  selector.addEventListener("change", () => {
    const selectedCurrency = selector.value;
    if (!SUPPORTED_CURRENCIES.includes(selectedCurrency)) return;
    saveCurrency(selectedCurrency);
    displayPrices(selectedCurrency);
  });
})();
