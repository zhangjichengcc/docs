/**

function arrange(name) {}

arrange('William')
 .wait(5)
 .do('commit')
 .waitFirst(3)
 .execute();
  
// 等待 3s
// > William is notified
// 等待 5s
// > Start to commit

 */

function arrange(name) {
  const stack = [];

  stack.push(() => console.log(`${name} is notified`));

  function wait(s) {
    stack.push(
      () =>
        new Promise((resolve) => {
          console.log(`wait ${s}s`);
          return setTimeout(resolve, s * 1e3);
        })
    );
    return this;
  }

  function doSomething(name) {
    stack.push(() => console.log(`Start to ${name}`));
    return this;
  }

  function waitFirst(s) {
    stack.unshift(() => {
      console.log(`wait ${s}s`);
      return new Promise((resolve) => setTimeout(resolve, s * 1e3));
    });
    return this;
  }

  async function execute() {
    while (stack.length) {
      const fn = stack.shift();
      await fn();
    }
  }

  return {
    wait,
    do: doSomething,
    waitFirst,
    execute,
  };
}

arrange('William').wait(5).do('commit').waitFirst(3).execute();
