"use client"

import type React from "react"
import { forwardRef } from "react"
import { Shader } from "react-shaders"
import { cn } from "@/lib/utils"

export interface SeaShadersProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Ocean wave and camera movement speed
   * @default 1.0
   */
  speed?: number

  /**
   * Wave amplitude and height
   * @default 1.0
   */
  waveHeight?: number

  /**
   * Wave density and frequency
   * @default 1.0
   */
  waveFrequency?: number

  /**
   * Camera height and viewing angle
   * @default 1.0
   */
  perspective?: number

  /**
   * Atmospheric haze and fog intensity
   * @default 1.0
   */
  atmosphere?: number
}

const fragmentShader = `
const int NUM_STEPS = 24;
const float PI = 3.141592;
const float EPSILON = 1e-3;

// Hash function for noise
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Smooth noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractal Brownian Motion for ocean waves
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for(int i = 0; i < 6; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }

    return value;
}

// Ocean height function
float seaHeight(vec2 p, float time) {
    float height = 0.0;
    float amplitude = u_waveHeight * 0.6;
    float frequency = u_waveFrequency * 0.8;

    // Main ocean waves
    height += sin(p.x * frequency + time * u_speed * 2.0) * amplitude;
    height += sin(p.y * frequency * 0.7 + time * u_speed * 1.5) * amplitude * 0.8;

    // Secondary waves
    height += sin(p.x * frequency * 2.3 + time * u_speed * 3.2) * amplitude * 0.4;
    height += sin(p.y * frequency * 1.8 - time * u_speed * 2.8) * amplitude * 0.3;

    // Fractal detail waves
    height += fbm(p * frequency * 2.0 + time * u_speed) * amplitude * 0.3;

    // Larger swells
    height += sin(p.x * frequency * 0.3 + time * u_speed * 0.8) * amplitude * 1.2;
    height += sin(p.y * frequency * 0.4 + time * u_speed * 0.6) * amplitude * 1.0;

    return height;
}

// Calculate surface normal
vec3 seaNormal(vec2 p, float time, float epsilon) {
    float h = seaHeight(p, time);
    float hx = seaHeight(p + vec2(epsilon, 0.0), time);
    float hy = seaHeight(p + vec2(0.0, epsilon), time);

    return normalize(vec3(h - hx, h - hy, epsilon));
}

// Sky color gradient
vec3 skyColor(vec3 direction) {
    float horizon = max(0.0, direction.y);

    // Sky gradient from horizon to zenith
    vec3 skyBlue = vec3(0.3, 0.6, 1.0);
    vec3 horizonColor = vec3(0.8, 0.9, 1.0);
    vec3 zenithColor = vec3(0.1, 0.3, 0.8);

    vec3 sky = mix(horizonColor, zenithColor, pow(horizon, 0.5));

    // Add some clouds
    float clouds = fbm(direction.xz * 3.0) * 0.5;
    clouds = smoothstep(0.4, 0.8, clouds);
    sky = mix(sky, vec3(1.0, 1.0, 1.0), clouds * 0.3);

    // Sun glow
    vec3 sunDir = normalize(vec3(0.3, 0.8, 0.5));
    float sun = pow(max(0.0, dot(direction, sunDir)), 32.0);
    sky += vec3(1.0, 0.8, 0.4) * sun * 0.5;

    return sky;
}

// Sea color with lighting
vec3 seaColor(vec3 position, vec3 normal, vec3 lightDir, vec3 viewDir, vec3 skyColor) {
    // Beautiful sea colors - tropical to deep ocean
    vec3 deepSea = vec3(0.0, 0.2, 0.4);        // Deep blue
    vec3 midSea = vec3(0.0, 0.4, 0.7);         // Ocean blue
    vec3 shallowSea = vec3(0.2, 0.6, 0.8);     // Lighter blue
    vec3 tropicalSea = vec3(0.3, 0.8, 0.9);    // Tropical cyan

    // Fresnel effect
    float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 2.5);

    // Diffuse lighting
    float diffuse = max(0.0, dot(normal, lightDir));

    // Specular reflection - sun sparkles
    vec3 reflected = reflect(-lightDir, normal);
    float specular = pow(max(0.0, dot(reflected, viewDir)), 128.0);

    // Depth-based color variation
    float depth = clamp(position.y / (u_waveHeight + 0.5), 0.0, 1.0);
    vec3 seaBase = mix(deepSea, shallowSea, depth);
    seaBase = mix(seaBase, tropicalSea, diffuse * 0.3);

    // Add subsurface scattering effect
    float subsurface = pow(max(0.0, dot(-lightDir, normal)), 2.0);
    seaBase += vec3(0.2, 0.4, 0.6) * subsurface * 0.4;

    // Bright sun sparkles
    seaBase += vec3(1.0, 0.95, 0.8) * specular * 1.2;

    // Foam on wave crests - more prominent
    float foam = smoothstep(0.2, 0.8, position.y / (u_waveHeight + 0.1));
    seaBase = mix(seaBase, vec3(0.95, 0.98, 1.0), foam * 0.5);

    // Enhanced reflection with better color mixing
    vec3 finalColor = mix(seaBase, skyColor * vec3(0.8, 0.9, 1.0), fresnel * 0.6);

    return finalColor;
}

// Ray marching to find sea surface intersection
float rayMarchSea(vec3 origin, vec3 direction, float time) {
    float t = 0.0;

    for(int i = 0; i < NUM_STEPS; i++) {
        vec3 pos = origin + direction * t;
        float height = seaHeight(pos.xz, time);

        if(pos.y < height) {
            // Refine intersection
            float t1 = t - 1.0;
            float t2 = t;

            for(int j = 0; j < 8; j++) {
                float tmid = (t1 + t2) * 0.5;
                vec3 pmid = origin + direction * tmid;

                if(pmid.y < seaHeight(pmid.xz, time)) {
                    t2 = tmid;
                } else {
                    t1 = tmid;
                }
            }

            return t2;
        }

        t += 1.0;
        if(t > 100.0) break;
    }

    return -1.0;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;

    float time = iTime * u_speed;

    // Camera setup
    vec3 cameraPos = vec3(0.0, 2.0 + u_perspective, time * 3.0);
    vec3 cameraTarget = vec3(0.0, 0.0, time * 3.0 + 10.0);
    vec3 cameraUp = vec3(0.0, 1.0, 0.0);

    // Camera rotation with time
    float angle = time * 0.1;
    cameraPos.x += sin(angle) * 2.0;
    cameraPos.z += cos(angle) * 2.0;

    // Create camera matrix
    vec3 forward = normalize(cameraTarget - cameraPos);
    vec3 right = normalize(cross(forward, cameraUp));
    vec3 up = cross(right, forward);

    // Ray direction
    vec3 rayDir = normalize(uv.x * right + uv.y * up + forward * 2.0);

    // Light direction (sun)
    vec3 lightDir = normalize(vec3(0.3, 0.8, 0.5));

    // Ray march to find sea intersection
    float t = rayMarchSea(cameraPos, rayDir, time);

    vec3 color;

    if(t > 0.0) {
        // Hit sea surface
        vec3 hitPos = cameraPos + rayDir * t;
        vec3 normal = seaNormal(hitPos.xz, time, 0.1);
        vec3 sky = skyColor(reflect(rayDir, normal));

        color = seaColor(hitPos, normal, lightDir, -rayDir, sky);

        // Atmospheric perspective
        float distance = length(hitPos - cameraPos);
        float fog = 1.0 - exp(-distance * 0.01 * u_atmosphere);
        color = mix(color, skyColor(rayDir), fog);

    } else {
        // Hit sky
        color = skyColor(rayDir);
    }

    // Post-processing
    color = pow(color, vec3(0.7)); // Gamma correction
    color *= 1.2; // Brightness boost

    fragColor = vec4(color, 1.0);
}
`

export const SeaShaders = forwardRef<HTMLDivElement, SeaShadersProps>(
  (
    {
      className,
      speed = 1.0,
      waveHeight = 1.0,
      waveFrequency = 1.0,
      perspective = 1.0,
      atmosphere = 1.0,
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
            u_waveHeight: { type: "1f", value: waveHeight },
            u_waveFrequency: { type: "1f", value: waveFrequency },
            u_perspective: { type: "1f", value: perspective },
            u_atmosphere: { type: "1f", value: atmosphere },
          }}
        />
      </div>
    )
  },
)

SeaShaders.displayName = "SeaShaders"

export default SeaShaders
