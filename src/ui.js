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
          <span class="w-10 h-10 aspect-square flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800 text-xl">
            ${player.avatar}
          </span>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="font-bold text-sm ${isSelected ? "text-amber-400" : "text-white"}">${player.nickname}</span>
              ${isSelected ? `<span class="text-[9px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-black">ACTIF</span>` : ""}
            </div>
            <div class="flex  flex-col  items-start  gap-2">
            <span class="text-[11px] block text-slate-500">Parties : 0 </span>
            <span class="text-[11px] block text-slate-500"> Créé le : ${player.createdAt}</span>
          </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" data-action="select" data-id="${player.id}" class="px-3 py-1 rounded-lg text-xs font-bold transition ${isSelected ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:text-white"}">
            ${isSelected ? "Actif" : "Choisir"}
          </button>
          <button type="button" data-action="delete" data-id="${player.id}" class=" px-3 py-2 rounded-lg text-xs font-bold transition bg-slate-800   text-slate-400 hover:text-rose-400" title="Supprimer">
            Supprimer 🗑️
          </button>
          <button type="button" data-action="edit" data-id="${player.id}" class="px-3 py-2 rounded-lg text-xs font-bold transition bg-slate-800   text-slate-400 hover:text-" title="Modifier">
            Modifier ✏️
          </button>
        </div>
      </div>
    `;
  });
  updateActivePlayerHeader(playerList, activePlayerId);
};
