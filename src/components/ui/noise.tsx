"use client"

import type React from "react"
import { forwardRef } from "react"
import { Shader } from "react-shaders"
import { cn } from "@/lib/utils"

export interface NoiseShadersProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Animation and evolution speed
   * @default 1.0
   */
  speed?: number

  /**
   * Noise pattern scale and zoom
   * @default 1.0
   */
  scale?: number

  /**
   * Fractal complexity levels
   * @default 4.0
   */
  octaves?: number

  /**
   * Amplitude decay between octaves
   * @default 0.5
   */
  persistence?: number

  /**
   * Frequency scaling factor
   * @default 2.0
   */
  lacunarity?: number
}

const fragmentShader = `
// Hash without Sine
// MIT License...
/* Copyright (c)2014 David Hoskins.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

//----------------------------------------------------------------------------------------
//  1 out, 2 in...
float hash12(vec2 p)
{
    vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

//----------------------------------------------------------------------------------------
///  2 out, 2 in...
vec2 hash22(vec2 p)
{
    vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx+33.33);
    return fract((p3.xx+p3.yz)*p3.zy);
}

//----------------------------------------------------------------------------------------
///  3 out, 2 in...
vec3 hash32(vec2 p)
{
    vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy+p3.yzz)*p3.zyx);
}

// Smooth noise using David Hoskins hash
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smooth interpolation
    f = f * f * (3.0 - 2.0 * f);

    // Four corner hash values
    float a = hash12(i);
    float b = hash12(i + vec2(1.0, 0.0));
    float c = hash12(i + vec2(0.0, 1.0));
    float d = hash12(i + vec2(1.0, 1.0));

    // Bilinear interpolation
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractal Brownian Motion using hash-based noise
float fbm(vec2 p, int octaves, float persistence, float lacunarity) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for(int i = 0; i < 8; i++) {
        if(i >= octaves) break;

        value += amplitude * noise(p * frequency);
        amplitude *= persistence;
        frequency *= lacunarity;
    }

    return value;
}

// Ridged noise pattern
float ridgedNoise(vec2 p) {
    return 1.0 - abs(noise(p) * 2.0 - 1.0);
}

// Billowy noise (absolute value)
float billowyNoise(vec2 p) {
    return abs(noise(p) * 2.0 - 1.0);
}

// Voronoi-style cellular pattern using hash
float voronoi(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float minDist = 1.0;

    for(int x = -1; x <= 1; x++) {
        for(int y = -1; y <= 1; y++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = hash22(i + neighbor);
            vec2 diff = neighbor + point - f;
            float dist = length(diff);
            minDist = min(minDist, dist);
        }
    }

    return minDist;
}

// Turbulence pattern
float turbulence(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for(int i = 0; i < 8; i++) {
        if(i >= octaves) break;

        value += amplitude * abs(noise(p * frequency));
        amplitude *= 0.5;
        frequency *= 2.0;
    }

    return value;
}

// Domain warping using hash-based noise
vec2 domainWarp(vec2 p, float time) {
    float warpStrength = 0.1;
    vec2 warp = vec2(
        noise(p + vec2(time * u_speed, 0.0)),
        noise(p + vec2(0.0, time * u_speed))
    );
    return p + warp * warpStrength;
}

// Generate dynamic color palette
vec3 colorPalette(float t) {
    // Smooth color transitions using cosine palette
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.33, 0.67);

    return a + b * cos(6.28318 * (c * t + d));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord / iResolution.xy;
    vec2 p = uv * u_scale;
    float time = iTime * u_speed;

    // Apply domain warping for organic movement
    vec2 warpedP = domainWarp(p, time);

    // Create layered noise patterns
    float baseNoise = fbm(warpedP, int(u_octaves), u_persistence, u_lacunarity);

    // Add ridged noise for sharp features
    float ridged = ridgedNoise(warpedP * 2.0 + time * 0.1);

    // Add billowy clouds
    float billowy = billowyNoise(warpedP * 4.0 - time * 0.05);

    // Voronoi cellular pattern
    float cells = voronoi(warpedP * 8.0);

    // Turbulence for additional detail
    float turb = turbulence(warpedP * 6.0, int(u_octaves * 0.5));

    // Combine different noise types
    float combinedNoise = baseNoise * 0.4;
    combinedNoise += ridged * 0.3;
    combinedNoise += billowy * 0.2;
    combinedNoise += (1.0 - cells) * 0.1;
    combinedNoise += turb * 0.1;

    // Add temporal variation
    float timeVariation = sin(time * 0.5) * 0.1 + 0.9;
    combinedNoise *= timeVariation;

    // Create color from noise using palette
    float colorIndex = combinedNoise + time * 0.1;
    vec3 color = colorPalette(colorIndex);

    // Add contrast and brightness
    color = pow(color, vec3(0.8));
    color *= 1.2;

    // Add subtle glow effect
    float glow = 1.0 - length(uv - 0.5) * 0.5;
    color *= glow;

    // Final color adjustments
    color = clamp(color, 0.0, 1.0);

    fragColor = vec4(color, 1.0);
}
`

export const NoiseShaders = forwardRef<HTMLDivElement, NoiseShadersProps>(
  (
    {
      className,
      speed = 1.0,
      scale = 1.0,
      octaves = 4.0,
      persistence = 0.5,
      lacunarity = 2.0,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("w-full h-full", className)} ref={ref} {...(props as any)}>
        <Shader
          fs={fragmentShader}
          style={{ width: "100%", height: "100%" } as CSSStyleDeclaration}
          uniforms={{
            u_speed: { type: "1f", value: speed },
            u_scale: { type: "1f", value: scale },
            u_octaves: { type: "1f", value: octaves },
            u_persistence: { type: "1f", value: persistence },
            u_lacunarity: { type: "1f", value: lacunarity },
          }}
        />
      </div>
    )
  },
)

NoiseShaders.displayName = "NoiseShaders"

export default NoiseShaders
