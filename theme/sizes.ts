export type Sizes = {
  s0_25: number;
  s0_50: number;
  s1: number;
  s1_5: number;
  s2: number;
  s2_5: number;

  getSizeProportial: (x: number) => number;
};

export function getSizes(baseFontSize: number): Sizes {
  const getSizeProportial = (x: number) => baseFontSize * x;

  return {
    s0_25: getSizeProportial(0.25), // 4px
    s0_50: getSizeProportial(0.5), // 8px
    s1: getSizeProportial(1), // 16px
    s1_5: getSizeProportial(1.5), // 16px * 1.5 = 24px
    s2: getSizeProportial(2), // 32px
    s2_5: getSizeProportial(2.5), // 40px

    getSizeProportial,
  };
}
