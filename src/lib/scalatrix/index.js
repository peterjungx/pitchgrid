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
  MOS: {
    fromG: (depth, mode, generator, stretch, param) => ({
      L_fr: 0, s_fr: 0, chroma_fr: 0, a: 2, b: 5, n: 12, a0: 2, b0: 5, n0: 12,
      v_gen: { x: generator, y: 1 },
      angle: () => 0,
      adjustG: () => {},
      getNodes: () => ({ get: () => ({ natural_coord: { x: 0, y: 0 }, pitch: 1 }), delete: () => {} }),
      equave: 2
    })
  },
  AffineTransform: function(a, b, c, d, e, f) {
    return {
      a: a || 1, b: b || 0, c: c || 0, d: d || 1, e: e || 0, f: f || 0,
      tx: e || 0, ty: f || 0,
      apply: (point) => ({ x: point.x, y: point.y }),
      applyAffine: (other) => sx.AffineTransform(1, 0, 0, 1, 0, 0),
      inverse: () => sx.AffineTransform(1, 0, 0, 1, 0, 0),
      delete: () => {}
    };
  },
  Scale: {
    fromAffine: (affine, baseFreq, numNodes, origin) => ({
      size: () => numNodes || 0,
      get: (i) => ({ pitch: Math.pow(2, i * 0.1), log2fr: i * 0.1, label: `2^${i}` })
    })
  },
  affineFromThreeDots: (p1, p2, p3, q1, q2, q3) => ({
    a: 1, b: 0, c: 0, d: 1, e: 0, f: 0, tx: 0, ty: 0,
    apply: (point) => ({ x: point.x, y: point.y }),
    applyAffine: (other) => sx.AffineTransform(1, 0, 0, 1, 0, 0),
    inverse: () => sx.AffineTransform(1, 0, 0, 1, 0, 0),
    delete: () => {}
  }),
  PrimeList: function() {
    return {
      push_back: () => {},
      size: () => 3,
      get: (i) => ({ number: 2, log2fr: Math.log2(2), label: '2' })
    };
  },
  generateJIPitchSet: (primeList, count, min, max) => ({
    size: () => count || 0,
    get: (i) => ({ pitch: Math.pow(2, i * 0.1), log2fr: i * 0.1, label: `2^${i}` })
  })
};

export * from './scalatrix.js';