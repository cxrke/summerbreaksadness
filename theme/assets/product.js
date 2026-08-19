(() => {
  const gallery = document.querySelector(".product-gallery--multi");

  if (gallery) {
    const dots = document.querySelectorAll(".product-gallery__dot");
    const slideWidth = () => gallery.clientWidth;

    const setActive = (index) => {
      dots.forEach((dot, i) => {
        const selected = i === index;
        dot.classList.toggle("is-active", selected);
        dot.setAttribute("aria-selected", selected ? "true" : "false");
      });
    };

    const goTo = (index) => {
      const maxIndex = Math.max(dots.length - 1, 0);
      const next = Math.max(0, Math.min(index, maxIndex));
      gallery.scrollTo({ left: next * slideWidth(), behavior: "smooth" });
      setActive(next);
    };

    gallery.addEventListener(
      "scroll",
      () => {
        const width = slideWidth();
        if (!width) return;
        setActive(Math.round(gallery.scrollLeft / width));
      },
      { passive: true }
    );

    dots.forEach((dot) => {
      dot.addEventListener("click", () => goTo(Number(dot.dataset.index)));
    });

    gallery.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(Math.round(gallery.scrollLeft / slideWidth()) + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(Math.round(gallery.scrollLeft / slideWidth()) - 1);
      }
    });

    let dragging = false;
    let startX = 0;
    let startScroll = 0;

    gallery.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse") return;
      dragging = true;
      startX = event.clientX;
      startScroll = gallery.scrollLeft;
      gallery.setPointerCapture(event.pointerId);
    });

    gallery.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      gallery.scrollLeft = startScroll - (event.clientX - startX);
    });

    const stopDrag = () => {
      if (!dragging) return;
      dragging = false;
      const width = slideWidth();
      if (!width) return;
      goTo(Math.round(gallery.scrollLeft / width));
    };

    gallery.addEventListener("pointerup", stopDrag);
    gallery.addEventListener("pointercancel", stopDrag);
  }

  const buttons = document.querySelectorAll(".size-btn");
  const status = document.querySelector(".status");
  const form = document.querySelector(".stock-form");
  const productForm = document.querySelector(".product-form");
  const variantInput = document.querySelector(".variant-id");
  const addButton = document.querySelector(".add-to-cart");

  if (!buttons.length || !status) return;

  const selectSize = (button) => {
    buttons.forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");

    const size = button.dataset.size;
    const available = button.dataset.available === "true";

    if (variantInput) variantInput.value = button.dataset.variantId;

    if (available) {
      status.textContent = "";
      status.classList.remove("is-visible");
      if (addButton) addButton.hidden = false;
      if (form) form.hidden = true;
      return;
    }

    status.textContent = `${size} — sold out`;
    status.classList.add("is-visible");
    if (addButton) addButton.hidden = true;

    if (form) {
      form.hidden = false;
      form.querySelector(".stock-size").value = size;
      form.querySelector(".stock-form__note").textContent =
        `We'll email you when size ${size} is back.`;
      form.querySelector(".stock-form__status").textContent = "";
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => selectSize(button));
  });

  const preselected =
    document.querySelector(".size-btn.is-selected") ||
    (document.querySelector(".product-media--hoodie") &&
      document.querySelector('.size-btn[data-size="S"]'));
  if (preselected) selectSize(preselected);

  if (productForm && addButton) {
    productForm.addEventListener("submit", () => {
      addButton.disabled = true;
      addButton.textContent = "Adding...";
    });
  }

  if (!form) return;

  const emailInput = form.elements.email;
  const sizeInput = form.querySelector(".stock-size");
  const submitButton = form.querySelector('button[type="submit"]');
  const formStatus = form.querySelector(".stock-form__status");
  const note = form.querySelector(".stock-form__note");

  const showFormStatus = (message, type = "") => {
    formStatus.textContent = message;
    formStatus.className = "stock-form__status";
    if (type) formStatus.classList.add(`is-${type}`);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showFormStatus("");

    if (!sizeInput.value) {
      showFormStatus("Select a size first.", "error");
      buttons[0].focus();
      return;
    }

    if (!emailInput.checkValidity()) {
      emailInput.reportValidity();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "SENDING...";

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Submission failed");

      const selectedSize = sizeInput.value;
      emailInput.value = "";
      showFormStatus(`You're on the list for size ${selectedSize}.`, "success");
      note.textContent = "We'll only email you about this restock.";
    } catch (_) {
      showFormStatus("Could not save your email. Please try again.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Remind me";
    }
  });
})();
