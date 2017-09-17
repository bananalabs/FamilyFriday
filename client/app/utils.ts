export function computeGroups(total: number, min: number, max: number): number[] {
  let groups: number[] = [];
  // e.g: total = 2, max = 5, groups = [2]
  if (total > 0 && total <= max) {
    groups.push(total);
  }
  else {
    const quotient = Math.floor(total / max);
    const remainder = total % max;
    // e.g: total = 10, max = 5, groups = [5, 5]
    for (let i = 0; i < quotient; i++) {
      groups.push(max);
    }
    if (remainder >= min) {
      // e.g: total = 13, min = 3, max = 5, groups = [5, 5, 3]
      groups.push(remainder);
    } else if (remainder > 0) {
      // e.g: total = 16, min = 3, max = 5, groups = [5, 4, 4, 3]
      groups.splice(groups.length - 1, 1);
      return groups.concat(computeGroups(max + remainder, min, max - 1));
    }
  }
  return groups;
}
