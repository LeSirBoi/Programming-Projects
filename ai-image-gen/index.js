const express = require("express");
const path = require("path");

require("dotenv").config();

const app = express();

// middleware
app.use(express.json());
app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/generate", async (req, res) => {
  model = req.body.selectedModel;
  promptText = req.body.promptText;
  aspectRatio = req.body.aspectRatio;
  imageCount = req.body.imageCount;

  console.log(model, imageCount, aspectRatio, promptText);
  // calculate dimensions based on aspect ratio
  const getDimensions = (aspectRatio, baseSize = 256) => {
    const [width, height] = aspectRatio.split("/").map(Number);
    const scale = baseSize / Math.sqrt(width * height);

    let newWidth = Math.round(width * scale);
    let newHeight = Math.round(height * scale);

    newWidth = Math.floor(newWidth / 16) * 16;
    newHeight = Math.floor(newHeight / 16) * 16;

    return { width: newWidth, height: newHeight };
  };

  const MODEL_URL = `https://router.huggingface.co/hf-inference/models/${model}`;
  const { width, height } = getDimensions(aspectRatio);
  const imgArr = [];

  // send API request to AI model
  const imagePromises = Array.from({ length: imageCount }, async (_, i) => {
    try {
      const response = await fetch(MODEL_URL, {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
          "x-use-cache": "false",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: promptText,
          parameters: { width, height },
        }),
      });

      if (!response.ok) throw new Error((await response.json())?.error);

      const result = await response.arrayBuffer();
      const buffer = Buffer.from(result);
      imgArr.push(buffer.toString("base64"));
    } catch (error) {
      imgArr.push("error");
      console.log(error);
    }
  });

  await Promise.allSettled(imagePromises);

  res.json(imgArr);
  console.log("Finished");
});

app.listen(5500, () => {
  console.log("Server is listening on port 5500");
});
