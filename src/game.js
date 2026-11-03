export const card = {
  EMPEREUR: "EMPEREUR",
  CITOYEN: "CITOYEN",
  ESCLAVE: "ESCLAVE",
};

export const generateHand = (role) => {
  const specialCard =
    role === card.EMPEREUR
      ? { id: `c_${Date.now()}_special`, type: card.EMPEREUR, name: "Empereur", image: "images/emperor.jpg" }
      : { id: `c_${Date.now()}_special`, type: card.ESCLAVE, name: "Esclave", image: "images/slave.jpg" };

  const citizens = [1, 2, 3, 4].map((num) => ({
    id: `c_${Date.now()}_citoyen_${num}`,
    type: card.CITOYEN,
    name: "Citoyen",
    image: "images/citizen.jpg",
  }));

  return [specialCard, ...citizens];
};


export const getComputerChoice = (hand) => {
  if (!hand || hand.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * hand.length);
  return hand[randomIndex];
};


export const duel = (playerCardType, computerCardType) => {
  // 1. التعادل (مواطن ضد مواطن)
  if (playerCardType === computerCardType) {
    return {
      winner: "NUL",
      playerPoints: 0,
      computerPoints: 0,
      message: "Égalité ! Les deux citoyens s'annulent.",
    };
  }

  if (playerCardType === card.EMPEREUR && computerCardType === card.CITOYEN) {
    return {
      winner: "PLAYER",
      playerPoints: 1,
      computerPoints: 0,
      message: "Victoire ! L'Empereur soumet le Citoyen (+1 pt).",
    };
  }
  if (computerCardType === card.EMPEREUR && playerCardType === card.CITOYEN) {
    return {
      winner: "COMPUTER",
      playerPoints: 0,
      computerPoints: 1,
      message: "Défaite ! L'Empereur adverse soumet votre Citoyen (+1 pt).",
    };
  }


  if (playerCardType === card.CITOYEN && computerCardType === card.ESCLAVE) {
    return {
      winner: "PLAYER",
      playerPoints: 1,
      computerPoints: 0,
      message: "Victoire ! Le Citoyen maîtrise l'Esclave (+1 pt).",
    };
  }
  if (computerCardType === card.CITOYEN && playerCardType === card.ESCLAVE) {
    return {
      winner: "COMPUTER",
      playerPoints: 0,
      computerPoints: 1,
      message: "Défaite ! Le Citoyen adverse maîtrise votre Esclave (+1 pt).",
    };
  }

  if (playerCardType === card.ESCLAVE && computerCardType === card.EMPEREUR) {
    return {
      winner: "PLAYER",
      playerPoints: 5,
      computerPoints: 0,
      message: "Coup d'éclat ! L'Esclave terrasse l'Empereur (+5 pts) !",
    };
  }
  if (computerCardType === card.ESCLAVE && playerCardType === card.EMPEREUR) {
    return {
      winner: "COMPUTER",
      playerPoints: 0,
      computerPoints: 5,
      message: "Catastrophe ! L'Esclave adverse terrasse votre Empereur (+5 pts) !",
    };
  }
};
