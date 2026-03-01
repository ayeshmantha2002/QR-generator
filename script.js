// --- Initial QR Setup ---
const PREVIEW_SIZE = 300;
let currentDotStyle = "square";
let currentCornerSquareStyle = "square";
let currentCornerDotStyle = "square";
let currentCropShape = "square";

let rawCroppedImage = new Image();
let croppedImageBase64 = null;

const qrCode = new QRCodeStyling({
  width: PREVIEW_SIZE,
  height: PREVIEW_SIZE,
  data: "https://axora.com",
  margin: 10,
  qrOptions: { errorCorrectionLevel: "H" },
  dotsOptions: { color: "#1a5276", type: currentDotStyle },
  cornersSquareOptions: { type: currentCornerSquareStyle, color: "#1a5276" },
  cornersDotOptions: { type: currentCornerDotStyle, color: "#1a5276" },
  backgroundOptions: { color: "#ffffff" },
  imageOptions: { crossOrigin: "anonymous", margin: 8, imageSize: 0.4 },
});

qrCode.append(document.getElementById("canvas"));

// --- DOM Elements (Color, Gradient, Shapes) ---
const colorModes = document.getElementsByName("colorMode");
const gradTypes = document.getElementsByName("gradType");
const color1Input = document.getElementById("color1");
const color2Input = document.getElementById("color2");
const bgColorInput = document.getElementById("bg-color");
const transparentBgCheck = document.getElementById("transparent-bg");
const gradientContainer = document.getElementById("gradient-color-container");
const gradientControls = document.getElementById("gradient-controls");

const gradAngleSlider = document.getElementById("grad-angle");
const angleValDisplay = document.getElementById("angle-val");
const angleControlDiv = document.getElementById("angle-control");
const gradSpreadSlider = document.getElementById("grad-spread");
const spreadValDisplay = document.getElementById("spread-val");
const radialControlDiv = document.getElementById("radial-control");

const dotStyleBtns = document.querySelectorAll("#dot-style-picker .style-btn");
const cornerSquareBtns = document.querySelectorAll(
  "#corner-square-picker .style-btn",
);
const cornerDotBtns = document.querySelectorAll(
  "#corner-dot-picker .style-btn",
);

const logoBorderControls = document.getElementById("logo-border-controls");
const logoBorderWidth = document.getElementById("logo-border-width");
const logoBorderColor = document.getElementById("logo-border-color");
const borderWidthValDisplay = document.getElementById("border-width-val");

// --- DOM Elements for Input Types (URL, Text, vCard, Wi-Fi) ---
const typeBtns = document.querySelectorAll(".type-btn");
const urlInputGroup = document.getElementById("url-input-group");
const textInputGroup = document.getElementById("text-input-group");
const vcardInputGroup = document.getElementById("vcard-input-group");
const wifiInputGroup = document.getElementById("wifi-input-group");

const qrUrlInput = document.getElementById("qr-url");
const qrTextInput = document.getElementById("qr-text");

const vcFname = document.getElementById("vc-fname");
const vcLname = document.getElementById("vc-lname");
const vcPhone = document.getElementById("vc-phone");
const vcEmail = document.getElementById("vc-email");
const vcCompany = document.getElementById("vc-company");
const vcWebsite = document.getElementById("vc-website");
const vcardInputs = [vcFname, vcLname, vcPhone, vcEmail, vcCompany, vcWebsite];

// New Wi-Fi Inputs
const wifiSsid = document.getElementById("wifi-ssid");
const wifiPassword = document.getElementById("wifi-password");
const wifiEncryption = document.getElementById("wifi-encryption");
const wifiHidden = document.getElementById("wifi-hidden");

let currentInputType = "url";

