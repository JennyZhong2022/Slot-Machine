/*----- constants -----*/

/*----- app's state (variables) -----*/

const slotScreenArrays = [
  // [12, 7, "triple Bar", "double Bar", "single Bar", "anyBar", "cherry"],
  // [12, 7, "triple Bar", "double Bar", "single Bar", "anyBar", "cherry"],
  // [12, 7, "triple Bar", "double Bar", "single Bar", "anyBar", "cherry"],
  [12, "cherry"],
  [12, "cherry"],
  [12, "cherry"],
];

const state = {
  winnerPaid: 0,
  credits: 100,
  creditsPlayed: 0,
};

/*----- cached element references -----*/

const firstSlotBox = document.querySelector("#firstSlotBox");

const secondSlotBox = document.querySelector("#secondSlotBox");

const thirdSlotBox = document.querySelector("#thirdSlotBox");

firstSlotBox.innerText = slotScreenArrays[0][1];
secondSlotBox.innerText = slotScreenArrays[0][1];
thirdSlotBox.innerText = slotScreenArrays[0][1];

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
  // random pics will show inside each slot box
  if (state.creditsPlayed === 0) return;

  // Get an array of values from slotScreenArrays

  const shuffleAndGetValue = (arr) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled[0];
  };

  const firstValue = shuffleAndGetValue(slotScreenArrays[0]);
  const secondValue = shuffleAndGetValue(slotScreenArrays[1]);
  const thirdValue = shuffleAndGetValue(slotScreenArrays[2]);

  firstSlotBox.innerText = firstValue;
  secondSlotBox.innerText = secondValue;
  thirdSlotBox.innerText = thirdValue;

  const payoutMapping = {
    12: 2500,
    7: 50,
    "triple Bar": 30,
    "double Bar": 20,
    "single Bar": 10,
    cherry: 10,
    anyBar: 5,
  };

  // if (firstValue === secondValue && secondValue === thirdValue) {
  //   state.winnerPaid = payoutMapping[firstValue] * state.creditsPlayed || 0;
  //   winnerPaidScore.innerText = state.winnerPaid;
  // } else if (
  //   (firstValue === secondValue && secondValue === "cherry") ||
  //   (firstValue === thirdValue && thirdValue === "cherry") ||
  //   (secondValue === thirdValue && thirdValue === "cherry")
  // ) {
  //   state.winnerPaid = 5 * state.creditsPlayed || 0;
  //   winnerPaidScore.innerText = state.winnerPaid;
  // } else if (
  //   secondValue === "cherry" ||
  //   firstValue === "cherry" ||
  //   thirdValue === "cherry"
  // ) {
  //   state.winnerPaid = 2 * state.creditsPlayed || 0;
  //   winnerPaidScore.innerText = state.winnerPaid;
  // }

  let payout = 0;

  if (firstValue === secondValue && secondValue === thirdValue) {
    payout = payoutMapping[firstValue] || 0;
  } else {
    const cherryCount = [firstValue, secondValue, thirdValue].filter(
      (value) => value === "cherry"
    ).length;
    console.log(cherryCount);

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
    }, 3000);
};

const winnerAndCreditPlayedScoreReset = () => {
  creditsScore.innerText =
    parseInt(creditsScore.innerText) + parseInt(winnerPaidScore.innerText);

  console.log("winnerPaidScore", winnerPaidScore.innerText);
  console.log(state.winnerPaid);
  console.log("creditsScore", creditsScore.innerText);

  (state.winnerPaid = 0), (winnerPaidScore.innerText = state.winnerPaid);
};

/*----- event listeners -----*/

betOneButton.addEventListener("click", addCreditsPlayed);

betMaxButton.addEventListener("click", MaxCreditsPlayed);

spinButton.addEventListener("click", () =>
  handleSpin(winnerAndCreditPlayedScoreReset)
);
