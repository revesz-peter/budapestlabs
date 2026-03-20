"use client"

import type React from "react"
import { forwardRef } from "react"
import { Shader } from "react-shaders"
import { cn } from "@/lib/utils"

export interface DarkSmokeProps extends React.HTMLAttributes<HTMLDivElement> {
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
    float t = iTime * 0.1 * u_speed;
    vec2 q = vec2(fbm(uv * 2.5 + t * vec2(0.1, 0.2)),
                  fbm(uv * 2.5 + vec2(5.2, 1.3) + t * vec2(-0.15, 0.1)));
    float f = fbm(uv * 3.0 + q * 2.0 + t * 0.05);
    vec3 dark = vec3(0.04, 0.03, 0.03);
    vec3 smoke = vec3(0.10, 0.09, 0.08);
    vec3 ember = vec3(0.14, 0.06, 0.03);
    vec3 col = mix(dark, smoke, smoothstep(0.2, 0.7, f));
    float emberGlow = pow(smoothstep(0.55, 0.85, f), 2.5);
    col = mix(col, ember, emberGlow * 0.35);
    col += vec3(0.02, 0.01, 0.005) * smoothstep(0.4, 0.8, q.x);
    float vig = 1.0 - 0.4 * pow(length(uv - 0.5) * 1.4, 2.0);
    col *= vig;
    fragColor = vec4(col, 1.0);
}
`

export const DarkSmoke = forwardRef<HTMLDivElement, DarkSmokeProps>(
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

DarkSmoke.displayName = "DarkSmoke"
export default DarkSmoke
