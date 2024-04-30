const _obj = {
  id: 1,
  name: '部门1',
  pid: 0,
  children: [
    {
      id: 2,
      name: '部门2',
      pid: 1,
      children: [],
    },
    {
      id: 3,
      name: '部门3',
      pid: 1,
      children: [
        {
          id: 4,
          name: '部门4',
          pid: 3,
          children: [
            {
              id: 5,
              name: '部门5',
              pid: 4,
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

const _arr = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
];

interface Obj {
  id: number;
  name: string;
  pid: number;
  children?: Array<Obj>;
}

type Arr = Array<Obj>;

// function object2array(obj: Obj, arr?: Arr): Arr {
//   arr = arr || [];
//   arr.push(obj);
//   const { children = [] } = obj;
//   children.forEach((item) => {
//     object2array(item, arr);
//   });
//   return arr;
// }

// function object2array(obj: Obj): Arr {
//   const stack = [],
//     arr = [];
//   stack.push(obj);
//   while (stack.length) {
//     const item: Obj = stack.pop()!;
//     const { children = [] } = item;
//     arr.push(item);
//     if (children.length) {
//       stack.push(...children);
//     }
//   }
//   return arr;
// }

// const arr = object2array(obj);

// function array2object(arr: Arr): Obj {
//   function getChildren(arr: Arr, pid: number): Arr {
//     const children = [];
//     for (let i = 0; i < arr.length; i++) {
//       if (arr[i].pid === pid) {
//         const item = arr.splice(i--, 1)[0];
//         children.push({
//           ...item,
//           children: getChildren(arr, item.id),
//         });
//       }
//     }
//     return children;
//   }

//   return getChildren(arr, 0)[0];
// }

function array2object(arr: Arr): Obj {
  const map = new Map();
  arr.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, { ...item, children: [] });
    } else {
      // const children = map.get(item.id)!.children;
      map.set(item.id, { ...item, children: map.get(item.id)!.children });
    }
    if (map.has(item.pid)) {
      const parent = map.get(item.pid)!;
      parent.children = parent.children || [];
      parent.children.push(map.get(item.id)!);
    } else {
      map.set(item.pid, {
        children: [map.get(item.id)],
      });
    }
  });
  return map.get(0)!;
}

const obj = array2object(_arr);
