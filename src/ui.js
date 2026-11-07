import { activePlayerId, playerList } from "./players.js";
const playersContainer = document.getElementById("players-list-container");
const activePlayerSlot = document.getElementById("active-player-slot");
export const updateActivePlayerHeader = (playerList, activePlayerId) => {
  const activePlayer = playerList.find((player) => player.id === activePlayerId);
  if (!activePlayer) {
    activePlayerSlot.innerHTML = `
      <span class="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-full font-semibold">
        Aucun joueur sélectionné
      </span>
    `;
    return;
  }
  activePlayerSlot.innerHTML = `
    <div class="flex items-center gap-2 bg-slate-900 border border-amber-500/40 px-3 py-1.5 rounded-full text-xs">
      <span class="text-base">${activePlayer.avatar}</span>
      <span class="font-bold text-amber-400">${activePlayer.nickname}</span>
    </div>
  `;
};
export const displayPlayers = (playerList, activePlayerId) => {
  if (!playersContainer) return;
  playersContainer.innerHTML = "";
  if (playerList.length === 0) {
    playersContainer.innerHTML = `<p class="text-xs text-slate-500">Aucun profil enregistré pour le moment.</p>`;
    updateActivePlayerHeader(playerList, activePlayerId);
    return;
  }
  playerList.forEach((player) => {
    const isSelected = player.id === activePlayerId;
    playersContainer.innerHTML += `
      <div class="p-3.5 border rounded-xl flex items-center justify-between transition ${isSelected ? "border-amber-500 bg-amber-500/10" : "border-slate-800 bg-slate-900/60"}">
        <div class="flex items-center gap-3">
          <span class="w-15 h-15 aspect-square flex items-center justify-center rounded-xl bg-slate-950 border-2 border-slate-600 text-xl">
            ${player.avatar}
          </span>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="font-bold text-sm ${isSelected ? "text-amber-400" : "text-white"}">${player.nickname}</span>
              ${isSelected ? `<span class="text-[9px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-black">ACTIF</span>` : ""}
            </div>
            <div class="flex  flex-col  items-start  gap-2">
            <span class="text-[11px] block text-slate-500">Parties : ${player.gamesPlayer}</span>
            <span class="text-[11px] block text-slate-500"> Créé le : ${player.createdAt}</span>
          </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" data-action="select" data-id="${player.id}" class="px-3.5 py-2 rounded-lg text-xs font-bold transition ${isSelected ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:text-white hover:border-2 hover:bg-slate-950 "}">
            ${isSelected ? "Actif" : "Choisir"}
          </button>
          <button type="button" data-action="delete" data-id="${player.id}" class=" px-3 py-2 rounded-lg text-xs font-bold transition bg-slate-800   text-slate-400 hover:text-red-700 hover:border-2 hover:border-red-700 hover:bg-red-300 title="Supprimer">
          🗑️ Supprimer
          </button>
          <button type="button" data-action="edit" data-id="${player.id}" class="px-3 py-2 rounded-lg text-xs font-bold transition bg-slate-800   text-slate-400 hover:text-orange-600 hover:border-2 hover:border-orange-600 hover:bg-orange-100" title="Modifier">
            ✏️ Modifier
          </button>
        </div>
      </div>
    `;
  });
  updateActivePlayerHeader(playerList, activePlayerId);
};
// add name Player Heads-Up Display
export const namePlayer = () => {
  const playerName = document.getElementById("player-hud-name");
  if (!playerName) return;
  const player = playerList.find((p) => p.id === activePlayerId);
  if (!player) {
    playerName.textContent = "Joueur inconnu";
    return;
  }
  playerName.textContent = `${player.avatar} ${player.nickname}`;
};
// check player active
export const checkPlayerActive = () => {
  const missing = document.getElementById("missing-player-modal");
  if (!missing) return;
  if (!activePlayerId) {
    missing.classList.remove("hidden");
    missing.classList.add("flex");
  } else {
    missing.classList.add("hidden");
    missing.classList.remove("flex");
  }
};
export const renderPlayerHand = (cards) => {
  const playerHandElement = document.getElementById("player-hand");
  if (!playerHandElement) return;
  playerHandElement.innerHTML = "";
  cards.forEach((card) => {
    const cardHTML = `
      <div
        data-id="${card.id}"
        class="w-20 h-32 sm:w-24 sm:h-36 rounded-xl border border-slate-700/60 bg-slate-900 shadow-xl flex flex-col items-center justify-between p-1 cursor-pointer select-none"
      >
        <span class="text-[10px] font-bold text-slate-200 uppercase">${card.name}</span>
        <img src="${card.image}" alt="${card.name}" class="w-20 h-28 object-cover rounded pointer-events-none" />
      </div>
    `;
    playerHandElement.innerHTML += cardHTML;
  });
};
//  render Computer Hand
export const renderComputerHand = (cards) => {
  const computerHandElement = document.getElementById("computer-hand");
  const computerCardCount = document.getElementById("computer-card-count");
  if (!computerHandElement) return;
  computerHandElement.innerHTML = "";
  if (computerCardCount) {
    computerCardCount.textContent = `${cards.length} cartes`;
  }
  cards.forEach((card) => {
    const cardHTML = `
      <div
        data-id="${card.id}"
        class="w-20 h-32 sm:w-24 sm:h-36 rounded-xl border border-slate-700/60 bg-linear-to-br from-slate-900 to-slate-950 shadow-md flex flex-col items-center justify-between p-1.5 select-none transition-all"
      >
        <span class="text-[9px] font-mono font-bold self-start text-slate-600">ECS</span>
        <span class="text-xl sm:text-2xl text-slate-500">🎴</span>
        <span class="text-[8px] font-bold tracking-widest text-slate-600 uppercase">Secret</span>
      </div>
    `;
    computerHandElement.innerHTML += cardHTML;
  });
};
// part 3
export const displayHistory = (historyList) => {
  const historyContainer = document.getElementById("history-container");
  if (!historyContainer) return;
  historyContainer.innerHTML = "";
  if (!historyList || historyList.length === 0) {
    historyContainer.innerHTML = `
      <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <span class="text-4xl block mb-2">📜</span>
        <h3 class="text-sm font-bold text-white mb-1">Aucune partie enregistrée</h3>
        <p class="text-xs text-slate-500">Lancez un duel depuis la page "Duel (Jeu)" pour commencer à remplir votre historique.</p>
      </div>
    `;
    return;
  }
  historyList.forEach((match) => {
    let badgeColor = "bg-slate-800 text-slate-300 border-slate-700";
    let badgeIcon = "⚖️";
    let badgeText = "Match Nul";
    if (match.result === "VICTOIRE") {
      badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      badgeIcon = "🏆";
      badgeText = "Victoire";
    } else if (match.result === "DEFAITE") {
      badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/30";
      badgeIcon = "💀";
      badgeText = "defaite";
    } else if (match.result === "ABANDON") {
      badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/30";
      badgeIcon = "🏳️";
      badgeText = "Abondon";
    }
    const cardHTML = `
      <div class="p-4 rounded-xl border border-slate-800 bg-slate-900/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-slate-700">
        <div class="flex items-center gap-3">
          <span class="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-700 text-xl">
            ${match.playerAvatar || "👤"}
          </span>
          <div>
            <div class="flex items-center gap-2 mb-0.5">
              <span class="font-bold text-sm text-white">${match.playerNickname || "Joueur"}</span>
              <span class="text-[10px] text-slate-500 font-mono">vs Ordinateur</span>
            </div>
            <span class="text-[11px] text-slate-500 block font-mono">📅 ${match.date}</span>
          </div>
        </div>
        <div class="flex items-center justify-between sm:justify-end gap-5">
          <div class="text-right">
            <span class="text-[10px] text-slate-500 uppercase block font-semibold">Score Final</span>
            <span class="font-mono text-base font-black ${match.playerScore > match.computerScore ? "text-amber-400" : "text-slate-300"}">
              ${match.playerScore} <span class="text-slate-600">:</span> ${match.computerScore}
            </span>
          </div>
          <span class="px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${badgeColor}">
            <span>${badgeIcon}</span>
            <span>${badgeText}</span>
          </span>
        </div>
      </div>
    `;
    historyContainer.innerHTML += cardHTML;
  });
};
