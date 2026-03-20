"use client"

import type React from "react"
import { forwardRef } from "react"
import { Shader } from "react-shaders"
import { cn } from "@/lib/utils"

export interface MoltenAmberProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number
}

const fragmentShader = `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
    float val = 0.0; float amp = 0.5;
    for (int i = 0; i < 5; i++) { val += amp * noise(p); p *= 2.0; amp *= 0.5; }
    return val;
}
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * 0.12 * u_speed;
    vec2 q = vec2(fbm(uv * 3.0 + t * vec2(0.2, 0.1)),
                  fbm(uv * 3.0 + vec2(5.2, 1.3) + t * vec2(-0.1, 0.15)));
    float f = fbm(uv * 2.5 + q * 2.5 + t * 0.08);
    float f2 = fbm(uv * 4.0 + q * 1.5 + t * 0.1);
    vec3 dark = vec3(0.08, 0.03, 0.01);
    vec3 amber = vec3(0.45, 0.22, 0.05);
    vec3 gold = vec3(0.6, 0.35, 0.08);
    vec3 col = mix(dark, amber, smoothstep(0.3, 0.65, f));
    col = mix(col, gold, pow(smoothstep(0.5, 0.85, f2), 2.0) * 0.5);
    float hotspot = pow(smoothstep(0.6, 0.95, f), 3.0);
    col += vec3(0.3, 0.12, 0.02) * hotspot;
    float vig = 1.0 - 0.35 * pow(length(uv - 0.5) * 1.3, 2.0);
    col *= vig;
    fragColor = vec4(col, 1.0);
}
`

export const MoltenAmber = forwardRef<HTMLDivElement, MoltenAmberProps>(
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

MoltenAmber.displayName = "MoltenAmber"
export default MoltenAmber
