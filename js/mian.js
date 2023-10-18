/*----- constants -----*/

/*----- app's state (variables) -----*/

const slotScreenArrays = [
  [25, 7, "diamond", "machine", "apple", "lemon", "cherry"],
  [25, 7, "diamond", "machine", , "apple", "lemon", "cherry"],
  [25, 7, "diamond", "machine", , "apple", "lemon", "cherry"],
  // [25, 7, "cherry"],
  // [25, 7, "cherry"],
  // [25, 7, "cherry"],
];

const imageLookup = {
  25: new Image(),
  7: new Image(),
  diamond: new Image(),
  machine: new Image(),
  apple: new Image(),
  lemon: new Image(),
  cherry: new Image(),
};

imageLookup["25"].src = "../imgs/casino-chip.png";
imageLookup["7"].src = "../imgs/seven.png";
imageLookup["diamond"].src = "../imgs/diamond.png";
imageLookup["machine"].src = "../imgs/machine.png";
imageLookup["apple"].src = "../imgs/apple.png";
imageLookup["lemon"].src = "../imgs/lemon.png";
imageLookup["cherry"].src = "../imgs/cherries.png";

const state = {
  winnerPaid: 0,
  credits: 100,
  creditsPlayed: 0,
};

const slotScreenArraysWithImages = slotScreenArrays.map((subArray) => {
  return subArray.map((item) => {
    return imageLookup[item] || item; // If no image found, return the original item
  });
});

console.log(slotScreenArraysWithImages);
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

creditsPlayedScore.innerText = state.creditsPlayed;

creditsScore.innerText = state.credits;

winnerPaidScore.innerText = state.winnerPaid;

/*----- cached element references -----*/

const betOneButton = document.querySelector("#betOne");

const betMaxButton = document.querySelector("#betMax");

const spinButton = document.querySelector("#spin");

const replayButton = document.querySelector("#replay");

/*----- functions -----*/

// slotScreen needs to random inside pictures

const addCreditsPlayed = () => {
  state.creditsPlayed = (state.creditsPlayed % 3) + 1;
  creditsPlayedScore.innerText = state.creditsPlayed;
};

// cb will be spin function
const MaxCreditsPlayed = () => {
  state.creditsPlayed = 3; // Set state.creditsPlayed to 3
  creditsPlayedScore.innerText = state.creditsPlayed; // Call the callback function
};

const handleSpin = (cd) => {
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

  console.log(firstValue);
  console.log(secondValue);
  console.log(thirdValue);

  // credits calculation

  const payoutMapping = {
    25: 100,
    7: 50,
    diamond: 30,
    machine: 20,
    apple: 10,
    lemon: 10,
    cherry: 5,
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
  } else {
    const cherryCount = [firstKey, secondKey, thirdKey].filter(
      (value) => value === "cherry"
    ).length;
    // console.log(cherryCount);

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
      cd();
    }, 1000);
};

// callback function below to reset the scores
let interval;

const winnerAndCreditPlayedScoreReset = () => {
  let currentCredits = parseInt(creditsScore.innerText, 10);
  const incrementValue = parseInt(winnerPaidScore.innerText, 10);
  const targetValue = currentCredits + incrementValue;

  interval = setInterval(() => {
    // Only increment if winnerPaidScore is greater than 0
    if (incrementValue > 0) {
      currentCredits++;
      creditsScore.innerText = currentCredits;
    }
    spinButton.setAttribute("disabled", "");
    // Stop when reaching the target
    if (currentCredits >= targetValue) {
      clearInterval(interval);
      spinButton.removeAttribute("disabled");
    }
  }, 300);

  // creditsScore.innerText =
  //   parseInt(creditsScore.innerText) + parseInt(winnerPaidScore.innerText);

  console.log("winnerPaidScore", winnerPaidScore.innerText);
  console.log("state.winnerPaid", state.winnerPaid);
  console.log("creditsScore", creditsScore.innerText);
  console.log(targetValue);

  function updateNumber(elementId, newValue) {
    const el = document.getElementById(elementId);
    const oldValue = parseInt(el.innerText);

    if (oldValue === newValue) return; // no change

    el.classList.add("rolling"); // apply the rolling animation

    setTimeout(() => {
      el.innerText = newValue; // update the number after animation ends
      el.classList.remove("rolling"); // remove the rolling animation class
    }, 1000); // assume the animation duration is 500ms
  }

  updateNumber("winnerPaid", 0); // updates the value of 'winnerPaid' to 0 with rolling effect

  (state.winnerPaid = 0), (winnerPaidScore.innerText = state.winnerPaid);
  console.log(state.winnerPaid);
};

const replayHandler = () => {
  clearInterval(interval);
  spinButton.removeAttribute("disabled");
  state.credits = 100;
  state.creditsPlayed = 0;
  state.winnerPaid = 0;

  winnerPaidScore.innerText = state.winnerPaid;
  creditsScore.innerText = state.credits;
  creditsPlayedScore.innerText = state.creditsPlayed;

  firstSlotImg.src = slotScreenArraysWithImages[0][0].src;
  secondSlotImg.src = slotScreenArraysWithImages[0][0].src;
  thirdSlotImg.src = slotScreenArraysWithImages[0][0].src;
};

/*----- event listeners -----*/

betOneButton.addEventListener("click", addCreditsPlayed);

betMaxButton.addEventListener("click", MaxCreditsPlayed);

spinButton.addEventListener("click", () =>
  handleSpin(winnerAndCreditPlayedScoreReset)
);

replayButton.addEventListener("click", replayHandler);
