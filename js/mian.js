/*----- constants -----*/

const url = {
  cashRegisterPurchase: "./src/music/cash-register-purchase-87313.mp3",
  slotMachinePayout: "./src/music/slot-machine-payout-81725.mp3",
  spinReel: "./src/music/switch-150130.mp3",
  jackPot: "./src/music/slot-machine-jackpot.mp3",
};

const cashRegisterAudio = new Audio(url.cashRegisterPurchase);
const slotMachinePayoutAudio = new Audio(url.slotMachinePayout);
const spinReelAudio = new Audio(url.spinReel);
const jackPotAudio = new Audio(url.jackPot);

/*----- app's state (variables) -----*/

const slotScreenArrays = [
  ["casino", 7, "diamond", "machine", "apple", "lemon", "cherry"],
  ["casino", 7, "diamond", "machine", "apple", "lemon", "cherry"],
  ["casino", 7, "diamond", "machine", "apple", "lemon", "cherry"],
  // ["casino", "casino", "cherry"],
  // ["casino", "casino", "cherry"],
  // ["casino", "casino", "cherry"],
];

const imageLookup = {
  casino: new Image(),
  7: new Image(),
  diamond: new Image(),
  machine: new Image(),
  apple: new Image(),
  lemon: new Image(),
  cherry: new Image(),
};

imageLookup["casino"].src = "./src/imgs/casino-chip.png";
imageLookup["7"].src = "./src/imgs/seven.png";
imageLookup["diamond"].src = "./src/imgs/diamond.png";
imageLookup["machine"].src = "./src/imgs/machine.png";
imageLookup["apple"].src = "./src/imgs/apple.png";
imageLookup["lemon"].src = "./src/imgs/lemon.png";
imageLookup["cherry"].src = "./src/imgs/cherries.png";

const state = {
  winnerPaid: 0,
  credits: 100,
  creditsPlayed: 0,
  canPlayAudio: true,
};

const slotScreenArraysWithImages = slotScreenArrays.map((subArray) => {
  return subArray.map((item) => {
    return imageLookup[item] || item; // If no image found, return the original item
  });
});

/*----- cached element references -----*/

const firstSlotBox = document.querySelector("#firstSlotBox");

const secondSlotBox = document.querySelector("#secondSlotBox");

const thirdSlotBox = document.querySelector("#thirdSlotBox");

// A single DOM node (like an Image object) can only exist in one location in the DOM tree. So when you try to append it to a second location, it gets removed from the first.Using cloneNode(true) creates a deep clone of the image,

firstSlotBox.appendChild(slotScreenArraysWithImages[0][0].cloneNode(true));
secondSlotBox.appendChild(slotScreenArraysWithImages[0][0].cloneNode(true));
thirdSlotBox.appendChild(slotScreenArraysWithImages[0][0].cloneNode(true));
/*----- cached element references -----*/

const firstSlotImg = document.querySelector("#firstSlotBox img");

const secondSlotImg = document.querySelector("#secondSlotBox img");

const thirdSlotImg = document.querySelector("#thirdSlotBox img");
/*----- cached element references -----*/

const winnerPaidScore = document.querySelector("#winnerPaid");

const creditsScore = document.querySelector("#credits");

const creditsPlayedScore = document.querySelector("#creditsPlayed");

/*----- cached element references -----*/

const betOneButton = document.querySelector("#betOne");

const betMaxButton = document.querySelector("#betMax");

const spinButton = document.querySelector("#spin");

const replayButton = document.querySelector("#replay");

const musicButton = document.querySelector("#sound");

const musicImg = document.querySelector("#musicImg");

const tableButton = document.querySelector("#playTable");

/*----- functions -----*/

const init = () => {
  creditsPlayedScore.innerText = state.creditsPlayed;

  creditsScore.innerText = state.credits;

  winnerPaidScore.innerText = state.winnerPaid;
};

init();

const audioPlayTime = (audioName, currentTime, timeLength) => {
  audioName.currentTime = currentTime;
  state.canPlayAudio && audioName.play();
  setTimeout(() => {
    audioName.pause();
    audioName.currentTime = currentTime;
  }, timeLength);
};

const addCreditsPlayed = () => {
  audioPlayTime(cashRegisterAudio, 0, 500);
  state.creditsPlayed = (state.creditsPlayed % 3) + 1;
  creditsPlayedScore.innerText = state.creditsPlayed;
};

const MaxCreditsPlayed = () => {
  audioPlayTime(cashRegisterAudio, 0, 500);
  state.creditsPlayed = 3;
  creditsPlayedScore.innerText = state.creditsPlayed;
};

