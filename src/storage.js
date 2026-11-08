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
export const getStoreHistory = () => {
  return JSON.parse(localStorage.getItem("ece_history")) || [];
};
export const saveMatchToHistory = (matchData) => {
  const history = getStoreHistory();
  history.unshift(matchData);
  localStorage.setItem("ece_history", JSON.stringify(history));
};
export const clearStoreHistory = () => {
  localStorage.removeItem("ece_history");
};
export const deleteMatchFromHistory = (matchId) => {
  const history = getStoreHistory();
  const updateHistory = history.filter((match) => match.id !== matchId);
  localStorage.setItem("ece_history", JSON.stringify(updateHistory));
  return updateHistory;
};
export const anonymizePlayerInHistory = (playerId) => {
  const history = getStoreHistory();
  const updatedHistory = history.map((match) => {
    if (match.playerId === playerId) {
      return {
        ...match,
        playerNickname: "Joueur supprimé",
        playerAvatar: "👤",
      };
    }
    return match; // ✅ ضرورية باش تحافظ على باقي الماتشات
  });
  localStorage.setItem("ece_history", JSON.stringify(updatedHistory));
};
