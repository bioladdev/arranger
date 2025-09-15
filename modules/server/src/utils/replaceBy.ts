export default function replaceBy<T>(
  arr1: T[] | null | undefined,
  arr2: T[] | null | undefined,
  operator: (x: T, y: T) => boolean
): T[] {
  const cArr1 = arr1 || [];
  const cArr2 = arr2 || [];
  return cArr1.map((x) => cArr2.find((y) => operator(x, y)) || x);
}
