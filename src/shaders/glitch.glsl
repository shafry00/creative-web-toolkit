// Glitch effect shader
// Dipakai buat text distortion, screen glitch, visual noise

uniform float uTime;
uniform float uIntensity;
uniform sampler2D uTexture;
varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = vUv;
    
    // Glitch offset
    float glitchIntensity = uIntensity * step(0.9, random(vec2(uTime * 0.1, 0.0)));
    
    // Horizontal shift
    float shift = random(vec2(uTime * 10.0, uv.y * 100.0)) * 0.1 * glitchIntensity;
    uv.x += shift;
    
    // Color channel separation
    float r = texture2D(uTexture, uv + vec2(0.01 * glitchIntensity, 0.0)).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - vec2(0.01 * glitchIntensity, 0.0)).b;
    
    // Scanlines
    float scanline = sin(uv.y * 500.0 + uTime * 10.0) * 0.02 * glitchIntensity;
    
    gl_FragColor = vec4(r + scanline, g, b, 1.0);
}
