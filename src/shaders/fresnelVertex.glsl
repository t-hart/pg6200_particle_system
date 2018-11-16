uniform float mRefractionRatio;
uniform float mFresnelBias;
uniform float mFresnelScale;
uniform float mFresnelPower;

out vec3 vReflect;
out vec3 vRefract[3];
out float vReflectionFactor;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);

  vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2.xyz]) * normal);

  vec3 I = worldPosition.xyz - cameraPosition;
  vec3 INormalized = normalize(I);

  vReflect = reflect(I, worldNormal);
  vRefract[0] = refract(INormalized, worldNormal, mRefractionRatio);
  vRefract[1] = refract(INormalized, worldNormal, mRefractionRatio * .99);
  vRefract[2] = refract(INormalized, worldNormal, mRefractionRatio * .98);
  vReflectionFactor = mFresnelBias + mFresnelScale * pow(1.0 + dot(INormalized, worldNormal), mFresnelPower);

  gl_Position = projectionMatrix * mvPosition;
}