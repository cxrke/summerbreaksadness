(() => {
  const logos = document.querySelectorAll(".logo");

  logos.forEach((logo) => {
    const lights = logo.querySelectorAll(".logo__light");
    if (lights.length !== 5) return;

    let lit = 0;
    let timer = null;

    const clearLights = () => {
      lit = 0;
      lights.forEach((light) => light.classList.remove("is-on"));
    };

    const lightNext = () => {
      if (lit < lights.length) {
        lights[lit].classList.add("is-on");
        lit += 1;
      }
    };

    const holdFull = () => 0.5 + Math.random() * 2.1; // 0.5s – 2.6s

    const schedule = (fn, seconds) => {
      timer = window.setTimeout(fn, seconds * 1000);
    };

    const runCycle = () => {
      clearLights();
      schedule(() => {
        lightNext();
        const step = () => {
          if (lit < lights.length) {
            schedule(() => {
              lightNext();
              step();
            }, 1);
          } else {
            schedule(runCycle, holdFull());
          }
        };
        step();
      }, 1);
    };

    runCycle();

    window.addEventListener(
      "pagehide",
      () => {
        if (timer) window.clearTimeout(timer);
      },
      { once: true }
    );
  });
})();
