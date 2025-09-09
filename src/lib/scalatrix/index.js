import scalatrixModuleFactory from './scalatrix.js';

let scalatrixModule = null;

const getModule = async () => {
  if (!scalatrixModule) {
    scalatrixModule = await scalatrixModuleFactory();
  }
  return scalatrixModule;
};

export const getSx = async () => {
  return await getModule();
};

// Export a stub sx object for build-time compatibility
export const sx = {
  MOS: { fromG: () => ({}) },
  affineFromThreeDots: () => ({}),
  PrimeList: function() { return { push_back: () => {}, size: () => 0 }; },
  generateJIPitchSet: () => ({ size: () => 0, get: () => null })
};

export * from './scalatrix.js';