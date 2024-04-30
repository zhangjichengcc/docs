interface Config {
  duration?: number;
  begin: number;
}

const DEFAULT_DURATION = 1000;

class NumAnimation {
  private begin: number;
  private duration: number;
  private value: number;

  /**
   * 构造一个数字动画类。
   * 
   * @param {number} begin - 初始值
   */
  constructor(begin: number);
  /**
   * 构造一个数字动画类。
   * 
   * @param {Config} config - 配置对象
   * @param {number} config.begin - 初始值
   * @param {number} config.duration - 动画持续时间
   */
  constructor(config: Config);
  /**
   * 构造一个数字动画类。
   *
   * @param {number | Config} v - 初始值或配置对象。
   * 如果提供了一个数字，则将其作为初始值，并将持续时间设置为默认值。
   * 如果提供了一个配置对象，则从中提取初始值，并将持续时间设置为提供的值（如果有），否则设置为默认值。
   */
  constructor(v: number | Config) {
    if (typeof v === 'number') {
      this.begin = v;
      this.duration = DEFAULT_DURATION;
    } else {
      const { begin, duration } = v;
      this.begin = begin;
      this.duration = duration ?? DEFAULT_DURATION;
    }
    this.value = this.begin;
  }


  /**
   * 设置动画的起始值。
   *
   * @param {number} begin - 要设置的初始值。
   * @return {this} 当前动画实例。
   */
  setBegin(begin: number) {
    this.begin = begin;
    return this;
  }

  /**
   * 设置动画的持续时间。
   *
   * @param {number} duration - 动画的持续时间。
   * @return {this} 当前动画实例。
   */
  setDuration(duration: number) {
    this.duration = duration;
    return this;
  }

  /**
   * 执行动画
   * @param {number} end - 动画最终值
   * @param {(num: number) => void} callBack - 每帧执行的回调函数
   * @returns {NumAnimation} 返回自身实例以便链式调用
   */
  to(end: number, callBack: (num: number) => void) {
    const speed = (end - this.begin) / this.duration; // 计算每帧的速度
    const beginTime = Date.now(); // 记录动画开始时间
    const _run = () => {
      const time = Date.now() - beginTime; // 计算已经过去的时间
      const value = this.begin + speed * time; // 计算当前值
      if (time < this.duration) { // 判断是否动画已经结束
        this.value = value; // 更新当前值
        requestAnimationFrame(_run); // 下一帧
      } else { // 动画结束
        this.value = end; // 设置最终值
        this.begin = end; // 设置初始值
      }
      callBack(this.value); // 执行回调函数
    };
    _run(); // 执行动画
    return this; // 返回自身实例以便链式调用
  }
}

export default NumAnimation;

const a = new NumAnimation({
  begin: 0,
  duration: 3000
});

const b = new NumAnimation(0);

a.to(3000, v => console.log(v));

export {};