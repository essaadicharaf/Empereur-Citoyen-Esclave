import {
  activePlayerId,
  deletePlayer,
  formValidation,
  playerForm,
  playerList,
  selectPlayer,
  updatePlayer,
} from "./players.js";
import { displayPlayers } from "./ui.js";

const playersContainer = document.getElementById("players-list-container");

if (playersContainer) {
  playersContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id");
    if (action === "select") {
      selectPlayer(id);
    } else if (action === "delete") {
      deletePlayer(id);
    } else if (action === "edit") {
      updatePlayer(id);
    }
  });
}

if (playerForm) {
  playerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidation();
  });
}

displayPlayers(playerList, activePlayerId);
