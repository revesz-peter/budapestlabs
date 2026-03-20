"use client"

import type React from "react"
import { forwardRef } from "react"
import { Shader } from "react-shaders"
import { cn } from "@/lib/utils"

export interface SilkFlowProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number
}

const fragmentShader = `
// Draped silk fabric — deep folds, satin highlights, weave texture
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
    float aspect = iResolution.x / iResolution.y;
    vec2 st = vec2(uv.x * aspect, uv.y);
    float t = iTime * 0.08 * u_speed;

    // Breathing base motion
    float breath = sin(t * 0.6) * 0.3;

    // 3 layers of domain warping for deep realistic folds
    float n1 = fbm(st * 2.0 + t * vec2(0.12, 0.08) + breath);
    float n2 = fbm(st * 3.0 + vec2(n1) * 1.8 + t * vec2(-0.06, 0.1));
    float n3 = fbm(st * 1.8 + vec2(n2, n1) * 2.2 + t * 0.05);
    float n4 = fbm(st * 4.0 + vec2(n3, n2) * 1.2 + t * vec2(0.04, -0.03));

    // Diagonal fold lines with slow drift
    float drift = t * 0.15;
    float fold = sin(st.x * 2.5 + st.y * 1.5 + n2 * 3.5 + drift) * 0.5 + 0.5;
    float fold2 = sin(st.x * 1.2 - st.y * 2.0 + n3 * 3.0 - drift * 0.6) * 0.5 + 0.5;
    float fold3 = sin(st.x * 0.8 + st.y * 3.0 + n4 * 2.0 + drift * 0.4) * 0.5 + 0.5;

    // Fold direction for anisotropic highlight
    float foldDir = atan(st.x * 2.5 + n2, st.y * 1.5 + n3);

    // Warm cream/champagne palette
    vec3 light = vec3(0.96, 0.93, 0.88);
    vec3 mid = vec3(0.85, 0.80, 0.74);
    vec3 shadow = vec3(0.62, 0.57, 0.52);
    vec3 crease = vec3(0.48, 0.43, 0.39);

    // Build the silk surface with deep creases
    vec3 col = mix(light, mid, smoothstep(0.25, 0.65, n3));
    col = mix(col, shadow, smoothstep(0.35, 0.75, fold) * 0.55);
    col = mix(col, crease, smoothstep(0.55, 0.85, fold * fold2) * 0.4);
    col = mix(col, shadow, smoothstep(0.5, 0.8, fold3) * 0.2);

    // Broad satin sheen
    float sheen = smoothstep(0.4, 0.7, fold2) * smoothstep(0.3, 0.6, n2);
    col = mix(col, vec3(0.97, 0.94, 0.90), sheen * 0.25);

    // Tight specular catch — anisotropic
    float specular = pow(smoothstep(0.6, 0.78, fold2) * smoothstep(0.5, 0.72, n4), 3.0);
    float aniso = abs(sin(foldDir * 2.0)) * 0.5 + 0.5;
    specular *= aniso;
    col = mix(col, vec3(1.0, 0.97, 0.92), specular * 0.5);

    // Warm golden shift in folds
    col += vec3(0.03, 0.015, 0.0) * smoothstep(0.3, 0.7, n1);
    col -= vec3(0.0, 0.005, 0.015) * smoothstep(0.5, 0.8, fold);

    // Fine weave texture
    float weave = noise(st * 120.0 + n1 * 5.0) * noise(st * 90.0 + vec2(7.0, 3.0));
    col += (weave - 0.25) * 0.04;

    // Vignette
    float vig = 1.0 - 0.28 * pow(length(uv - 0.5) * 1.3, 2.0);
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
