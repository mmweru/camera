// ColorGrading.tsx
import React from 'react';
import { Surface } from 'gl-react-expo';
import { Shaders, Node } from 'gl-react';

// Define props interface
interface ColorGradingProps {
    children: React.ReactNode; // You may specify a more specific type depending on what 'children' is expected to be
    redAdjustment: number;      // Adjusted to number type
    greenAdjustment: number;    // Adjusted to number type
    blueAdjustment: number;     // Adjusted to number type
}

// Define shaders for color grading
const shaders = Shaders.create({
    colorGrading: {
        // Fragment shader for applying color grading
        frag: `
        precision mediump float;
        varying vec2 uv;
        uniform sampler2D texture;
        uniform float redAdjustment;
        uniform float greenAdjustment;
        uniform float blueAdjustment;

        void main() {
            vec4 color = texture2D(texture, uv);
            color.r += redAdjustment;
            color.g += greenAdjustment;
            color.b += blueAdjustment;
            gl_FragColor = color;
        }
        `,
    },
});

// Update ColorGrading component to use the defined props interface
const ColorGrading: React.FC<ColorGradingProps> = ({ children, redAdjustment, greenAdjustment, blueAdjustment }) => (
    <Surface>
        <Node
            shader={shaders.colorGrading}
            uniforms={{
                texture: children,
                redAdjustment,
                greenAdjustment,
                blueAdjustment,
            }}
        />
    </Surface>
);

export default ColorGrading;
