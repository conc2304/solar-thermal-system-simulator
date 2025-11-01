// perlin-noise.d.ts
declare module 'perlin-noise' {
  interface PerlinNoiseOptions {
    /**
     * Number of octaves to use in noise generation.
     * Controls the level of detail in the noise.
     * @default 4
     */
    octaveCount?: number;

    /**
     * Amplitude of the noise.
     * Determines the intensity of noise variations.
     * @default 0.1
     */
    amplitude?: number;

    /**
     * Persistence of noise across octaves.
     * Controls how quickly amplitude decreases for each octave.
     * @default 0.2
     */
    persistence?: number;
  }

  /**
   * Generates Perlin noise for a given width and height.
   * 
   * @param width The width of the noise grid
   * @param height The height of the noise grid
   * @param options Optional configuration for noise generation
   * @returns A one-dimensional array of noise values between 0 and 1
   */
  function generatePerlinNoise(
    width: number,
    height: number,
    options?: PerlinNoiseOptions
  ): number[];

  /**
   * Generates white noise for a given width and height.
   * 
   * @param width The width of the noise grid
   * @param height The height of the noise grid
   * @returns A one-dimensional array of noise values between 0 and 1
   */
  function generateWhiteNoise(
    width: number,
    height: number
  ): number[];

  export {
    generatePerlinNoise,
    generateWhiteNoise,
    PerlinNoiseOptions
  };
}