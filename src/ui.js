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
