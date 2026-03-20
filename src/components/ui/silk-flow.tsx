"use client"

import type React from "react"
import { forwardRef } from "react"
import { Shader } from "react-shaders"
import { cn } from "@/lib/utils"

export interface SilkFlowProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number
}

const fragmentShader = `
// Smooth flowing silk/fabric shader — elegant, minimal, fashion-forward
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * 0.3 * u_speed;

    // Create flowing silk waves
    float wave1 = sin(uv.x * 3.0 + t) * cos(uv.y * 2.0 + t * 0.7) * 0.5;
    float wave2 = sin(uv.x * 5.0 - t * 0.5 + uv.y * 3.0) * 0.3;
    float wave3 = cos(uv.y * 4.0 + t * 0.3 + uv.x * 2.0) * 0.4;

    float pattern = wave1 + wave2 + wave3;

    // Soft cream/ivory palette — like draped silk
    vec3 col1 = vec3(0.95, 0.92, 0.88); // warm ivory
    vec3 col2 = vec3(0.85, 0.82, 0.78); // soft taupe
    vec3 col3 = vec3(0.90, 0.87, 0.83); // mid tone

    vec3 col = mix(col1, col2, smoothstep(-0.5, 0.5, pattern));
    col = mix(col, col3, smoothstep(0.0, 0.8, wave1));

    // Subtle highlight shimmer
    float highlight = pow(max(0.0, sin(uv.x * 8.0 + t + pattern * 2.0)), 8.0) * 0.08;
    col += highlight;

    // Soft vignette
    float vig = 1.0 - 0.3 * pow(length(uv - 0.5) * 1.2, 2.0);
    col *= vig;

    fragColor = vec4(col, 1.0);
}
`

export const SilkFlow = forwardRef<HTMLDivElement, SilkFlowProps>(
  ({ className, speed = 1.0, ...props }, ref) => {
    return (
      <div className={cn("w-full h-full", className)} ref={ref} {...(props as any)}>
        <Shader
          fs={fragmentShader}
          style={{ width: "100%", height: "100%" } as CSSStyleDeclaration}
          uniforms={{
            u_speed: { type: "1f", value: speed },
          }}
        />
      </div>
    )
  },
)

SilkFlow.displayName = "SilkFlow"
export default SilkFlow