// --- Real-Time Update Logic ---
function updateQR() {
  let data = " ";

  if (currentInputType === "url") {
    data = qrUrlInput.value || " ";
  } else if (currentInputType === "text") {
    data = qrTextInput.value || " ";
  } else if (currentInputType === "vcard") {
    const f = vcFname.value.trim();
    const l = vcLname.value.trim();
    const p = vcPhone.value.trim();
    const e = vcEmail.value.trim();
    const c = vcCompany.value.trim();
    const w = vcWebsite.value.trim();
    data = `BEGIN:VCARD\nVERSION:3.0\nN:${l};${f};;;\nFN:${f} ${l}\nORG:${c}\nTEL;TYPE=CELL:${p}\nEMAIL:${e}\nURL:${w}\nEND:VCARD`;
  } else if (currentInputType === "wifi") {
    // Generate Wi-Fi Format: WIFI:T:WPA;S:mynetwork;P:mypass;;
    const s = wifiSsid.value.trim();
    const p = wifiPassword.value.trim();
    const e = wifiEncryption.value;
    const h = wifiHidden.checked ? "true" : "false";
    data = `WIFI:T:${e};S:${s};P:${p};H:${h};;`;
  }

  const isGradient =
    document.querySelector('input[name="colorMode"]:checked').value ===
    "gradient";
  const gradType = document.querySelector(
    'input[name="gradType"]:checked',
  ).value;
  const gradAngle = parseInt(gradAngleSlider.value);
  const gradSpread = parseInt(gradSpreadSlider.value) / 100;

  const color1 = color1Input.value;
  const color2 = color2Input.value;
  const isTransparent = transparentBgCheck.checked;
  const bgColor = isTransparent ? "rgba(0,0,0,0)" : bgColorInput.value;
  const activeBgCol = isTransparent ? "#ffffff" : bgColorInput.value;

  const bWidth = parseInt(logoBorderWidth.value);
  const bColor = logoBorderColor.value;

  if (rawCroppedImage.src) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = 300;
    canvas.width = size;
    canvas.height = size;
    const center = size / 2;

    if (currentCropShape === "circle") {
      const margin = 20;
      ctx.beginPath();
      ctx.arc(center, center, center, 0, 2 * Math.PI);
      ctx.fillStyle = activeBgCol;
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, center - margin, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(
        rawCroppedImage,
        margin,
        margin,
        size - margin * 2,
        size - margin * 2,
      );
      ctx.restore();

      if (bWidth > 0) {
        ctx.beginPath();
        ctx.arc(center, center, center - margin, 0, 2 * Math.PI);
        ctx.lineWidth = bWidth;
        ctx.strokeStyle = bColor;
        ctx.stroke();
      }
    } else {
      ctx.drawImage(rawCroppedImage, 0, 0, size, size);
      if (bWidth > 0) {
        ctx.lineWidth = bWidth;
        ctx.strokeStyle = bColor;
        ctx.strokeRect(bWidth / 2, bWidth / 2, size - bWidth, size - bWidth);
      }
    }
    croppedImageBase64 = canvas.toDataURL("image/png");
  } else {
    croppedImageBase64 = null;
  }

  let options = {
    data: data,
    backgroundOptions: { color: bgColor },
    image: croppedImageBase64 || "",
    dotsOptions: { type: currentDotStyle },
    cornersSquareOptions: { type: currentCornerSquareStyle },
    cornersDotOptions: { type: currentCornerDotStyle },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: currentCropShape === "circle" ? 0 : 8,
      hideBackgroundDots: currentCropShape !== "circle",
      imageSize: 0.4,
    },
  };

  if (isGradient) {
    let gradientConfig = {
      type: gradType,
      colorStops: [
        { offset: 0, color: color1 },
        { offset: gradSpread, color: color2 },
      ],
    };
    if (gradType === "linear") {
      gradientConfig.rotation = (gradAngle * Math.PI) / 180;
    }
    options.dotsOptions.gradient = gradientConfig;
    options.cornersSquareOptions.gradient = gradientConfig;
    options.cornersDotOptions.gradient = gradientConfig;
  } else {
    options.dotsOptions.color = color1;
    options.dotsOptions.gradient = null;
    options.cornersSquareOptions.color = color1;
    options.cornersSquareOptions.gradient = null;
    options.cornersDotOptions.color = color1;
    options.cornersDotOptions.gradient = null;
  }

  qrCode.update(options);
}

// --- Tab Switching Logic ---
typeBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    typeBtns.forEach((b) => b.classList.remove("active"));
    e.currentTarget.classList.add("active");
    currentInputType = e.currentTarget.dataset.type;

    urlInputGroup.style.display = currentInputType === "url" ? "block" : "none";
    textInputGroup.style.display =
      currentInputType === "text" ? "block" : "none";
    vcardInputGroup.style.display =
      currentInputType === "vcard" ? "block" : "none";
    if (wifiInputGroup)
      wifiInputGroup.style.display =
        currentInputType === "wifi" ? "block" : "none";

    updateQR();
  });
});

