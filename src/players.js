import { getStoredActivePlayer, getStoredPlayers, saveActivePlayerId, saveToLocaleStorage } from "./storage.js";
import { displayPlayers } from "./ui.js";
export const playerForm = document.getElementById("player-form");
export const inputName = document.getElementById("nickname-input");
export const nicknameError = document.getElementById("nickname-error");
export const btnSubmit = document.querySelector('button[type="submit"]');
export const nicknameRegex = /^[A-Za-z0-9]{3,15}$/;
export let playerList = getStoredPlayers();
export let activePlayerId = getStoredActivePlayer();
export let editingPlayerId = null;
export const selectPlayer = (id) => {
  activePlayerId = id;
  saveActivePlayerId(id);
  displayPlayers(playerList, activePlayerId);
};
export const updatePlayer = (id) => {
  const playerToEdit = playerList.find((p) => p.id === id);
  if (!playerToEdit) return;
  editingPlayerId = id;
  inputName.value = playerToEdit.nickname;
  playerForm.elements["avatar"].value = playerToEdit.avatar;
  btnSubmit.textContent = "Metter à jour";
  nicknameError.textContent = "";
  inputName.classList.remove("border-rose-500");
};
export const deletePlayer = (id) => {
  const confirmDelete = confirm("Voulez-vous vraiment supprimer ce profil ?");
  if (!confirmDelete) return;
  playerList = playerList.filter((p) => p.id !== id);
  saveToLocaleStorage(playerList);
  if (activePlayerId === id) {
    activePlayerId = null;
    saveActivePlayerId(null);
  }
  displayPlayers(playerList, activePlayerId);
};
export let formValidation = () => {
  const nicknameValue = inputName.value.trim();
  const selectedAvatar = playerForm.elements["avatar"].value;
  if (nicknameValue === "" || !nicknameRegex.test(nicknameValue)) {
    nicknameError.textContent = "le pseudo driot contenir 3 à 15 caractéres";
    inputName.classList.add("border-rose-500");
    return;
  }
  const isDuplicate = playerList.some(
    (p) => p.nickname.toLowerCase() === nicknameValue.toLowerCase() && p.id !== editingPlayerId,
  );
  if (isDuplicate) {
    nicknameError.textContent = "Ce pseudo est déjà pris par un autre joueur.";
    inputName.classList.add("border-rose-500");
    return;
  }
  nicknameError.textContent = "";
  inputName.classList.remove("border-rose-500");
  if (editingPlayerId) {
    const palyerIndex = playerList.findIndex((p) => p.id === editingPlayerId);
    if (palyerIndex !== -1) {
      playerList[palyerIndex].nickname = nicknameValue;
      playerList[palyerIndex].avatar = selectedAvatar;
    }
    editingPlayerId = null;
    btnSubmit.textContent = "Créé un profil";
    saveToLocaleStorage(playerList);
    displayPlayers(playerList, activePlayerId);
  } else {
    const newPlayer = {
      id: `p_${Date.now()}`,
      nickname: `${nicknameValue}`,
      avatar: selectedAvatar,
      createdAt: new Date().toISOString().split("T")[0],
    };
    playerList.push(newPlayer);
    saveToLocaleStorage(playerList);
    if (!activePlayerId) {
      selectPlayer(newPlayer.id);
    } else {
      displayPlayers(playerList, activePlayerId);
    }
  }
  inputName.value = "";
};
