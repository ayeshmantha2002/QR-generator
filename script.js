document.getElementById("generate").addEventListener("click", function () {
  const text = document.getElementById("text").value;
  if (text.trim() === "") {
    alert("Please enter text to generate QR code");
    return;
  }

  const logoInput = document.getElementById("logo-input");
  if (logoInput.files.length === 0) {
    alert("Please select a logo image");
    return;
  }

  const qrcodeContainer = document.getElementById("qrcode");
  qrcodeContainer.innerHTML = ""; // Clear previous QR code if any

  const qrcode = new QRCode(qrcodeContainer, {
    text: text,
    width: 256,
    height: 256,
  });

  // Add a timeout to ensure the QR code is rendered before adding the logo
  setTimeout(() => {
    const canvas = qrcodeContainer.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 50; // Adjust the radius as needed

    const logo = new Image();
    logo.src = URL.createObjectURL(logoInput.files[0]);
    logo.onload = function () {
      // Draw the circle background for the logo
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = "white";
      ctx.fill();

      // Draw the logo image inside the circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 2, 0, 2 * Math.PI, false); // Subtract 2 for border width
      ctx.clip();
      ctx.drawImage(
        logo,
        centerX - radius + 2,
        centerY - radius + 2,
        (radius - 2) * 2,
        (radius - 2) * 2
      );
      ctx.restore();

      // Draw the border
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";
      ctx.stroke();

      // Show the download button
      const downloadButton = document.getElementById("download");
      downloadButton.style.display = "block";
      downloadButton.addEventListener("click", function () {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "qrcode.png";
        link.click();
      });
    };
  }, 100);
});
