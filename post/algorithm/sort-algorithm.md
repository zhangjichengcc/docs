# 经典排序算法

排序分类
![经典排序](./img/sort-algorithm(1).png)

算法复杂度
![复杂度](./img/sort-algorithm(2).png)

- 稳定：如果a原本在b前面，而a=b，排序之后a仍然在b的前面。
- 不稳定：如果a原本在b的前面，而a=b，排序之后 a 可能会出现在 b 的后面。
- 时间复杂度：对排序数据的总的操作次数。反映当n变化时，操作次数呈现什么规律。
- 空间复杂度：是指算法在计算机内执行时所需存储空间的度量，它也是数据规模n的函数。

## 冒泡排序

比较类-交换排序

> 冒泡排序是一种简单的排序算法。它重复地走访过要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。这个算法的名字由来是因为越小的元素会经由交换慢慢“浮”到数列的顶端。

1. 比较相邻的元素。如果第一个比第二个大，就交换它们两个；
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对，这样在最后的元素应该会是最大的数；
3. 针对所有的元素重复以上的步骤，除了最后一个；
4. 重复步骤1~3，直到排序完成。

![冒泡排序](./img/sort-algorithm-BubbleSort.gif)

``` js
function bubbleSort(arr) {
  for(let i = 0; i < arr.length; i++) {
    // 每次循环都会获取一个最大值，排在最后，故循环长度每次减少1
    for(let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // 交换位置
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
```

## 快速排序

比较类-交换排序

> 快速排序的基本思想：通过一趟排序将待排记录分隔成独立的两部分，其中一部分记录的关键字均比另一部分的关键字小，则可分别对这两部分记录继续进行排序，以达到整个序列有序。

![快速排序](./img/sort-algorithm-QuickSort.gif)

1. 在数据集之中，选择一个元素作为”基准”（pivot）。
2. 所有小于”基准”的元素，都移到”基准”的左边；所有大于”基准”的元素，都移到”基准”的右边。
3. 对”基准”左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。

### 递归实现

``` js
// 操作数组移动
function quickSort(arr) {
  if (arr.length < 2) return arr;
  let pivot = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[pivot]) {
      // 将目标移动到基准点前
      const [item] = arr.splice(i, 1); // 截取目标
      arr.splice(pivot, 0, item);      // 将目标插入到基准点前
      pivot ++;                        // 基准点坐标后移
    }
  }
  // 构建返回数组
  return [...quickSort(arr.slice(0, pivot)), arr[pivot], ...quickSort(arr.slice(pivot + 1))];
}

// 构造数组
function quickSort(arr) {
  if (arr.length < 2) return arr;
  let pivot = 0;
  // 创建left，left用于接收两侧值
  const
    left = [],
    right = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[pivot]) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  // 构建返回数组
  return [...left, arr[pivot], ...right];
}
```

### 递归优化

上面的算法比较容易理解，但相对的会浪费更多的内存空间，快排另外一个优势就是节省空间浪费，所以采用**原地排序**实现。

``` js
/**
 * 分区方法
 * 取第一项为基准值，改变原数组满足基准值大于左侧小于右侧，并返回基准值下标
 */
function partition(arr, left, right) {
  const pivot = left;
  let point = pivot + 1; // 指针从基准项下一位开始
  // 从基准项下一位开始遍历，与基准比较
  for (let i = point; i <= right; i ++) {
    if (arr[i] < arr[pivot]) {
      // 若当前小于基准值，则指针与当前位置的值互换，并且指针后移一位，这里是保证指针以左均小于基准值，
      [arr[point], arr[i]] = [arr[i], arr[point]];
      point ++;
    }
  }
  point --; // 指针前移一位，此时即为基准位置
  // 交换原基准值到当前位置
  [arr[pivot], arr[point]] = [arr[point], arr[pivot]];
  return point;
}

/**
 * 分区方法
 * 通过splice操作数组
 */
function partition(arr, left, right) {
  let pivot = left;
  for (let i = left + 1; i <= right; i ++) {
    if (arr[i] < arr[pivot]){
      const [item] = arr.splice(i, 1);
      arr.splice(pivot, 0, item);
      pivot ++;
    }
  }
  return pivot;
}
```

``` js
/**
 * 排序
 */
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const partitionIdx = partition(arr, left, right);
    quickSort(arr, left, partitionIdx - 1);
    quickSort(arr, partitionIdx + 1, right);
  }
  return arr;
}
```

### 循环优化

与大多数的递归到循环的转换方案一样，最先想到的是用栈来模拟递归调用。这样做可以重用一些我们熟悉的递归逻辑，并在循环中使用。

- 用栈记录待排序数组的`left, right`(起止下标)，基准值 `pivot - 1 < left` 或 基准值 `pivot + 1 > right` 则表示基准值左/右还有未排序的序列，生成新的 `left，right` 压入栈中；每次循环从栈中弹出 `left，right`，直至栈为空，循环结束。

- 因为基准值的规则是大于左侧小于右侧，所以当序列有序时，序列应为3位，即 `pivot - 1, pivot, pivot + 1`, 所以当 `left < pivot - 1` 则表示 `pivot` 左侧还有未排序数组, `left = left, right = pivot - 1`，右侧同理；

``` js
// 分组算法，同上
function partition(arr, left, right) {
  // ...
}

// 快速排序
function quickSort(arr) {
  // 设置栈，存储待排序数组的起止index，初始化为整个数组
  const stack = [0, arr.length - 1];
  // 当栈清空循环结束
  while(stack.length) {
    // 每次循环从栈顶弹出待处理的起止值
    const right = stack.pop();
    const left = stack.pop();
    // 获取分区中值index，处理分区
    const partitionIdx = partition(arr, left, right);
    // 当排序数组left小于中值index-1，则代表左侧数组无序，生成新的left，right压入栈中
    if (left < partitionIdx - 1) {
      stack.push(left, partitionIdx - 1);
    }
    if (right > partitionIdx + 1) {
      stack.push(partitionIdx + 1, right);
    }
  }
  return arr;
}
```

## 插入排序

> 插入排序（Insertion-Sort）的算法描述是一种简单直观的排序算法。它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。

![插入排序](./img/sort-algorithm-InsertionSort.gif)

1. 从第一个元素开始，该元素可以认为已经被排序；
2. 取出下一个元素，在已经排序的元素序列中从后向前扫描；
3. 如果该元素（已排序）大于新元素，将该元素移到下一位置；
4. 重复步骤3，直到找到已排序的元素小于或者等于新元素的位置；
5. 将新元素插入到该位置后；
6. 重复步骤2~5;

``` js
function insertSort(arr) {
  // 默认第一项已排序，从第二项开始遍历
  for (i = 1; i < arr.length; i ++) {
    let preIdx = i - 1;                           // 指针，从有序列表最后一项开始
    const current = arr[i];                       // 当前插入项
    while(preIdx >= 0 && current < arr[preIdx]) { // 边界限定，最多查找到第一项（preIdx === 0），条件 当前插入项 小于 当前比较到的有序列表项
      arr[preIdx + 1] = arr[preIdx];              // 当前比较项后移
      preIdx --;                                  // 指针前移，继续比较
    }
    // 插入项大于比较项，current插入到指针后
    arr[preIdx + 1] = current;
  }
  return arr;
}
```