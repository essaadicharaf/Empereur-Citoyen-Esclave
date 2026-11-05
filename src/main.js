import { card, duel, generateHand, getComputerChoice } from "./game.js";
import {
  activePlayerId,
  deletePlayer,
  formValidation,
  playerForm,
  playerList,
  recordGameResult,
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
  isRoleLocked = false,
  roundCount = 1,
  setCount = 1;
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
    playerHandElement.classList.add("hover:border-red-700");
    playerHandElement.addEventListener("click", (e) => {
      if (isRoleLocked) return;
      const cardElement = e.target.closest("[data-id]");
      // console.log(cardElement);
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
  const updateGameHUD = () => {
    if (currentRound) currentRound.textContent = `${roundCount}/12`;
    if (currentSet) currentSet.textContent = `${setCount}/4`;
    const playerScoreEl = document.getElementById("player-score");
    const computerScoreEl = document.getElementById("computer-score");
    if (playerScoreEl) playerScoreEl.textContent = playerScore;
    if (computerScoreEl) computerScoreEl.textContent = computerScore;
  };

  updateGameHUD();
  const showGameOverModel = (isPlayerWinner) => {
    const gameOverModel = document.getElementById("game-over-modal");
    if (!gameOverModel) return;
    const modelIcon = document.getElementById("modal-result-icon");
    const modelTitle = document.getElementById("modal-result-title");
    const modelDesc = document.getElementById("modal-result-desc");
    const modalPlayerScore = document.getElementById("modal-final-player-score");
    const modalComputerScore = document.getElementById("modal-final-computer-score");
    if (modalPlayerScore) modalPlayerScore.textContent = playerScore;
    if (modalComputerScore) modalComputerScore.textContent = computerScore;
    if (isPlayerWinner) {
      if (modelIcon) modelIcon.textContent = "🏆";
      if (modelTitle) modelTitle.textContent = "Victoire Éclatante !";
      if (modelDesc) modelDesc.textContent = "Vous avez remporté le duel à l'issue des 12 manches.";
    } else if (playerScore < computerScore) {
      if (modelIcon) modelIcon.textContent = "💀";
      if (modelTitle) modelTitle.textContent = "Défaite Cuisante";
      if (modelDesc) modelDesc.textContent = "L'ordinateur a remporté le duel. Prenez votre revanche !";
    } else {
      if (modelIcon) modelIcon.textContent = "⚖️";
      if (modelTitle) modelTitle.textContent = "Match Nul !";
      if (modelDesc) modelDesc.textContent = "Égalité parfaite entre les deux camps après 12 manches.";
    }
    gameOverModel.classList.remove("hidden");
    gameOverModel.classList.add("flex");
  };
  //restart game
  const btnRestartGame = document.getElementById("btn-restart-game");
  const resetGame = () => {
    // if (!btnRestartGame) return;
    playerScore = 0;
    computerScore = 0;
    roundCount = 1;
    setCount = 1;
    playerRole = card.EMPEREUR;
    computerRole = card.ESCLAVE;
    isRoleLocked = false;
    const gameOverModel = document.getElementById("game-over-modal");
    if (gameOverModel) {
      gameOverModel.classList.remove("flex");
      gameOverModel.classList.add("hidden");
    }
    if (btnNextRound) btnNextRound.classList.add("hidden");
    if (playerSlot && computerSlot) {
      playerSlot.innerHTML = `
        <span class="text-2xl text-amber-500/40">🎴</span>
        <span class="mt-2 text-[10px] font-medium text-slate-400">Posez une carte</span>
      `;
      computerSlot.innerHTML = `
        <span class="text-2xl text-slate-600">❓</span>
        <span class="text-[10px] text-slate-500 uppercase mt-1">En attente</span>
      `;
    }
    if (feedbackEl) feedbackEl.textContent = "A vous de jouer";
    updateGameHUD();
    playerHand = generateHand(playerRole);
    computerHand = generateHand(computerRole);
    renderPlayerHand(playerHand);
    renderComputerHand(computerHand);
  };
  if (btnRestartGame) {
    btnRestartGame.addEventListener("click", () => {
      resetGame();
    });
  }

  if (btnNextRound) {
    btnNextRound.addEventListener("click", () => {
      btnNextRound.classList.add("hidden");
      if (roundCount >= 12) {
        isRoleLocked = true;
        const isPlayerWinner = playerScore > computerScore;
        const finalWinner =
          playerScore > computerScore
            ? "Victoire finale !"
            : playerScore < computerScore
              ? "Défaite finale !"
              : "Match Nul !";
        recordGameResult(isPlayerWinner);
        showGameOverModel(isPlayerWinner);
        if (feedbackEl) {
          feedbackEl.textContent = `Partie terminée ! ${finalWinner} Score final :
           ${playerScore} - ${computerScore}`;
        }
        return;
      }
      btnNextRound.classList.add("hidden");
      isRoleLocked = false;
      if (playerSlot && computerSlot) {
        playerSlot.innerHTML = `<span class="text-xs text-slate-500 font-medium">À vous de jouer</span>`;
        computerSlot.innerHTML = `
          <span class="text-2xl text-slate-600">❓</span>
          <span class="text-[10px] text-slate-500 uppercase mt-1">En attente</span>
        `;
      }
      if (roundCount === 3 || roundCount === 6 || roundCount === 9) {
        setCount++;
        if (playerRole === card.EMPEREUR) {
          playerRole = card.ESCLAVE;
          computerRole = card.EMPEREUR;
        } else {
          playerRole = card.EMPEREUR;
          computerRole = card.ESCLAVE;
        }
        if (feedbackEl) {
          feedbackEl.textContent = `Nouveau Groupe (${setCount}/4) ! Rôles inversés : vous êtes ${playerRole}.`;
        }
      } else {
        if (feedbackEl) {
          feedbackEl.textContent = "Choisissez une carte pour débuter le duel.";
        }
      }
      roundCount++;
      updateGameHUD();
      playerHand = generateHand(playerRole);
      computerHand = generateHand(computerRole);
      renderPlayerHand(playerHand);
      renderComputerHand(computerHand);
    });
  }
}
