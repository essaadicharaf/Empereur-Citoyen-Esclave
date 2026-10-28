const playerForm =document.getElementById("player-form");
const inputName =document.getElementById("nickname-input");
const nicknameError =document.getElementById("nickname-error");
// const selectedAvatar = document.querySelector('input[name="avatar"]:checked')?.value || "👑";
const selectedAvatar = playerForm.elements["avatar"].value;
const btnSubmit =document.querySelector('button[type="submit"]');

//-----
// {
//   id: "p_1730112000000",          // identifiant unique (par ex. avec Date.now())
//   nickname: "Yanis_07",           // pseudo
//   avatar: "dragon",               // un avatar choisi dans une liste
//   createdAt: "2026-10-28"         // date de création
// }

// playerForm.addEventListener("click", function (e) {
//   console.log(selectedAvatar); 
//   console.log(selectedAvatar); 

// e.preventDefault()
// });
  console.log(selectedAvatar); 


