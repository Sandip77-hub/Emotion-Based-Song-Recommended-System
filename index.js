let form = document.querySelector("#upload");
let file = document.querySelector("#file");
let app = document.querySelector("#app");
let mood = document.querySelector("#result");
let songsBox = document.querySelector("#songs");

const url = "http://localhost:3001/predict";


function displayRecommendedSongs(songs_arr) {
  const num = songs_arr.length;
  for (let i = 0; i < num; i++) {
    let song_element = document.createElement("div");
    song_element.className = "song";
    song_element.innerHTML = `<a href=${songs_arr[i].url} target="_blank">${songs_arr[i].name}</a>`;
    songsBox.appendChild(song_element);
  }
}

function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function logFile(event) {
  let str = event.target.result;
  let img = document.createElement("img");
  img.src = str;
  img.height = 100;
  app.append(img);
}

const handleSubmit = (event) => {
  event.preventDefault();
  if (!file.value.length) return;

  // Create a new FileReader() object
  let reader = new FileReader();

  // Setup the callback event to run when the file is read
  reader.onload = logFile;

  // Read the file
  reader.readAsDataURL(file.files[0]);

  imageInput = file.files[0];
  convertImageToBase64(imageInput).then((base64Image) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64Image }),
    })
      .then((response) => response.json())
      .then((data) => {
        mood.innerHTML = data.mood;
        displayRecommendedSongs(data.songs_recommendation);
      })
      .catch((error) => {
        console.error(error);
      });
  });
};

form.addEventListener("submit", handleSubmit);

function openCamera() {
  const app = document.getElementById("app");
  const cameraContainer = document.getElementById("cameraContainer");

  // Remove existing camera element if any
  if (cameraContainer.firstChild) {
    cameraContainer.firstChild.remove();
  }

  // Create video and canvas elements
  const video = document.createElement("video");
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Set video constraints
  const constraints = { video: true };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      video.srcObject = stream;
      video.autoplay = true;

      // Append video element to the camera container
      cameraContainer.appendChild(video);

      // Function to capture the picture
      function capturePicture() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Stop the video stream
        stream.getTracks().forEach((track) => track.stop());

        // Remove the video element
        video.remove();

        // Append the captured image to the app container
        app.appendChild(canvas);

        // Hide the camera button
        document.querySelector("button").style.display = "none";
      }

      // Create capture button
      const captureButton = document.createElement("button");
      captureButton.innerText = "Capture";
      captureButton.addEventListener("click", capturePicture);

      // Append capture button to the camera container
      cameraContainer.appendChild(captureButton);
    })
    .catch(function (error) {
      console.error("Error accessing the camera: ", error);
    });
}

// ...

const fileInput = document.getElementById("file");

function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      mood.innerHTML = data.mood;
      displayRecommendedSongs(data.songs_recommendation);
    })
    .catch((error) => {
      console.error(error);
    });
}

function capturePicture() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw the video frame onto the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Stop the video stream
  stream.getTracks().forEach((track) => track.stop());

  // Remove the video element
  video.remove();

  // Append the captured image to the app container
  app.appendChild(canvas);

  // Create a file from the captured image data
  canvas.toBlob((blob) => {
    const file = new File([blob], "captured_image.png");
    fileInput.files = [file];

    // Upload the captured image and perform prediction
    uploadImage(file);
  });

  // Hide the camera button
  document.querySelector("button").style.display = "none";
}

// ...



