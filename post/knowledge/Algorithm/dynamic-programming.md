# 动态规划

> 动态规划问题的一般形式就是求最值。动态规划其实是运筹学的一种最优化方法，只不过在计算机问题上应用比较多，比如说求最长递增子序列，最小距离等。
> 求解动态规划的核心问题是穷举。因为要求最值，肯定要把所有可行的答案穷举出来，然后在其中找最值。
>
> 首先，动态规划的穷举有点特别，因为这类问题存在「重叠子问题」，如果暴力穷举的话效率会极其低下，所以需要「备忘录」或者「DP table」来优化穷举过程，避免不必要的计算。而且，动态规划问题一定会具备「最优子结构」，才能通过子问题的最值得到原问题的最值。另外，虽然动态规划的核心思想就是穷举求最值，但是问题可以千变万化，穷举所有可行解其实并不是一件容易的事，只有列出正确的「状态转移方程」，才能正确地穷举。

## 思路

> 以上提到的重叠子问题、最优子结构、状态转移方程就是动态规划三要素。具体什么意思等会会举例详解，但是在实际的算法问题中，写出状态转移方程是最困难的，这也就是为什么很多朋友觉得动态规划问题困难的原因，我来提供我总结的一个思维框架，辅助你思考状态转移方程：
>
> ### 动态规划的基本步骤
>
> 1. **定义子问题：** 将原问题分解为更小的子问题。
> 2. **定义状态：** 用一个数组或其他数据结构来存储子问题的解。
> 3. **状态转移方程：** 找到子问题解之间的关系，定义状态转移方程。
> 4. **初始条件和边界条件：** 明确初始条件和边界条件。
> 5. **计算顺序：** 确定计算的顺序，以确保每个子问题在被需要时已经被计算过。
>
> **明确「状态」-> 明确「选择」 -> 定义 `dp` 数组/函数的含义**。

``` java
# 自顶向下递归的动态规划
def dp(状态1, 状态2, ...):
    for 选择 in 所有可能的选择:
        # 此时的状态已经因为做了选择而改变
        result = 求最值(result, dp(状态1, 状态2, ...))
    return result

# 自底向上迭代的动态规划
# 初始化 base case
dp[0][0][...] = base case
# 进行状态转移
for 状态1 in 状态1的所有取值：
    for 状态2 in 状态2的所有取值：
        for ...
            dp[状态1][状态2][...] = 求最值(选择1，选择2...)
```

## 示例

### 1. 凑零钱问题

问题描述：给你 k 种面值的硬币，面值分别为 c1, c2 ... ck，每种硬币的数量无限，再给一个总金额 amount，问你最少需要几枚硬币凑出这个金额，如果不可能凑出，算法返回 -1。

例子：

``` js
输入：coins = [1, 2, 5], amount = 11

输出：3 （11 = 5 + 5 + 1）
```

函数签名：

``` js
/**
 * @param {number[]} coins - 不同面额的硬币数组
 * @param {number} amount - 需要凑成的总金额
 * @return {number} - 最少硬币数，如果无法凑成则返回 -1
 */
function coinChange(coins, amount) {
  // ...
}

```

#### 解题思路

**定义状态**：

- 用 `dp[i]` 表示凑成金额 `i` 需要的最少硬币数。

**初始状态**：

- `dp[0] = 0`，因为凑成金额 0 需要 0 个硬币。

**状态转移方程**：

- 对于每一个金额 `i`，从所有硬币中选择一种，假设硬币面额为 `coin`，那么 `dp[i] = min(dp[i], dp[i - coin] + 1)`。
- 这里 `dp[i - coin] + 1` 表示如果已经知道凑成金额 `i - coin` 需要的最少硬币数，那么再加上一个面额为 `coin` 的硬币，凑成金额 `i` 需要的硬币数。

**目标**：

- 最终 `dp[amount]` 就是我们要求的结果。如果 `dp[amount]` 仍然是初始值（表示无法凑成），则返回 -1。

#### 递归方法

我们先使用递归暴力破解实现

- 当 `amount === 0, return 0` 即当总金额为 0 的时候，需要的硬币数也为 0；
- 状态转移方程 `minCoins = min(minCoins, fn(amount - coin) + 1)`，其中 `fn(amount - coin) + 1` 为当前总额减去当前硬币金额之后的最小硬币数，`+1` 则是要加上当前的硬币

``` ts
/**
 * @param {number[]} coins - 不同面额的硬币数组
 * @param {number} amount - 需要凑成的总金额
 * @return {number} - 最少硬币数，如果无法凑成则返回 -1
 */
function coinChange(coins: number[], amount: number): number {
  // 递归终止条件
  if (amount === 0) return 0;
  let minCoins = Infinity; // 默认硬币数量无穷多
  for (const coin of coins) { // 遍历每种硬币金额
    if (amount - coin >= 0) { // 当前总金额大于等于当前硬币金额
      minCoins = Math.min(minCoins, coinChange(coins, amount - coin) + 1);
    }
  }
  return minCoins === Infinity ? -1 : minCoins;
}
```

递归满足要求，但其效率是极差的，由于存在大量重复计算，时间复杂度是指数级别的，最坏情况下为 `O(n^amount)`，其中 `n` 是硬币的种类数。空间复杂度：递归调用栈的深度最坏情况为 `O(amount)`。

下面我们进行优化，将重复计算的数据存入dp表中

