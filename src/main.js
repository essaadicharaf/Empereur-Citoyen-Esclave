import { card, generateHand, getComputerChoice, duel } from "./game.js";
import {
  activePlayerId,
  deletePlayer,
  formValidation,
  playerForm,
  playerList,
  selectPlayer,
  updatePlayer,
} from "./players.js";
import {
  checkPlayerActive,
  displayPlayers,
  namePlayer,
  renderComputerHand,
  renderPlayerHand,
  updateActivePlayerHeader,
} from "./ui.js";
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
// validation ajout et modif
if (playerForm) {
  playerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidation();
  });
}
updateActivePlayerHeader(playerList, activePlayerId);
if (playersContainer) {
  displayPlayers(playerList, activePlayerId);
}
// Game State
let playerScore = 0,
  computerScore = 0,
  playerRole = card.EMPEREUR,
  computerRole = card.ESCLAVE,
  playerHand = [],
  computerHand = [],
  isRoleLocked = false;
const playerBattle = document.getElementById("player-battle-slot");
const currentRound = document.getElementById("current-round");
const currentSet = document.getElementById("current-set");
if (playerBattle) {
  const playerHandElement = document.getElementById("player-hand");
  const playerSlot = document.getElementById("player-battle-slot");
  const computerSlot = document.getElementById("computer-battle-slot");
  const feedbackEl = document.getElementById("duel-feedback");
  const playerScoreEl = document.getElementById("player-score");
  const computerScoreEl = document.getElementById("computer-score");
  const btnNextRound = document.getElementById("btn-next-round");
  checkPlayerActive();
  namePlayer();
  playerHand = generateHand(playerRole);
  computerHand = generateHand(computerRole);
  renderPlayerHand(playerHand);
  renderComputerHand(computerHand);
  if (playerHandElement) {
    playerHandElement.addEventListener("click", (e) => {
      if (isRoleLocked) return;
      const cardElement = e.target.closest("[data-id]");
      if (!cardElement) return;
      const cardId = cardElement.getAttribute("data-id");
      const playerCardIndex = playerHand.findIndex((c) => c.id === cardId);
      if (playerCardIndex === -1) return;
      const playerCard = playerHand.splice(playerCardIndex, 1)[0];
      const computerCard = getComputerChoice(computerHand);
      const computerCardIndex = computerHand.findIndex((c) => c.id === computerCard.id);
      if (computerCardIndex !== -1) {
        computerHand.splice(computerCardIndex, 1);
      }
      if (playerSlot && computerSlot) {
        playerSlot.innerHTML = `
          <div class="flex flex-col items-center justify-center">
            <img src="${playerCard.image}" alt="${playerCard.name}" class="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-xl shadow-lg border border-amber-500/50" />
            <span class="mt-2 text-xs font-bold text-amber-400 uppercase tracking-wider">${playerCard.name}</span>
          </div>
        `;
        computerSlot.innerHTML = `
          <div class="flex flex-col items-center justify-center">
            <img src="${computerCard.image}" alt="${computerCard.name}" class="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-xl shadow-lg border border-slate-600" />
            <span class="mt-2 text-xs font-bold text-slate-300 uppercase tracking-wider">${computerCard.name}</span>
          </div>
        `;
      }
      renderPlayerHand(playerHand);
      renderComputerHand(computerHand);
      const result = duel(playerCard.type, computerCard.type);
      playerScore += result.playerPoints;
      computerScore += result.computerPoints;
      if (playerScoreEl) playerScoreEl.textContent = playerScore;
      if (computerScoreEl) computerScoreEl.textContent = computerScore;
      if (feedbackEl) feedbackEl.textContent = result.message;
      if (result.winner === "NUL") {
        isRoleLocked = false;
      } else {
        isRoleLocked = true;
        if (btnNextRound) {
          btnNextRound.classList.remove("hidden");
        }
      }
    });
  }
}
