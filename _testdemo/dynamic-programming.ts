/**
 * 动态规划
 */

/**
 * 找零钱问题
 * 问题描述：给你 k 种面值的硬币，面值分别为 c1, c2 ... ck，每种硬币的数量无限，再给一个总金额 amount，问你最少需要几枚硬币凑出这个金额，如果不可能凑出，算法返回 -1。
 * 例子
 * - 输入：coins = [1, 2, 5], amount = 11
 * - 输出：3 （11 = 5 + 5 + 1）
 */

/**
 * @description: 动态规划
 * @param {number[]} coins - 不同面额的硬币数组
 * @param {number} amount - 需要凑成的总金额
 * @return {number} - 最少硬币数，如果无法凑成则返回 -1
 */
function coinChange1(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

/**
 * @description: 递归
 * @param coins
 * @param amount
 * @returns
 */
function coinChange2(coins: number[], amount: number): number {
  if (amount === 0) return 0;
  let minCoins = Infinity;
  for (const coin of coins) {
    if (coin <= amount) {
      minCoins = Math.min(minCoins, coinChange2(coins, amount - coin) + 1);
    }
  }
  return minCoins === Infinity ? -1 : minCoins;
}

/**
 * @description: 递归+缓存
 * @param coins
 * @param amount
 * @returns
 */
function coinChange3(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  function coinChangeRecursive(amount: number): number {
    if (dp[amount] !== Infinity) return dp[amount];
    for (const coin of coins) {
      if (amount - coin >= 0) {
        dp[amount] = Math.min(
          dp[amount],
          coinChangeRecursive(amount - coin) + 1
        );
      }
    }
    return dp[amount];
  }

  return coinChangeRecursive(amount) === Infinity
    ? -1
    : coinChangeRecursive(amount);
}

/**
 * 01背包
 * 问题描述：给定 n 个物品，每个物品有一个重量和一个价值。还有一个背包，最大承重量为 W。每个物品只能选择一次，问如何选择物品使得背包内的总价值最大。
 */
/**
 *
 * @param weights
 * @param values
 * @param maxWeight
 * @returns
 */
// function knapsack(
//   weights: number[],
//   values: number[],
//   maxWeight: number
// ): number {
//   // 构建二维数组，dp[i][j] 表示前 i 件物品，总重量不超过 j 的最大价值
//   const dp = Array.from({ length: weights.length }, () =>
//     Array(maxWeight + 1).fill(0)
//   );
//   // 初始化第一行，处理第一个物品，第 0 件（前1件）物品，总重量不超过 maxWeight 的最大价值
//   for (let j = 0; j < maxWeight + 1; j++) {
//     if (weights[0] <= j) dp[0][j] = values[0];
//   }

//   // 从第1件物品开始，遍历所有物品
//   for (let i = 1; i < weights.length; i++) {
//     // 遍历所有总重量
//     for (let j = 0; j < maxWeight + 1; j++) {
//       // 若当前物品重量大于总重量，则不放入背包，dp[i][j] = dp[i - 1][j]，否则取 max（前面物品的最大价值，前面物品去除当前物品价值的最大价值 + 当前物品价值）
//       dp[i][j] =
//         j < weights[i]
//           ? // 如果当前物品重量大于容量，不能放入背包
//             dp[i - 1][j]
//           : // 否则，选择放或不放当前物品，取较大值
//             Math.max(dp[i - 1][j], dp[i - 1][j - weights[i]] + values[i]);
//     }
//   }

//   return dp[weights.length - 1][maxWeight];
// }·

// knapsack([1, 3, 4], [15, 20, 30], 4);

function knapsack(
  weights: number[],
  values: number[],
  maxWeight: number
): number {
  const dp = Array.from({ length: weights.length }, () =>
    new Array(maxWeight + 1).fill(0)
  );

  for (let j = weights[0]; j <= maxWeight; j++) {
    dp[0][j] = values[0];
  }

  for (let i = 1; i < weights.length; i++) {
    for (let j = 0; j <= maxWeight; j++) {
      dp[i][j] =
        weights[i] <= j
          ? Math.max(dp[i - 1][j], dp[i][j - weights[i]] + values[i])
          : dp[i - 1][j];
    }
  }

  return dp[weights.length - 1][maxWeight];
}

knapsack([1, 2, 4], [15, 20, 30], 4);
