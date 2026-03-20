"use client"

import type React from "react"
import { forwardRef } from "react"
import { Shader } from "react-shaders"
import { cn } from "@/lib/utils"

export interface DarkSmokeProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number
}

// Cool smoke palette (default). For warm ember variant, swap palette to:
//   vec3 dark = vec3(0.025, 0.02, 0.02);
//   vec3 smokeCol = vec3(0.13, 0.12, 0.11);
//   vec3 lightSmoke = vec3(0.20, 0.18, 0.16);
//   vec3 ember = vec3(0.18, 0.07, 0.02);
//   vec3 hotEmber = vec3(0.30, 0.10, 0.02);
// And replace cool light section with:
//   float emberMask = smoothstep(0.8, 0.2, uv.y) * pow(smoothstep(0.5, 0.9, smoke1), 2.0);
//   col = mix(col, ember, emberMask * 0.4);
//   float hotspot = pow(smoothstep(0.65, 0.95, smoke1 * smoke2), 3.0) * smoothstep(0.7, 0.1, uv.y);
//   col = mix(col, hotEmber, hotspot * 0.3);
//   col += vec3(0.02, 0.008, 0.003) * thickSmoke * smoothstep(0.3, 0.6, smoke3);

const fragmentShader = `
// Dense billowing smoke — cool charcoal/ash with blue-grey undertones
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
    for (int i = 0; i < 6; i++) { val += amp * noise(p); p *= 2.0; amp *= 0.5; }
    return val;
}
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * 0.08 * u_speed;

    // Multiple smoke plumes rising at different speeds
    vec2 rise1 = vec2(0.08, 0.25) * t;
    vec2 rise2 = vec2(-0.06, 0.18) * t;
    vec2 rise3 = vec2(0.04, 0.12) * t;

    // Layer 1 — large billowing masses
    vec2 q1 = vec2(fbm(uv * 2.0 + rise1),
                   fbm(uv * 2.0 + vec2(5.2, 1.3) + rise1 * 0.8));
    float smoke1 = fbm(uv * 2.5 + q1 * 2.5 + t * 0.03);

    // Layer 2 — mid-scale curling wisps
    vec2 q2 = vec2(fbm(uv * 3.5 + rise2 + vec2(3.1, 7.4)),
                   fbm(uv * 3.5 + vec2(8.7, 2.1) + rise2));
    float smoke2 = fbm(uv * 4.0 + q2 * 2.0 + vec2(smoke1) * 0.8);

    // Layer 3 — fine turbulent detail
    vec2 q3 = vec2(fbm(uv * 5.0 + rise3 + vec2(1.7, 9.8)),
                   fbm(uv * 5.0 + vec2(6.3, 4.2) + rise3));
    float smoke3 = fbm(uv * 6.0 + q3 * 1.5 + vec2(smoke2, smoke1) * 0.5);

    // Combine smoke layers
    float density = smoke1 * 0.5 + smoke2 * 0.3 + smoke3 * 0.2;
    float thickSmoke = smoothstep(0.15, 0.75, density);

    // Cool smoke palette — charcoal, ash, subtle blue-grey
    vec3 dark = vec3(0.02, 0.022, 0.028);
    vec3 smokeCol = vec3(0.10, 0.11, 0.13);
    vec3 lightSmoke = vec3(0.17, 0.18, 0.21);
    vec3 ashGrey = vec3(0.22, 0.23, 0.26);

    // Build color — dense smoke with volume
    vec3 col = mix(dark, smokeCol, thickSmoke);
    col = mix(col, lightSmoke, pow(smoothstep(0.4, 0.8, smoke2), 1.5) * 0.5);
    col = mix(col, ashGrey, pow(smoothstep(0.6, 0.9, smoke3), 2.0) * 0.25);

    // Smoke edges catch cool light
    float edge = abs(smoke1 - smoke2) * 2.0;
    col += vec3(0.025, 0.03, 0.04) * smoothstep(0.3, 0.7, edge);

    // Cool ambient from above
    float topLight = smoothstep(0.7, 0.1, uv.y) * smoothstep(0.4, 0.8, smoke1);
    col += vec3(0.015, 0.018, 0.025) * topLight;

    // Subtle blue shift in thickest areas
    col.b += 0.012 * thickSmoke * smoothstep(0.3, 0.6, smoke3);

    // Fine particulate detail
    float particle = noise(uv * 60.0 + t * 2.0) * noise(uv * 45.0 - t);
    col += (particle - 0.25) * 0.02 * thickSmoke;

    // Vignette
    float vig = 1.0 - 0.35 * pow(length(uv - 0.5) * 1.3, 2.0);
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
