export const getStoredPlayers = () => {
  return JSON.parse(localStorage.getItem("ece_players")) || [];
};
export const getStoredActivePlayer = () => {
  return localStorage.getItem("ece_active_player");
};
export const saveToLocaleStorage = (playerList) => {
  localStorage.setItem("ece_players", JSON.stringify(playerList));
};
export const saveActivePlayerId = (id) => {
  if (id) {
    localStorage.setItem("ece_active_player", id);
  } else {
    localStorage.removeItem("ece_active_player");
  }
};
