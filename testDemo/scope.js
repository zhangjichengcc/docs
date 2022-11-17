function func1() {
  const value1 = 'value1';
  function func2() {
    const value2 = 'value2';
    function func3 () {
      const value3 = 'value3';
      console.log(value1);
      console.log(value2);
      console.log(value3);
    }
    return func3;
  }
  return func2;
}

const fn2 = func1();
const fn3 = fn2();
fn3();
