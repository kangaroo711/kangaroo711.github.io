(function() {
  const arrOpts = [
    {
      type: "triangle",
      style: "stroke",
      direction: "top",
      size: 5,
      color: "skyblue",
      duration: 1400,
      speed: 1.5,
      oscillationCoefficient: 15,
      direction: "left",
      begin: function(e) {
        console.log(e);
        // translate();
        // e.complete{
        //     console.log('1');
        // }
      },
      complete: (e)=> {
        console.log(e);
        // translate(); 
      }
    }
  ];

  const items = document.querySelectorAll(".grid__item");
  items.forEach((el, pos) => {
    const bttn = el.querySelector("button.particles-button");
    const bttnBack = el.querySelector("button.action");

    let particlesOpts = arrOpts[pos];
    particlesOpts.complete = () => {
      if (!buttonVisible) {
        anime.remove(bttnBack);
        anime({
          targets: bttnBack,
          duration: 300,
          easing: "easeOutQuint",
          opacity: 1,
          scale: [0, 1]
        });
        bttnBack.style.pointerEvents = "auto";
      }
    };
    const particles = new Particles(bttn, particlesOpts);

    let buttonVisible = true;
    bttn.addEventListener("click", () => {
      if (!particles.isAnimating() && buttonVisible) {
        particles.disintegrate();
        buttonVisible = !buttonVisible;
      }
    });
    bttnBack.addEventListener("click", () => {
      if (!particles.isAnimating() && !buttonVisible) {
        anime.remove(bttnBack);
        anime({
          targets: bttnBack,
          duration: 300,
          easing: "easeOutQuint",
          opacity: 0,
          scale: 0
        });
        bttnBack.style.pointerEvents = "none";

        particles.integrate({
          duration: 800,
          easing: "easeOutSine"
        });
        buttonVisible = !buttonVisible;
      }
    });
  });
})();
