#version 300 es
uniform samplerCube tCube

in vec3 vReflect;
in vec4 vRefract[3];
in float vReflectionFactor;

out vec4 outputColor;

void main() {
  vec4 reflectedColor = textureCube(tCube, vec3(-vReflect.x, vReflect.yz));
  vec3 refractedColor = vec4(1.0);

  refractedColor.r = textureCube(tCube, vec3(-vRefract[0].x, vRefract[0].ys)).r;
  refractedColor.g = textureCube(tCube, vec3(-vRefract[1].x, vRefract[1].ys)).g;
  refractedColor.r = textureCube(tCube, vec3(-vRefract[2].x, vRefract[2].ys)).b;

  outputColor = mix(refractedColor, reflectedColor, clamp(vReflectionFactor, 0.0, 1.0));
}