// Update QR on typing
[qrUrlInput, qrTextInput, ...vcardInputs, wifiSsid, wifiPassword].forEach(
  (input) => {
    if (input) input.addEventListener("input", updateQR);
  },
);
if (wifiEncryption) wifiEncryption.addEventListener("change", updateQR);
if (wifiHidden) wifiHidden.addEventListener("change", updateQR);

// --- Text Formatting Tools ---
const toolUpper = document.getElementById("tool-upper");
const toolLower = document.getElementById("tool-lower");
const toolBullet = document.getElementById("tool-bullet");
const toolClear = document.getElementById("tool-clear");

if (toolUpper && toolLower && toolBullet && toolClear) {
  toolUpper.addEventListener("click", () => {
    qrTextInput.value = qrTextInput.value.toUpperCase();
    updateQR();
  });
  toolLower.addEventListener("click", () => {
    qrTextInput.value = qrTextInput.value.toLowerCase();
    updateQR();
  });
  toolBullet.addEventListener("click", () => {
    const currentText = qrTextInput.value;
    qrTextInput.value = currentText === "" ? "• " : currentText + "\n• ";
    qrTextInput.focus();
    updateQR();
  });
  toolClear.addEventListener("click", () => {
    qrTextInput.value = "";
    updateQR();
  });
}

// --- General UI Listeners ---
logoBorderWidth.addEventListener("input", (e) => {
  borderWidthValDisplay.textContent = e.target.value;
  updateQR();
});
logoBorderColor.addEventListener("input", updateQR);

colorModes.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const isGrad = e.target.value === "gradient";
    gradientContainer.style.display = isGrad ? "block" : "none";
    gradientControls.style.display = isGrad ? "block" : "none";
    updateQR();
  });
});

gradTypes.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const isRadial = e.target.value === "radial";
    angleControlDiv.style.display = isRadial ? "none" : "block";
    radialControlDiv.style.display = isRadial ? "block" : "none";
    updateQR();
  });
});

gradAngleSlider.addEventListener("input", (e) => {
  angleValDisplay.textContent = e.target.value;
  updateQR();
});
gradSpreadSlider.addEventListener("input", (e) => {
  spreadValDisplay.textContent = e.target.value;
  updateQR();
});
transparentBgCheck.addEventListener("change", (e) => {
  bgColorInput.disabled = e.target.checked;
  updateQR();
});

function setupVisualPicker(buttons, callback) {
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      buttons.forEach((b) => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      callback(e.currentTarget.dataset.value);
    });
  });
}

setupVisualPicker(dotStyleBtns, (val) => {
  currentDotStyle = val;
  updateQR();
});
setupVisualPicker(cornerSquareBtns, (val) => {
  currentCornerSquareStyle = val;
  updateQR();
});
setupVisualPicker(cornerDotBtns, (val) => {
  currentCornerDotStyle = val;
  updateQR();
});

[color1Input, color2Input, bgColorInput].forEach((input) => {
  input.addEventListener("input", updateQR);
});

// --- Logo Cropping Setup ---
let cropper;
const modal = document.getElementById("crop-modal");
const imageToCrop = document.getElementById("image-to-crop");
const logoUpload = document.getElementById("logo-upload");
const removeLogoBtn = document.getElementById("remove-logo");
const cropShapeBtns = document.querySelectorAll(
  "#crop-shape-picker .style-btn",
);

setupVisualPicker(cropShapeBtns, (val) => {
  currentCropShape = val;
  const cropperContainer = document.querySelector(".cropper-container");
  if (cropperContainer) {
    if (val === "circle") cropperContainer.classList.add("cropper-circle");
    else cropperContainer.classList.remove("cropper-circle");
  }
});

logoUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      imageToCrop.src = event.target.result;
      modal.style.display = "block";
      if (cropper) cropper.destroy();
      cropper = new Cropper(imageToCrop, {
        aspectRatio: 1,
        viewMode: 1,
        background: false,
        ready: function () {
          const cropperContainer = document.querySelector(".cropper-container");
          if (currentCropShape === "circle")
            cropperContainer.classList.add("cropper-circle");
        },
      });
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("crop-btn").addEventListener("click", () => {
  const squareCanvas = cropper.getCroppedCanvas({ width: 300, height: 300 });
  rawCroppedImage.onload = () => {
    updateQR();
    modal.style.display = "none";
    removeLogoBtn.style.display = "inline-flex";
    logoBorderControls.style.display = "block";
  };
  rawCroppedImage.src = squareCanvas.toDataURL("image/png");
});

document.getElementById("close-modal").addEventListener("click", () => {
  modal.style.display = "none";
  logoUpload.value = "";
});

removeLogoBtn.addEventListener("click", () => {
  rawCroppedImage = new Image();
  croppedImageBase64 = null;
  updateQR();
  removeLogoBtn.style.display = "none";
  logoBorderControls.style.display = "none";
  logoBorderWidth.value = 0;
  borderWidthValDisplay.textContent = "0";
  logoUpload.value = "";
});

// --- Download Function ---
function downloadQR(extension) {
  const size = parseInt(document.getElementById("download-size").value);
  const exportBgColor = transparentBgCheck.checked
    ? "rgba(0,0,0,0)"
    : bgColorInput.value;

  qrCode.update({
    width: size,
    height: size,
    backgroundOptions: { color: exportBgColor },
  });
  qrCode
    .download({ name: `Axora-Pro-QR-${size}p`, extension: extension })
    .then(() => {
      qrCode.update({
        width: PREVIEW_SIZE,
        height: PREVIEW_SIZE,
        backgroundOptions: { color: exportBgColor },
      });
    });
}

// --- Wizard & Step Navigation Logic ---
const btnNext = document.getElementById("btn-next");
const btnBack = document.getElementById("btn-back");
const step1Content = document.getElementById("step-1-content");
const step2Content = document.getElementById("step-2-content");
const indStep1 = document.getElementById("indicator-step-1");
const indStep2 = document.getElementById("indicator-step-2");

if (btnNext) {
  btnNext.addEventListener("click", () => {
    let isValid = false;

    if (currentInputType === "url") {
      if (qrUrlInput.value.trim() !== "") {
        isValid = true;
        qrUrlInput.classList.remove("input-error");
      } else {
        qrUrlInput.classList.add("input-error");
        qrUrlInput.focus();
      }
    } else if (currentInputType === "text") {
      if (qrTextInput.value.trim() !== "") {
        isValid = true;
        qrTextInput.classList.remove("input-error");
      } else {
        qrTextInput.classList.add("input-error");
        qrTextInput.focus();
      }
    } else if (currentInputType === "vcard") {
      if (vcFname && vcFname.value.trim() !== "") {
        isValid = true;
        vcFname.classList.remove("input-error");
      } else {
        vcFname.classList.add("input-error");
        vcFname.focus();
      }
    } else if (currentInputType === "wifi") {
      // Wi-Fi Validation: Network Name (SSID) is required
      if (wifiSsid && wifiSsid.value.trim() !== "") {
        isValid = true;
        wifiSsid.classList.remove("input-error");
      } else {
        wifiSsid.classList.add("input-error");
        wifiSsid.focus();
      }
    }

    if (isValid) {
      step1Content.style.display = "none";
      step2Content.style.display = "block";
      indStep1.classList.remove("active");
      indStep2.classList.add("active");
      updateQR();
    }
  });
}

if (btnBack) {
  btnBack.addEventListener("click", () => {
    step2Content.style.display = "none";
    step1Content.style.display = "block";
    indStep2.classList.remove("active");
    indStep1.classList.add("active");
  });
}

if (qrUrlInput)
  qrUrlInput.addEventListener("input", () =>
    qrUrlInput.classList.remove("input-error"),
  );
if (qrTextInput)
  qrTextInput.addEventListener("input", () =>
    qrTextInput.classList.remove("input-error"),
  );
if (vcFname)
  vcFname.addEventListener("input", () =>
    vcFname.classList.remove("input-error"),
  );
if (wifiSsid)
  wifiSsid.addEventListener("input", () =>
    wifiSsid.classList.remove("input-error"),
  );
