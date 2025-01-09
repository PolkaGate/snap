// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function areArraysEqual(arr1?: string[], arr2?: string[]): boolean {
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) return false;

  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();

  return sortedArr1.every((value, index) => value === sortedArr2[index]);
}
