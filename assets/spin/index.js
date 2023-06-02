(function () {
  console.log('初始化spin');
  function spinHide() {
    const spinDom = document.getElementById('spin');
    const timer = setTimeout(function () {
      spinDom.setAttribute('class', 'leave');
      clearTimeout(timer);
    }, 10000);

    function handler() {
      spinDom.removeEventListener('transitionend', handler);
      spinDom.remove();
      document.body.setAttribute('style', 'overflow: auto;');
    }

    spinDom.addEventListener('transitionend', handler);
  }

  document.body.setAttribute('style', 'overflow: hidden;');
  document.addEventListener('DOMContentLoaded', spinHide);
})();