const spinHandler = (resetScoresCallback) => {
  if (state.creditsPlayed === 0) return;

  // random pics will show inside each slot box

  const shuffleAndGetValue = (arr) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled[0];
  };

  const firstValue = shuffleAndGetValue(slotScreenArraysWithImages[0]);
  const secondValue = shuffleAndGetValue(slotScreenArraysWithImages[1]);
  const thirdValue = shuffleAndGetValue(slotScreenArraysWithImages[2]);

  if (firstSlotImg) {
    firstSlotImg.src = firstValue.src;
  }

  if (secondSlotImg) {
    secondSlotImg.src = secondValue.src;
  }

  if (thirdSlotImg) {
    thirdSlotImg.src = thirdValue.src;
  }

  // credits calculation

  const payoutMapping = {
    casino: 100,
    7: 50,
    diamond: 30,
    machine: 20,
    apple: 10,
    lemon: 10,
    cherry: 10,
  };

  const getKeyByValue = (object, value) => {
    for (let key in object) {
      if (object[key] === value) {
        return key; // we found it
      }
    }
    return null; // we didn't find it
  };

  const firstKey = getKeyByValue(imageLookup, firstValue);
  const secondKey = getKeyByValue(imageLookup, secondValue);
  const thirdKey = getKeyByValue(imageLookup, thirdValue);

  let payout = 0;

  if (firstKey === secondKey && secondKey === thirdKey) {
    payout = payoutMapping[firstKey] || 0;

    state.canPlayAudio && jackPotAudio.play();
    setTimeout(() => {
      jackPotAudio.pause();
      jackPotAudio.currentTime = 0;
    }, 3000);
  } else {
    const cherryCount = [firstKey, secondKey, thirdKey].filter(
      (value) => value === "cherry"
    ).length;

    if (cherryCount === 2) {
      payout = 5;
    } else if (cherryCount === 1) {
      payout = 2;
    }
  }

  state.winnerPaid = payout * state.creditsPlayed;
  winnerPaidScore.innerText = state.winnerPaid;

  creditsScore.innerText =
    parseInt(creditsScore.innerText) - parseInt(creditsPlayedScore.innerText);

  (state.creditsPlayed = 0),
    (creditsPlayedScore.innerText = state.creditsPlayed),
    // callback function to reset the scores
    setTimeout(() => {
      resetScoresCallback();
    }, 1000);
};

// callback function below to reset the scores
let interval;
let interval2;

const winnerAndCreditPlayedScoreReset = () => {
  let currentCredits = parseInt(creditsScore.innerText, 10);
  const incrementValue = parseInt(winnerPaidScore.innerText, 10);
  const targetValue = currentCredits + incrementValue;
  if (incrementValue) {
    spinButton.setAttribute("disabled", "");
  }

  clearInterval(interval);
  interval = setInterval(() => {
    // Only increment if winnerPaidScore is greater than 0
    if (incrementValue) {
      state.canPlayAudio && slotMachinePayoutAudio.play();
      currentCredits++;
      creditsScore.innerText = currentCredits;
    }

    // Stop when reaching the target
    if (currentCredits >= targetValue || incrementValue === 0) {
      clearInterval(interval);
      setTimeout(() => {
        slotMachinePayoutAudio.pause();
        slotMachinePayoutAudio.currentTime = 0;
      }, 500);
      spinButton.removeAttribute("disabled");
    }
  }, 200);

  function updateNumber(elementId, newValue) {
    const el = document.getElementById(elementId);
    let currentValue = parseInt(el.innerText);

    if (currentValue === newValue) return; // no change

    el.classList.add("rolling"); // apply the rolling animation

    clearInterval(interval2);
    interval2 = setInterval(() => {
      if (currentValue > newValue) {
        currentValue--;
        el.innerText = currentValue;
      } else {
        clearInterval(interval2); // stop when reaching the target value
        el.classList.remove("rolling"); // remove the rolling animation class
      }
    }, 200);
  }

  // updates the value of 'winnerPaid' to 0 with rolling effect

  updateNumber("winnerPaid", 0);
};

const stopAudio = (audioName, currentTime) => {
  audioName.pause();
  audioName.currentTime = currentTime;
};

const resetHandler = () => {
  clearInterval(interval);
  clearInterval(interval2);
  spinButton.removeAttribute("disabled");
  winnerPaidScore.classList.remove("rolling");
  state.credits = 100;
  state.creditsPlayed = 0;
  state.winnerPaid = 0;

  init();

  firstSlotImg.src = slotScreenArraysWithImages[0][0].src;
  secondSlotImg.src = slotScreenArraysWithImages[0][0].src;
  thirdSlotImg.src = slotScreenArraysWithImages[0][0].src;

  stopAudio(slotMachinePayoutAudio, 0);
  stopAudio(jackPotAudio, 0);
  musicImg.src = "./src/imgs/music-on.png";
  state.canPlayAudio = true;
};

const musicHandler = () => {
  state.canPlayAudio = !state.canPlayAudio;
  stopAudio(cashRegisterAudio, 0);
  stopAudio(slotMachinePayoutAudio, 0);
  stopAudio(spinReelAudio, 0);
  stopAudio(jackPotAudio, 0);
  state.canPlayAudio
    ? (musicImg.src = "./src/imgs/music-on.png")
    : (musicImg.src = "./src/imgs/music-off.png");
};

const tableHandler = () => {
  window.scroll({
    top: window.innerHeight,
    behavior: "smooth",
  });
};

/*----- event listeners -----*/

betOneButton.addEventListener("click", addCreditsPlayed);

betMaxButton.addEventListener("click", MaxCreditsPlayed);

spinButton.addEventListener("click", () => {
  audioPlayTime(spinReelAudio, 0, 500);
  spinHandler(winnerAndCreditPlayedScoreReset);
});

replayButton.addEventListener("click", resetHandler);

musicButton.addEventListener("click", musicHandler);

tableButton.addEventListener("click", tableHandler);
