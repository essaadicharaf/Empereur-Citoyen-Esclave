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
import { clearStoreHistory, deleteMatchFromHistory, getStoreHistory, saveMatchToHistory } from "./storage.js";
import {
  checkPlayerActive,
  displayHistory,
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
      if (!cardElement) return;
      const cardId = cardElement.getAttribute("data-id");
      const playerCardIndex = playerHand.findIndex((c) => c.id === cardId);
      if (playerCardIndex === -1) return;
      isRoleLocked = true;
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
            <div class="w-16 h-24 sm:w-20 sm:h-28 rounded-xl border border-slate-700 bg-slate-900 flex flex-col items-center justify-center shadow-lg">
              <span class="text-2xl text-slate-500">🎴</span>
              <span class="text-[9px] font-bold text-slate-500 uppercase mt-1">Secret</span>
            </div>
          </div>
        `;
      }
      renderPlayerHand(playerHand);
      renderComputerHand(computerHand);
      if (feedbackEl) feedbackEl.textContent = "Duel en cours...";
      setTimeout(() => {
        if (computerSlot) {
          computerSlot.innerHTML = `
            <div class="flex flex-col items-center justify-center">
              <img src="${computerCard.image}" alt="${computerCard.name}" class="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-xl shadow-lg border border-slate-600" />
              <span class="mt-2 text-xs font-bold text-slate-300 uppercase tracking-wider">${computerCard.name}</span>
            </div>
          `;
        }
        const result = duel(playerCard.type, computerCard.type);
        playerScore += result.playerPoints;
        computerScore += result.computerPoints;
        if (playerScoreEl) playerScoreEl.textContent = playerScore;
        if (computerScoreEl) computerScoreEl.textContent = computerScore;
        if (feedbackEl) feedbackEl.textContent = result.message;
        const isEmpereurVsEsclave =
          (playerCard.type === card.EMPEREUR && computerCard.type === card.ESCLAVE) ||
          (playerCard.type === card.ESCLAVE && computerCard.type === card.EMPEREUR);
        if (isEmpereurVsEsclave || playerHand.length === 0) {
          isRoleLocked = true;
          if (btnNextRound) {
            btnNextRound.classList.remove("hidden");
          }
        } else {
          isRoleLocked = false;
        }
      }, 800);
    });
  }
  const updateGameHUD = () => {
    if (currentRound) currentRound.textContent = `${roundCount}/12`;
    if (currentSet) currentSet.textContent = `${setCount}/4`;
    if (playerScoreEl) playerScoreEl.textContent = playerScore;
    if (computerScoreEl) computerScoreEl.textContent = computerScore;
  };
  updateGameHUD();
  const recordMatchHistory = (status) => {
    const player = playerList.find((p) => p.id === activePlayerId);
    const matchData = {
      id: `m_${Date.now()}`,
      playerId: activePlayerId,
      playerNickname: player ? player.nickname : "Joueur",
      playerAvatar: player ? player.avatar : "👤",
      playerScore: playerScore,
      computerScore: computerScore,
      result: status,
      date: new Date().toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    saveMatchToHistory(matchData);
  };
  const showGameOverModel = (status) => {
    const gameOverModel = document.getElementById("game-over-modal");
    if (!gameOverModel) return;
    const modelIcon = document.getElementById("modal-result-icon");
    const modelTitle = document.getElementById("modal-result-title");
    const modelDesc = document.getElementById("modal-result-desc");
    const modalPlayerScore = document.getElementById("modal-final-player-score");
    const modalComputerScore = document.getElementById("modal-final-computer-score");

    if (modalPlayerScore) modalPlayerScore.textContent = playerScore;
    if (modalComputerScore) modalComputerScore.textContent = computerScore;

    if (status === "VICTOIRE") {
      if (modelIcon) modelIcon.textContent = "🏆";
      if (modelTitle) modelTitle.textContent = "Victoire Éclatante !";
      if (modelDesc) modelDesc.textContent = "Vous avez remporté le duel à l'issue des 12 manches.";
    } else if (status === "ABANDON") {
      if (modelIcon) modelIcon.textContent = "🏳️";
      if (modelTitle) modelTitle.textContent = "Partie Abandonnée";
      if (modelDesc) modelDesc.textContent = "Vous avez déclaré forfait face à l'ordinateur.";
    } else if (status === "DEFAITE") {
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
  const resetGame = () => {
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
    if (feedbackEl) feedbackEl.textContent = "À vous de jouer";
    updateGameHUD();
    playerHand = generateHand(playerRole);
    computerHand = generateHand(computerRole);
    renderPlayerHand(playerHand);
    renderComputerHand(computerHand);
  };
  const btnRestartGame = document.getElementById("btn-restart-game");
  if (btnRestartGame) {
    btnRestartGame.addEventListener("click", () => {
      resetGame();
    });
  }
  const btnAbandon = document.getElementById("btn-abandon");
  if (btnAbandon) {
    btnAbandon.addEventListener("click", () => {
      const confirmAbandon = confirm("Voulez-vous vraiment abandonner la partie ?");
      if (!confirmAbandon) return;
      isRoleLocked = true;
      recordGameResult(false);
      recordMatchHistory("ABANDON");
      showGameOverModel("ABANDON");
    });
  }
  if (btnNextRound) {
    btnNextRound.addEventListener("click", () => {
      btnNextRound.classList.add("hidden");
      if (roundCount >= 12) {
        isRoleLocked = true;
        const isPlayerWinner = playerScore > computerScore;
        const matchResult = isPlayerWinner ? "VICTOIRE" : playerScore < computerScore ? "DEFAITE" : "EGALITE";
        recordGameResult(isPlayerWinner);
        recordMatchHistory(matchResult);
        showGameOverModel(matchResult);
        return;
      }
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
// part 3
const historyContainer = document.getElementById("history-container");
if (historyContainer) {
  let historyData = getStoreHistory();
  const searchInput = document.getElementById("search-input");
  const filterResult = document.getElementById("filter-result");
  const filterPeriod = document.getElementById("filter-period");
  const btnClearHistory = document.getElementById("btn-clear-history");
  const applyFilters = () => {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const selectedResult = filterResult ? filterResult.value : "ALL";
    const selectedPeriod = filterPeriod ? filterPeriod.value : "ALL";
    const now = new Date();
    const filtered = historyData.filter((match) => {
      const matchName = (match.playerNickname || "").toLowerCase();
      const passQuery = query === "" || matchName.includes(query);
      let passResult = true;
      if (selectedResult === "VICTOIRE") {
        passResult = match.result === "VICTOIRE";
      } else if (selectedResult === "DEFAITE") {
        passResult = match.result === "DEFAITE";
      } else if (selectedResult === "ABANDON") {
        passResult = match.result === "ABANDON";
      } else if (selectedResult === "EGALITE") {
        passResult = match.result === "EGALITE";
      }
      let passPeriod = true;
      const matchTimestamp = Number(match.id.replace("m_", ""));
      const matchDate = new Date(matchTimestamp);
      if (selectedPeriod === "TODAY") {
        passPeriod = matchDate.toDateString() === now.toDateString();
      } else if (selectedPeriod === "7DAYS") {
        const diffInDays = (now - matchDate) / (1000 * 60 * 60 * 24);
        passPeriod = diffInDays <= 7;
      }
      return passQuery && passResult && passPeriod;
    });
    displayHistory(filtered);
  };
  displayHistory(historyData);
  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (filterResult) filterResult.addEventListener("change", applyFilters);
  if (filterPeriod) filterPeriod.addEventListener("change", applyFilters);
  historyContainer.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest('button[data-action="delete-single-match"]');
    if (!deleteBtn) return;
    const matchId = deleteBtn.getAttribute("data-id");
    const confirmDelete = confirm("Voulez-vous supprimer cette partie de l'historique ?");
    if (!confirmDelete) return;
    historyData = deleteMatchFromHistory(matchId);
    applyFilters();
  });
  if (btnClearHistory) {
    btnClearHistory.addEventListener("click", () => {
      if (historyData.length === 0) return;
      const confirmClear = confirm("Voulez-vous vraiment effacer tout l'historique des parties ?");
      if (!confirmClear) return;
      clearStoreHistory();
      historyData = [];
      applyFilters();
    });
  }
}
