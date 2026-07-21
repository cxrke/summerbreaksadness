(() => {
  const button = document.querySelector(".cart-link");
  const message = document.querySelector(".cart-message");
  if (!button || !message) return;

  let hideTimer = null;

  const hide = () => {
    message.classList.remove("is-visible");
    if (hideTimer) {
      window.clearTimeout(hideTimer);
      hideTimer = null;
    }
  };

  const show = () => {
    message.classList.add("is-visible");
    if (hideTimer) window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(hide, 2200);
  };

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    if (message.classList.contains("is-visible")) {
      hide();
    } else {
      show();
    }
  });

  document.addEventListener("click", () => {
    if (message.classList.contains("is-visible")) hide();
  });
})();
