const COLOUR_MATRIX = {
    original: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],

    santorini: [
        0.5, 0.5, 0, 0, 0,
        0.3, 0.4, 0.2, 0, 0,
        0.2, 0.3, 0.4, 0, 0,
        0, 0, 0, 1, 0
    ], // Adds a cool-toned filter, inspired by Santorini’s blue hues

    brightness: [
        1.2, 0, 0, 0, 0,
        0, 1.2, 0, 0, 0,
        0, 0, 1.2, 0, 0,
        0, 0, 0, 1, 0
    ], // Slight increase in brightness

    sepia: [
        0.393, 0.769, 0.189, 0, 0,
        0.349, 0.686, 0.168, 0, 0,
        0.272, 0.534, 0.131, 0, 0,
        0, 0, 0, 1, 0
    ], // Classic sepia effect for a vintage look

    grayscale: [
        0.33, 0.33, 0.33, 0, 0,
        0.33, 0.33, 0.33, 0, 0,
        0.33, 0.33, 0.33, 0, 0,
        0, 0, 0, 1, 0
    ], // Converts image to grayscale by averaging the RGB channels

    invert: [-1, 0, 0, 0, 1, 0, -1, 0, 0, 1, 0, 0, -1, 0, 1, 0, 0, 0, 1, 0], // Inverts colors

    contrast: [
        1.5, 0, 0, 0, -0.5,
        0, 1.5, 0, 0, -0.5,
        0, 0, 1.5, 0, -0.5,
        0, 0, 0, 1, 0
    ], // Increase contrast

    hueRotate: [
        0.213, 0.715, 0.072, 0, 0,
        0.213, 0.715, 0.072, 0, 0,
        0.213, 0.715, 0.072, 0, 0,
        0, 0, 0, 1, 0
    ], // Rotates the hue of the colors
};
