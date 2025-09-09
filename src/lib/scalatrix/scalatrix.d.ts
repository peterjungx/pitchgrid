// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
    /**
     * @param {string|null=} returnType
     * @param {Array=} argTypes
     * @param {Array=} args
     * @param {Object=} opts
     */
    function ccall(ident: any, returnType?: (string | null) | undefined, argTypes?: any[] | undefined, args?: any[] | undefined, opts?: any | undefined): any;
    /**
     * @param {string=} returnType
     * @param {Array=} argTypes
     * @param {Object=} opts
     */
    function cwrap(ident: any, returnType?: string | undefined, argTypes?: any[] | undefined, opts?: any | undefined): (...args: any[]) => any;
}
interface WasmModule {
  _main(_0: number, _1: number): number;
}

type EmbindString = ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string;
export interface ClassHandle {
  isAliasOf(other: ClassHandle): boolean;
  delete(): void;
  deleteLater(): this;
  isDeleted(): boolean;
  // @ts-ignore - If targeting lower than ESNext, this symbol might not exist.
  [Symbol.dispose](): void;
  clone(): this;
}
export interface IntegerAffineTransform extends ClassHandle {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
  applyAffine(_0: IntegerAffineTransform): IntegerAffineTransform;
  inverse(): IntegerAffineTransform;
  apply(_0: Vector2i): Vector2i;
}

export interface AffineTransform extends ClassHandle {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
  applyAffine(_0: AffineTransform): AffineTransform;
  inverse(): AffineTransform;
  apply(_0: Vector2d): Vector2d;
}

export interface Scale extends ClassHandle {
  recalcWithAffine(_0: AffineTransform, _1: number, _2: number): void;
  retuneWithAffine(_0: AffineTransform): void;
  print(_0: number, _1: number): void;
  getNodes(): VectorNode;
}

export interface MOS extends ClassHandle {
  L_fr: number;
  s_fr: number;
  chroma_fr: number;
  a: number;
  b: number;
  n: number;
  a0: number;
  b0: number;
  n0: number;
  mode: number;
  repetitions: number;
  depth: number;
  equave: number;
  period: number;
  generator: number;
  impliedAffine: AffineTransform;
  mosTransform: IntegerAffineTransform;
  base_scale: Scale;
  L_vec: Vector2i;
  s_vec: Vector2i;
  chroma_vec: Vector2i;
  v_gen: Vector2i;
  adjustG(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  adjustParams(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  coordToFreq(_0: number, _1: number, _2: number): number;
  angle(): number;
  angleStd(): number;
  gFromAngle(_0: number): number;
  retuneZeroPoint(): void;
  generateScaleFromMOS(_0: number, _1: number, _2: number): Scale;
  retuneScaleWithMOS(_0: Scale, _1: number): void;
  nodeLabelDigit(_0: Vector2i): string;
  nodeLabelLetter(_0: Vector2i): string;
  nodeLabelLetterWithOctaveNumber(_0: Vector2i, _1: number): string;
  retuneOnePoint(_0: Vector2i, _1: number): void;
  retuneTwoPoints(_0: Vector2i, _1: Vector2i, _2: number): void;
  retuneThreePoints(_0: Vector2i, _1: Vector2i, _2: Vector2i, _3: number): void;
  nodeInScale(_0: Vector2i): boolean;
}

export type Vector2d = {
  x: number,
  y: number
};

export type Vector2i = {
  x: number,
  y: number
};

export type Node = {
  natural_coord: Vector2i,
  tuning_coord: Vector2d,
  pitch: number
};

export interface VectorNode extends ClassHandle {
  push_back(_0: Node): void;
  resize(_0: number, _1: Node): void;
  size(): number;
  get(_0: number): Node | undefined;
  set(_0: number, _1: Node): boolean;
}

export type PseudoPrimeInt = {
  label: EmbindString,
  number: number,
  log2fr: number
};

export interface PrimeList extends ClassHandle {
  push_back(_0: PseudoPrimeInt): void;
  resize(_0: number, _1: PseudoPrimeInt): void;
  size(): number;
  get(_0: number): PseudoPrimeInt | undefined;
  set(_0: number, _1: PseudoPrimeInt): boolean;
}

export type PitchSetPitch = {
  label: EmbindString,
  log2fr: number
};

export interface PitchSet extends ClassHandle {
  push_back(_0: PitchSetPitch): void;
  resize(_0: number, _1: PitchSetPitch): void;
  size(): number;
  get(_0: number): PitchSetPitch | undefined;
  set(_0: number, _1: PitchSetPitch): boolean;
}

interface EmbindModule {
  IntegerAffineTransform: {
    new(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): IntegerAffineTransform;
  };
  AffineTransform: {
    new(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): AffineTransform;
  };
  Scale: {
    new(_0: number, _1: number): Scale;
    fromAffine(_0: AffineTransform, _1: number, _2: number, _3: number): Scale;
  };
  MOS: {
    fromG(_0: number, _1: number, _2: number, _3: number, _4: number): MOS;
    fromParams(_0: number, _1: number, _2: number, _3: number, _4: number): MOS;
  };
  VectorNode: {
    new(): VectorNode;
  };
  affineFromThreeDots(_0: Vector2d, _1: Vector2d, _2: Vector2d, _3: Vector2d, _4: Vector2d, _5: Vector2d): AffineTransform;
  pseudoPrimeFromIndexNumber(_0: number): PseudoPrimeInt;
  PrimeList: {
    new(): PrimeList;
  };
  generateDefaultPrimeList(_0: number): PrimeList;
  PitchSet: {
    new(): PitchSet;
  };
  generateHarmonicSeriesPitchSet(_0: PrimeList, _1: number, _2: number, _3: number): PitchSet;
  generateETPitchSet(_0: number, _1: number, _2: number, _3: number): PitchSet;
  generateJIPitchSet(_0: PrimeList, _1: number, _2: number, _3: number): PitchSet;
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
