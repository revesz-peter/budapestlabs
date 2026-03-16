"use client"

import type React from "react"
import { forwardRef } from "react"
import { Shader } from "react-shaders"
import { cn } from "@/lib/utils"

export interface WavesShadersProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Animation speed
   * @default 1.0
   */
  speed?: number

  /**
   * Wave intensity and brightness
   * @default 1.0
   */
  intensity?: number

  /**
   * Color cycling rate
   * @default 1.0
   */
  colorVariation?: number
}

const fragmentShader = `
// Plasma Waves Shader
// Original by Jasmine, https://www.shadertoy.com/view/ltXczj
// Licensed under Creative Commons CC BY-NC-SA 3.0
// Modified for React implementation

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    float time = iTime * u_speed;
    vec3 col = vec3(0.0);

    // Create multiple plasma layers
    for (int i = 0; i < 4; i++) {
        float fi = float(i);

        // Layer parameters
        float freq = 1.0 + fi * 0.5;
        float phase = time * (0.5 + fi * 0.2);

        // Plasma wave calculation
        float wave1 = sin(uv.x * freq * 3.0 + phase);
        float wave2 = sin(uv.y * freq * 2.0 + phase * 1.3);
        float wave3 = sin((uv.x + uv.y) * freq * 1.5 + phase * 0.8);
        float wave4 = sin(length(uv) * freq * 4.0 + phase * 1.7);

        // Combine waves
        float plasma = (wave1 + wave2 + wave3 + wave4) * 0.25;

        // Create color based on plasma value and layer
        vec3 layerCol = vec3(
            sin(plasma * 3.14159 + fi * 2.0 + time * u_colorVariation),
            sin(plasma * 3.14159 + fi * 2.0 + 2.094 + time * u_colorVariation * 0.8),
            sin(plasma * 3.14159 + fi * 2.0 + 4.188 + time * u_colorVariation * 1.2)
        ) * 0.5 + 0.5;

        // Layer intensity falloff
        float intensity = 1.0 / (1.0 + fi * 0.3);

        // Add layer to final color
        col += layerCol * intensity * u_intensity;
    }

    // Add center glow
    float centerGlow = 1.0 - length(uv) * 0.8;
    centerGlow = max(0.0, centerGlow);
    col += vec3(0.1, 0.2, 0.4) * centerGlow * 0.3;

    // Final color adjustments
    col = pow(col, vec3(0.8)); // Gamma correction

    fragColor = vec4(col, 1.0);
}
`

export const WavesShaders = forwardRef<HTMLDivElement, WavesShadersProps>(
  ({ className, speed = 1.0, intensity = 1.0, colorVariation = 1.0, ...props }, ref) => {
    return (
      <div className={cn("w-full h-full", className)} ref={ref} {...(props as any)}>
        <Shader
          fs={fragmentShader}
          style={{ width: "100%", height: "100%" } as CSSStyleDeclaration}
          uniforms={{
            u_speed: { type: "1f", value: speed },
            u_intensity: { type: "1f", value: intensity },
            u_colorVariation: { type: "1f", value: colorVariation },
          }}
        />
      </div>
    )
  },
)

WavesShaders.displayName = "WavesShaders"

export default WavesShaders
