const themeToggle = document.querySelector(".theme-toggle");
const promptInput = document.querySelector(".prompt-input");
const promptBtn = document.querySelector(".prompt-btn");
const generateBtn = document.querySelector(".generate-btn");
const promptForm = document.querySelector(".prompt-form");
const modelSelect = document.getElementById("model-select");
const countSelect = document.getElementById("count-select");
const ratioSelect = document.getElementById("ratio-select");
const gridGallery = document.querySelector(".gallery-grid");

const examplePrompts = [
  "A magic forest with glowing plants and fairy homes among giant mushrooms",
  "An old steampunk airship floating through golden clouds at sunset",
  "A future Mars colony with glass domes and gardens against red mountains",
  "A dragon sleeping on gold coins in a crystal cave",
  "An underwater kingdom with merpeople and glowing coral buildings",
  "A floating island with waterfalls pouring into clouds below",
  "A witch's cottage in fall with magic herbs in the garden",
  "A robot painting in a sunny studio with art supplies around it",
  "A magical library with floating glowing books and spiral staircases",
  "A Japanese shrine during cherry blossom season with lanterns and misty mountains",
  "A cosmic beach with glowing sand and an aurora in the night sky",
  "A medieval marketplace with colorful tents and street performers",
  "A cyberpunk city with neon signs and flying cars at night",
  "A peaceful bamboo forest with a hidden ancient temple",
  "A giant turtle carrying a village on its back in the ocean",
];

(() => {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const isDarkTheme =
    savedTheme === "dark" || (!savedTheme && systemPrefersDark);
  document.body.classList.toggle("dark-theme", isDarkTheme);
  themeToggle.querySelector("i").className = isDarkTheme
    ? "fa-solid fa-sun"
    : "fa-solid fa-moon";
})();

// Switch between light and dark mode
const toggleTheme = () => {
  const isDarkTheme = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
  themeToggle.querySelector("i").className = isDarkTheme
    ? "fa-solid fa-sun"
    : "fa-solid fa-moon";
};

// Create cards with loading spinners
const createCards = (selectedModel, imageCount, aspectRatio, promptText) => {
  gridGallery.innerHTML = "";

  for (let i = 0; i < imageCount; i++) {
    gridGallery.innerHTML += `<div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio}">
                        <div class="status-container">
                            <div class="spinner"></div>
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <p class="status-text">Generating...</p>
                        </div>
                    </div>`;
  }

  formObj = {
    selectedModel: selectedModel,
    imageCount: imageCount,
    aspectRatio: aspectRatio,
    promptText: promptText,
  };

  generateBtn.setAttribute("disabled", "true");

  const xhr = new XMLHttpRequest();

  xhr.open("POST", "/generate", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.responseType = "json";
  xhr.onload = async function (e) {
    // Check the return status
    if (e.currentTarget.status === 200) {
      generateBtn.removeAttribute("disabled");
      imgArr = xhr.response;
      imgArr.forEach((b64, i) => {
        if (b64 == "error") {
          const imgCard = document.getElementById(`img-card-${i}`);
          imgCard.classList.replace("loading", "error");
          imgCard.querySelector(".status-text").textContent =
            "Generation failed.";
        } else {
          const blob = new Blob([
            Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)),
          ]);
          const url = URL.createObjectURL(blob);
          updateCard(i, url);
        }
      });
    } else {
      // A critical error has occurred
      console.log("An error has occurred.");
    }
  };

  xhr.send(JSON.stringify(formObj));
};

// Replace loading cards with retrieved images
const updateCard = (index, url) => {
  const imgCard = document.getElementById(`img-card-${index}`);
  if (!imgCard) return;

  imgCard.classList.remove("loading");
  imgCard.innerHTML = `<img src="${url}" class="result-img" />
                        <div class="img-overlay">
                            <a href="${url}" class="download-btn" download="${Date.now()}.png">
                                <i class="fa-solid fa-download"></i>
                            </a>
                        </div>`;
};

// Form handling
const handleFormSubmit = (e) => {
  e.preventDefault();

  const selectedModel = modelSelect.value;
  const imageCount = parseInt(countSelect.value) || 1;
  const aspectRatio = ratioSelect.value || "1/1";
  const promptText = promptInput.value.trim();

  createCards(selectedModel, imageCount, aspectRatio, promptText);
};

// Generate random prompt
promptBtn.addEventListener("click", () => {
  const prompt =
    examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
  promptInput.value = prompt;
  promptInput.focus();
});

promptForm.addEventListener("submit", handleFormSubmit);
themeToggle.addEventListener("click", toggleTheme);
