export const CARD_TYPES = {
  EMPEREUR: "EMPEREUR",
  CITOYEN: "CITOYEN",
  ESCLAVE: "ESCLAVE",
};
export const generateHand = (role) => {
  const specialCard =
    role === CARD_TYPES.EMPEREUR
      ? { id: `c_${Date.now()}_special`, type: CARD_TYPES.EMPEREUR, name: "Empereur", icon: "👑" }
      : { id: `c_${Date.now()}_special`, type: CARD_TYPES.ESCLAVE, name: "Esclave", icon: "⛓️" };
  const citizens = [1, 2, 3, 4].map((num) => ({
    id: `c_${Date.now()}_citoyen_${num}`,
    type: CARD_TYPES.CITOYEN,
    name: "Citoyen",
    icon: "🛡️",
  }));
  return [specialCard, ...citizens];
};
