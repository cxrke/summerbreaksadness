(() => {
  const buttons = document.querySelectorAll(".size-btn");
  const status = document.querySelector(".status");

  if (!buttons.length || !status) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-selected"));
      button.classList.add("is-selected");
      status.textContent = `${button.dataset.size} — sold out`;
      status.classList.add("is-visible");
    });
  });
})();
