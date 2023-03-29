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

比较类-插入排序

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

## 希尔排序（Shell Sort）

比较类-插入排序

> 1959年Shell发明，第一个突破O(n2)的排序算法，是简单插入排序的改进版。它与插入排序的不同之处在于，它会优先比较距离较远的元素。希尔排序又叫缩小增量排序。

希尔排序其实是插入排序的改进，将序列分组然后进行插入排序

希尔排序是基于插入排序的以下两点性质而提出改进方法的：

- 插入排序在对几乎已经排好序的数据操作时，效率高，即可以达到线性排序的效率；
- 但插入排序一般来说是低效的，因为插入排序每次只能将数据移动一位；

希尔排序的基本思想是：先将整个待排序的记录序列分割成为若干子序列分别进行直接插入排序，待整个序列中的记录“基本有序”时，再对全体记录进行依次直接插入排序。

![希尔排序过程](./img/sort-algorithm-shellSort(1).gif)

![希尔排序图解](./img/sort-algorithm-shellSort(2).png)

``` bash
8 9 1 7 2 3 5 4 6 0

# 分组 10 / 2 = 5

8 9 1 7 2
3 5 4 6 0

# 排序

3 5 1 6 0
8 9 4 7 2

# 分组 5 / 2 = 2

3 5
1 6
0 8
9 4
7 2

# 排序

0 2
1 4
3 5
7 6
9 8

# 分组 2 / 2 = 1

0 2 1 4 3 5 7 6 9 8

# 排序

0 1 2 3 4 5 6 7 8 9
```

``` js
function shellSort(arr) {
  // 设定分为 arr.length / 2 组， 每次 / 2
  for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // 从每组的下标1开始，遍历整个组，注意，此处并不显式声明每个组，而是通过对gap的加减来判断每组相应元素，故 i ++ 而非 i+=gap
    for (let i = gap; i < arr.length; i++) {
      const temp = arr[i];                     // 这里将当前项暂存
      let pre = i - gap;                       // 获取前一项
      while (pre > 0 && temp < arr[pre]) {     // 边界，当前项小于前一项，则前一项后移一位
        arr[pre + gap] = arr[pre];             // pre 前移一位
        pre -= gap;                            // 指针前移
      }
      arr[pre + gap] = temp;                   // 后移结束，将temp插入指针位置，(因为每次循环 pre都前移一位，这里需要恢复)
    }
  }
  return arr;
}
```

从代码中也不难看出，shell排序，其实就是在插入排序的基础上添加了一个分组；

## 选择排序

比较类-选择排序

> 选择排序(Selection-sort)是一种简单直观的排序算法。它的工作原理：首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。

选择排序，是从起始位置开始，找最小的数值所在的索引，如果最终存储的索引不是起始位置，就与起始位置交换存储数据，每执行一次循环，会将最小值存储在起始位置上。

![select sort](./img/sort-algorithm-selectSort.gif)

``` js
function selectSort(arr) {
  // 从第一项开始便利数组，记录最小值的下标
  for (let i = 0; i < arr.length; i++) {
    let min = i;                                 // 默认最小值为第一项
    for (let j = i + 1; j < arr.length; j++) {   // 从下一项开始查找
      if (arr[j] < arr[min]) min = j;            // 若当前项比最小项小，则更新最小项
    }
    [arr[min], arr[i]] = [arr[i], arr[min]];     // 将实际最小项交换到第一位
  }
  return arr;
}
```

## 堆排序

比较类-选择排序

> 堆排序（Heap sort）是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即**子结点的键值或索引总是小于（或者大于）它的父节点**。

堆是具有以下性质的完全二叉树：每个结点的值都大于或等于其左右孩子结点的值，称为大顶堆；或者每个结点的值都小于或等于其左右孩子结点的值，称为小顶堆。如下图：

![完全二叉树](./img/sort-algorithm-heapSort(1).png)

同时，我们对堆中的结点按层进行编号，将这种逻辑结构映射到数组中就是下面这个样子

![heap array](./img/sort-algorithm-heapSort(2).png)

关于完全二叉树，我们需要知道如下关系

``` bash
      0
    /   \
   1     2          # 1 = 2*0+1    2 = 2*0+2
 /  \   /  \        
3    4 5    6       # 3 = 2*1+1    4 = 2*1+2    5 = 2*2+1    6 = 2*2+2

# leftChildIdx = 2 * parentIdx + 1
# rightChildIdx = 2 * parentIdx + 2
# lastUnLeafNodeIdx = Math.ceil(len / 2) - 1
```

假设当前节点 `index = i` , 则其左右叶子节点分别为 `2 * index + 1; 2 * index + 2;`
最后一个非叶子节点 `index = Math.ceil(len / 2) - 1`

该数组从逻辑上讲就是一个堆结构，我们用简单的公式来描述一下堆的定义就是：

大顶堆：`arr[i] >= arr[2i+1] && arr[i] >= arr[2i+2]`

小顶堆：`arr[i] <= arr[2i+1] && arr[i] <= arr[2i+2]`

![heap sort](./img/sort-algorithm-heapSort(3).gif)

1. 构造初始堆。将给定无序序列构造成一个大顶堆 (一般升序采用大顶堆，降序采用小顶堆)
2. 从最后一个非叶子节点开始，从右至左，从下到上处理，构建大顶堆
3. 交换堆顶与最后一个元素，将最大元素沉至数组末端
4. 重复以上步骤，至序列有序

``` js

```
