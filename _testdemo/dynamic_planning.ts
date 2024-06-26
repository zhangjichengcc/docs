// 爬楼梯问题：一次爬1级或2级，若共n级，有多少种爬法
/**
1: 1,
2: 2,
3: 3,
4: 5
 */

// 一个人到达第 i 层楼底包括两种方法：

// 选择从第 i-1 层再爬1步到
// 选择从第 i-2 层再爬2步到

function climbStairs(n: number): number {
  const dp = [1, 1, 2];
  if (n < 3) return dp[n];
  for (let i = 3; i <= n; n++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

function callBack(n: number): number {
  if (n === 1) return 1;
  if (n === 2) return 2;
  return callBack(n - 1) + callBack(n - 2);
}


// 01背包问题

// 一共有N件物品，第i（i从1开始）件物品的重量为w[i]，价值为v[i]。在总重量不超过背包承载上限W的情况下，能够装入背包的最大价值是多少？

/**
v,w
3,2
4,3
5,4
|   | j | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|---|
| i | - | - | - | - | - | - | - |
| 0 | - | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | - | 0 | 0 | 3 | 3 | 3 | 3 | 
| 2 | - | 0 | 0 | 3 | 4 | 4 | 7 |
| 3 | - | 0 | 0 | 3 | 4 | 5 | 7 |
 */

