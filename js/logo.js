(() => {
  const logos = document.querySelectorAll(".logo");
  const frames = Array.from(
    { length: 6 },
    (_, index) => `assets/logo-frames/${index}.png`
  );

  logos.forEach(async (logo) => {
    const frameImages = frames.map((src, index) => {
      const image = new Image();
      image.className = "logo__frame";
      image.alt = "";
      image.src = src;
      image.classList.toggle("is-active", index === 0);
      return image;
    });

    await Promise.all(
      frameImages.map((image) =>
        image.decode ? image.decode().catch(() => {}) : Promise.resolve()
      )
    );

    logo.replaceChildren(...frameImages);
    logo.style.backgroundImage = "none";

    let frame = 0;
    let timer = null;

    const holdFull = () => 0.5 + Math.random() * 2.1; // 0.5s – 2.6s

    const schedule = (fn, seconds) => {
      timer = window.setTimeout(fn, seconds * 1000);
    };

    const showFrame = (index) => {
      frame = index;
      frameImages.forEach((image, imageIndex) => {
        image.classList.toggle("is-active", imageIndex === frame);
      });
    };

    const runCycle = () => {
      showFrame(0);
      const step = () => {
        if (frame < frames.length - 1) {
          schedule(() => {
            showFrame(frame + 1);
            step();
          }, 1);
        } else {
          schedule(runCycle, holdFull());
        }
      };
      step();
    };

    runCycle();

    window.addEventListener("pagehide", () => {
      if (timer) {
        window.clearTimeout(timer);
        timer = null;
      }
    });

    window.addEventListener("pageshow", (event) => {
      if (event.persisted && !timer) runCycle();
    });
  });
})();
