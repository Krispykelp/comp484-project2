$(function () {
  // ----- Base stats & limits -----
  const DEFAULT_IMAGE = "images/GigaChad.PNG";
  const pet_info = {
    name: "Chad",
    weight: 242,
    happiness: 6,
    strength: 100,
    energy: 100
  };

  const LIMITS = {
    weightMin: 200,
    weightMax: 400,
    happyMin: 0,
    happyMax: 999,
    strengthMin: 0,
    strengthMax: 999,
    energyMin: 0,
    energyMax: 1000
  };

  const IMAGES = {
    Consume:   "images/gigachad2.png",
    Flex:      "images/GigachadFlex.PNG",
    Exercise:  "images/GigachadExcercise.PNG",
    Rest:      "images/gigachadsitting.png",
    Default:   DEFAULT_IMAGE
  };

  // Preload images
  Object.values(IMAGES).forEach(src => { const i = new Image(); i.src = src; });

  const clamp = (min, v, max) => Math.max(min, Math.min(v, max));

  // msg popup + timer
  let __msgTimer = null;
  function showMsg(text, dwellMs = 1200, animMs = 220) {
    const $m = $(".pet-message");
    $m.text(text);
    if (!$m.is(":visible")) {
      $m.stop(true, true).slideDown(animMs);
    }
    if (__msgTimer) clearTimeout(__msgTimer);
    __msgTimer = setTimeout(() => {
      $m.slideUp(animMs);
      __msgTimer = null;
    }, dwellMs);
  }

  // swap helper
  function swapImage(keyOrSrc) {
    const src = IMAGES[keyOrSrc] || keyOrSrc || DEFAULT_IMAGE;
    $(".pet-image").attr("src", src);
  }

  // return to default image after no actions
  let __idleTimer = null;
  const IDLE_MS = 2500; 

  function kickIdleTimer() {
    if (__idleTimer) clearTimeout(__idleTimer);
    __idleTimer = setTimeout(() => {
      const $img = $(".pet-image");
      if ($img.attr("src") !== DEFAULT_IMAGE) swapImage("Default");
    }, IDLE_MS);
  }

  //  Buttons enable/disable based on Energy 
  function updateButtonStates() {
    const outOfEnergy = pet_info.energy <= LIMITS.energyMin;
    // Disable all non-Rest buttons when out of energy
    $(".Consume-button, .Flex-button, .Exercise-button").prop("disabled", outOfEnergy);
    // Rest is always enabled
    $(".Rest-button").prop("disabled", false);
  }

  //.css method used to transform images by a set scale
  function render() {
    $(".name").text(pet_info.name);
    $(".weight").text(pet_info.weight);
    $(".happiness").text(pet_info.happiness);
    $(".strength").text(pet_info.strength);
    $(".energy").text(pet_info.energy);

    // Scale ALL images based on stats.
    const wNorm = (pet_info.weight - LIMITS.weightMin) / (LIMITS.weightMax - LIMITS.weightMin);
    const hNorm = pet_info.happiness / LIMITS.happyMax;

    let scale = 1.0 + (0.50 * wNorm) + (0.2 * hNorm); 
    if (pet_info.happiness >= 8) scale += 0.02;
    scale = Math.max(0.9, Math.min(scale, 2.4)); 

    $("img").css({ transform: `scale(${scale})` });

    updateButtonStates();
  }

  // Energy gating 
  function canSpendEnergy(cost) {
    return pet_info.energy - cost >= LIMITS.energyMin;
  }

  function spendEnergy(cost) {
    pet_info.energy = clamp(LIMITS.energyMin, pet_info.energy - cost, LIMITS.energyMax);
  }

  function restoreEnergy(amount) {
    pet_info.energy = clamp(LIMITS.energyMin, pet_info.energy + amount, LIMITS.energyMax);
  }

  function action({ energyCost = 0, dW = 0, dH = 0, gainStrength = 0, imgKey, msg }) {
    // Gate by energy for non-rest actions
    if (energyCost > 0 && !canSpendEnergy(energyCost)) {
      showMsg("Too tired. Rest needed.");
      kickIdleTimer();
      return;
    }

    // Spend energy first for non-rest
    if (energyCost > 0) spendEnergy(energyCost);

    // Update stats
    pet_info.weight    = clamp(LIMITS.weightMin,  pet_info.weight + dW, LIMITS.weightMax);
    pet_info.happiness = clamp(LIMITS.happyMin,   pet_info.happiness + dH, LIMITS.happyMax);

    if (gainStrength > 0) {
      pet_info.strength = clamp(LIMITS.strengthMin, pet_info.strength + gainStrength, LIMITS.strengthMax);
    }

    if (imgKey) swapImage(imgKey);
    showMsg(msg);
    render();
    kickIdleTimer();
  }

  // Button bindings 
  //Consume = boosts happiness, increases weight
  $(".Consume-button").on("click", function () {
    action({
      energyCost: 10,
      dW: +3, dH: +1,
      imgKey: "Consume",
      msg: " MORE PROTEIN "
    });
  });

  // Flex =  boosts happiness
  $(".Flex-button").on("click", function () {
    action({
      energyCost: 10,
      dW: 0, dH: +1,
      imgKey: "Flex",
      msg: " Impressive. "
    });
  });

  // Exercise = costs more energy, increases strength, happiness, weight 
  $(".Exercise-button").on("click", function () {
    action({
      energyCost: 50,
      dW: +3, dH: +1,
      gainStrength: +2,
      imgKey: "Exercise",
      msg: " ++ Strength "
    });
  });

  // Rest =  energy for weight (always active)
  $(".Rest-button").on("click", function () {
    restoreEnergy(50); // restore amount
    pet_info.weight = clamp(LIMITS.weightMin, pet_info.weight - 1, LIMITS.weightMax);

    swapImage("Rest");
    showMsg("Lookin Swole.");
    render();
    kickIdleTimer();
  });

  // Initial paint + states 
  render();
  kickIdleTimer();
});