``` ts
/**
 * @param {number[]} coins - 不同面额的硬币数组
 * @param {number} amount - 需要凑成的总金额
 * @return {number} - 最少硬币数，如果无法凑成则返回 -1
 */
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  function coinChangeRecursive(amount: number): number {
    // 从dp表中取出缓存数据
    if (dp[amount] !== Infinity) return dp[amount];
    for (const coin of coins) {
      if (amount - coin >= 0) {
        dp[amount] = Math.min(dp[amount], coinChangeRecursive(amount - coin) + 1);
      }
    }
    return dp[amount];
  }
}
```

#### 动态规划（循环）实现

``` ts
/**
 * @param {number[]} coins - 不同面额的硬币数组
 * @param {number} amount - 需要凑成的总金额
 * @return {number} - 最少硬币数，如果无法凑成则返回 -1
 */
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  // 遍历从1开始的所有金额，直至当前金额
  for (let i = 1; i <= amount; i++) {
    // 在每个金额下，遍历所有硬币面额
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

- **时间复杂度**：`O(amount * n)`，其中 `n` 是硬币的种类数，因为需要遍历每个金额和每个硬币。

- **空间复杂度**：`O(amount)`，因为需要一个大小为 `amount + 1` 的数组 `dp`。

### 2. 背包问题

#### 2.1 01背包

问题描述：我们有一个容量为 `maxWeight` 的背包，以及 `n` 个物品，每个物品有一个重量 `weights[i]` 和一个价值 `values[i]`。我们要在不超过背包容量的前提下，选择若干物品使其总价值最大。每个物品只能被选择一次，即要么放入背包，要么不放入（0-1 选择）。

例子：

| 物品  | 重量 | 价值 |
| ----- | ---- | ---- |
| 物品0 | 1    | 15   |
| 物品1 | 3    | 20   |
| 物品2 | 4    | 30   |

``` js
weights = [1,3,4];
values = [15, 20, 30];
输入：weights = [1, 2, 5], values = [15, 20, 30], maxWeight = 4;

输出：35 (15 + 20)
```

| 物品i/背包重量j | 0    | 1    | 2    | 3    | 4    |
| --------------- | ---- | ---- | ---- | ---- | ---- |
| 0（1/15）       | 0    | 15   | 15   | 15   | 15   |
| 1（3/20）       | 0    | 15   | 15   | 20   | 35   |
| 2（4/30）       | 0    | 15   | 15   | 20   | 35   |

函数签名：

``` js
/**
 * @param {number[]} weights - 每件物品的重量
 * @param {number[]} values - 每件物品的价值
 * @param {number} maxWeight - 背包最大容量
 * @return {number} - 背包所能容下最大价值
 */
function knapsack(weights, values, W) {
  //...
}

```

#### 解题思路

**定义状态**:

- `dp[i][j]` 表示前 `i` 件物品中，总重量不超过 `j` 时可以获得的最大价值。

**状态转移方程**:

- 如果不选择第 `i` 件物品，那么 `dp[i][j]` 就等于前 `i-1` 件物品在重量不超过 `j` 时的最大价值，即 `dp[i][j] = dp[i-1][j]`。
- 如果选择第 `i` 件物品，那么 `dp[i][j]` 等于前 `i-1` 件物品在重量不超过 `j - weights[i]` 时的最大价值加上第 `i` 件物品的价值，即 `dp[i][j] = dp[i-1][j-weights[i]] + values[i]`。
- 综合上述两种情况，我们得到状态转移方程： `dp[i][j]=max⁡(dp[i−1][j],dp[i−1][j−weights[i]]+values[i])`

**初始化**:

- `dp[0][j]` 表示只考虑第 0 件物品时的最大价值。因此对于所有的 `j`，如果 `weights[0] <= j`，那么 `dp[0][j] = values[0]`，否则 `dp[0][j] = 0`。

**求解过程**:

- 从第 1 件物品开始，逐件物品计算在不超过各个重量限制 `j` 时的最大价值。

**结果**:

- `dp[n-1][maxWeight]` 即为我们所求的最大价值。

``` ts
/**
 * @param {number[]} weights - 每件物品的重量
 * @param {number[]} values - 每件物品的价值
 * @param {number} maxWeight - 背包最大容量
 * @return {number} - 背包所能容下最大价值
 */
function knapsack(
  weights: number[],
  values: number[],
  maxWeight: number
): number {
  // 构建二维数组，dp[i][j] 表示前 i 件物品，总重量不超过 j 的最大价值
  const dp = Array.from({ length: weights.length }, () =>
    Array(maxWeight + 1).fill(0)
  );
  // 初始化第一行，处理第一个物品，第 0 件（前1件）物品，总重量不超过 maxWeight 的最大价值
  // for (let j = 0; j < maxWeight + 1; j++) {
  //   if (weights[0] <= j) dp[0][j] = values[0];
  // }
  for (let j = weights[0]; j <= maxWeight; j++) {
    dp[0][j] = values[0];
  }

  // 从第1件物品开始，遍历所有物品
  for (let i = 1; i < weights.length; i++) {
    // 遍历所有总重量
    for (let j = 0; j < maxWeight + 1; j++) {
      // 若当前物品重量大于总重量，则不放入背包，dp[i][j] = dp[i - 1][j]，否则取 max（前面物品的最大价值，前面物品去除当前物品价值的最大价值 + 当前物品价值）
      dp[i][j] =
        j < weights[i]
          ? // 如果当前物品重量大于容量，不能放入背包
            dp[i - 1][j]
          : // 否则，选择放或不放当前物品，取较大值
            Math.max(dp[i - 1][j], dp[i - 1][j - weights[i]] + values[i]);
    }
  }

  return dp[weights.length - 1][maxWeight];
}
```
