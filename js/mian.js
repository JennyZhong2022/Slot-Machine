/*----- constants -----*/

/*----- app's state (variables) -----*/

const slotScreenArrays = [
  // [25, 7, "triple Bar", "double Bar", "single Bar", "anyBar", "cherry"],
  // [12, 7, "triple Bar", "double Bar", "single Bar", "anyBar", "cherry"],
  // [12, 7, "triple Bar", "double Bar", "single Bar", "anyBar", "cherry"],
  [25, 7, "cherry"],
  [25, 7, "cherry"],
  [25, 7, "cherry"],
];

const imageLookup = {
  25: new Image(),
  7: new Image(),
  cherry: new Image(),
};

imageLookup["25"].src = "../imgs/poker-chip.png";
imageLookup["7"].src = "../imgs/seven.png";
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

firstSlotBox.appendChild(slotScreenArraysWithImages[0][1].cloneNode(true));
secondSlotBox.appendChild(slotScreenArraysWithImages[0][1].cloneNode(true));
thirdSlotBox.appendChild(slotScreenArraysWithImages[0][1].cloneNode(true));

console.log(firstSlotBox);
console.log(secondSlotBox);
console.log(thirdSlotBox);

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

/*----- functions -----*/

// slotScreen needs to random inside pictures

const addCreditsPlayed = () => {
  state.creditsPlayed = (state.creditsPlayed % 3) + 1;
  creditsPlayedScore.innerText = state.creditsPlayed;
  console.log(state.creditsPlayed);
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
    25: 2500,
    7: 50,
    "triple Bar": 30,
    "double Bar": 20,
    "single Bar": 10,
    cherry: 10,
    anyBar: 5,
  };

  function getKeyByValue(object, value) {
    const entry = Object.entries(object).find(([key, val]) => val === value);
    return entry && entry[0];
  }

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

  state.winnerPaid += payout * state.creditsPlayed;
  winnerPaidScore.innerText = state.winnerPaid;

  creditsScore.innerText =
    parseInt(creditsScore.innerText) - parseInt(creditsPlayedScore.innerText);

  (state.creditsPlayed = 0),
    (creditsPlayedScore.innerText = state.creditsPlayed),
    // callback function to reset the scores
    setTimeout(() => {
      cd();
    }, 3000);
};

// callback function below to reset the scores

const winnerAndCreditPlayedScoreReset = () => {
  creditsScore.innerText =
    parseInt(creditsScore.innerText) + parseInt(winnerPaidScore.innerText);

  // console.log("winnerPaidScore", winnerPaidScore.innerText);
  // console.log(state.winnerPaid);
  // console.log("creditsScore", creditsScore.innerText);

  (state.winnerPaid = 0), (winnerPaidScore.innerText = state.winnerPaid);
};

/*----- event listeners -----*/

betOneButton.addEventListener("click", addCreditsPlayed);

betMaxButton.addEventListener("click", MaxCreditsPlayed);

spinButton.addEventListener("click", () =>
  handleSpin(winnerAndCreditPlayedScoreReset)
);
