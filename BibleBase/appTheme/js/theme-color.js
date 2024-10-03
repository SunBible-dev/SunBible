const redSlider = document.getElementById("RGB_Red");
const greenSlider = document.getElementById("RGB_Green");
const blueSlider = document.getElementById("RGB_Blue");
const redText = document.getElementById("RGB_Red_Text");
const greenText = document.getElementById("RGB_Green_Text");
const blueText = document.getElementById("RGB_Blue_Text");
const hexText = document.getElementById("RGB_Hex_Text");

const defaultTheme = document.getElementById("defaultTheme");
const lightTheme = document.getElementById("lightTheme");
const darkTheme = document.getElementById("darkTheme");

function updateColor() {
    const redValue = redSlider.value;
    const greenValue = greenSlider.value;
    const blueValue = blueSlider.value;

    redText.value = redValue;
    greenText.value = greenValue;
    blueText.value = blueValue;

    const hexColor = `#${(1 << 24 | redValue << 16 | greenValue << 8 | blueValue).toString(16).slice(1)}`;
    hexText.value = hexColor;

    document.body.style.backgroundColor = `rgb(${redValue}, ${greenValue}, ${blueValue})`;
}

function updateSlidersFromHex() {
    const hexValue = hexText.value;
    const rgbValues = hexToRgb(hexValue);
    if (rgbValues) {
        redSlider.value = rgbValues.r;
        greenSlider.value = rgbValues.g;
        blueSlider.value = rgbValues.b;
        updateColor();
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

function setThemeColor(hexColor) {
    hexText.value = hexColor;
    updateSlidersFromHex();
}

defaultTheme.addEventListener("click", () => setThemeColor("#ffc8c8"));
lightTheme.addEventListener("click", () => setThemeColor("#ffffff"));
darkTheme.addEventListener("click", () => setThemeColor("#000000"));

redSlider.addEventListener("input", updateColor);
greenSlider.addEventListener("input", updateColor);
blueSlider.addEventListener("input", updateColor);

redText.addEventListener("input", () => {
    redSlider.value = redText.value;
    updateColor();
});
greenText.addEventListener("input", () => {
    greenSlider.value = greenText.value;
    updateColor();
});
blueText.addEventListener("input", () => {
    blueSlider.value = blueText.value;
    updateColor();
});

hexText.addEventListener("input", updateSlidersFromHex);

// Initialize color on page load
updateColor();
