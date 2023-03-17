(function() {

  // 主题切换方法配置
  function themeConf() {
    const themeSwitchBtn = Docsify.dom.find('.theme-switch');
    const theme = window.localStorage.getItem('theme') || Docsify.dom.find('html').getAttribute('data-theme') || 'light';
    // 获取 theme 列表
    const themes = Docsify.dom.findAll('[data-style-theme]');
    let 
      lightCover = "background: linear-gradient(to left bottom, hsl(191, 100%, 85%) 0%,hsl(93, 100%, 85%) 100%)",
      darkCover = "background: linear-gradient(to left bottom, hsl(0deg 0% 0%) 0%,#3c3c3c 100%);";

    // 更新主题
    function updateTheme(theme) {
      themeSwitchBtn.setAttribute('data-theme', theme);
      Docsify.dom.find('html').setAttribute('data-theme', theme);
      window.localStorage.setItem('theme', theme);
      themes.forEach(function(item) {
      item.disabled = item.title !== theme;
      });
      if (theme === 'dark') {
        lightCover = Docsify.dom.find('section').getAttribute('style');
        Docsify.dom.find('section').setAttribute('style', darkCover);
      } else {
        Docsify.dom.find('section')?.setAttribute('style', lightCover);
      }
    }

    // 绑定主题切换方法
    themeSwitchBtn.onclick = function(e) {
      const curTheme = themeSwitchBtn.getAttribute('data-theme');
      const [nextTheme] = themes.map(i => i.title).filter(i => i !== curTheme);
      updateTheme(nextTheme);
    };

    updateTheme(theme);
  }

  // loading 隐藏
  function spinHide() {

    const spinDom = document.getElementById('spin');
    const timer = setTimeout(function() {
      spinDom.setAttribute('class', 'leave');
      clearTimeout(timer);
    }, 500);

    function handler() {
      spinDom.removeEventListener('transitionend', handler);
      spinDom.remove();
      document.body.setAttribute('style', 'overflow: auto;');
    }

    spinDom.addEventListener('transitionend', handler);
  }

  document.body.setAttribute('style', 'overflow: hidden;');
  window.onload = function() {
    themeConf();
    spinHide();
  }

})()