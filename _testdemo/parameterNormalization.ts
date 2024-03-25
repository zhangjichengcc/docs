/**
 * 参数归一化
 */

// 实现一个方法，满足以下功能
/*
format(new Date(), 'datetime');                          // 2024-03-21 17:52:01
format(new Date(), 'date');                              // 2024-03-21 
format(new Date(), 'datetime', false);                   // 2024-3-21 17:52:1
format(new Date(), 'date', false);                       // 2024-3-21
format(new Date(), 'yyyy年MM月dd日 HH:mm:ss');            // 2024年03月21日 17:52:01
format(new Date(), (dateInfo) => {                       // 今年
  const {year} = dateInfo;
  const thisYear = new Date().getFullYear();
  const diff = year - thisYear;
  if (diff === 0) return '今年';
  return diff > 0 ? `${diff}年后` : `${diff}年前`;
})
*/

/**
 * 日期信息
 */
type DateInfo = {
  year: number;
  month: number;
  date: number;
  hour: number;
  minute: number;
  second: number;
  yyyy: string;
  MM: string;
  dd: string;
  HH: string;
  mm: string;
  ss: string;
};

/** 格式化字符串 */
type FormatterStr = 'date' | 'datetime' | string;

/** 日期格式化函数 */
type FormatterFn = (dateInfo: DateInfo) => string;

/** 日期格式化规则 */
type Formatter = FormatterStr | FormatterFn;

type GetKeysByType<T, P> = {
  [K in keyof T]: T[K] extends P ? K : never;
}[keyof T];

/**
 * 根据提供的日期和是否填充值创建 DateInfo 对象
 *
 * @param {Date} date - 日期对象
 * @param {Boolean} [isPad] - 是否补0，默认为true
 * @return {DateInfo} 日期信息对象
 */
function createDateInfo(date: Date, isPad?: Boolean): DateInfo {
  // isPad 默认值为 true
  isPad = isPad ?? true;
  const year = date.getFullYear(),
    month = date.getMonth() + 1,
    _date = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds();
  const dateInfo = {
    year,
    month,
    date: _date,
    hour,
    minute,
    second,
    yyyy: isPad ? year.toString().padStart(4, '0') : year.toString(),
    MM: isPad ? month.toString().padStart(2, '0') : month.toString(),
    dd: isPad ? _date.toString().padStart(2, '0') : _date.toString(),
    HH: isPad ? hour.toString().padStart(2, '0') : hour.toString(),
    mm: isPad ? minute.toString().padStart(2, '0') : minute.toString(),
    ss: isPad ? second.toString().padStart(2, '0') : second.toString(),
  };
  // 锁定非可遍历数据
  Object.defineProperties(dateInfo, {
    year: {
      enumerable: false,
    },
    month: {
      enumerable: false,
    },
    date: {
      enumerable: false,
    },
    hour: {
      enumerable: false,
    },
    minute: {
      enumerable: false,
    },
    second: {
      enumerable: false,
    },
  });
  return dateInfo;
}

/**
 * 使用提供的格式化函数格式化给定的日期信息
 *
 * @param {DateInfo} dateInfo - 日期信息.
 * @param {FormatterFn} fn - 格式化函数.
 * @return {string} str - 格式化后的字符串.
 */
function _formatFn(dateInfo: DateInfo, fn: FormatterFn) {
  return fn(dateInfo);
}

/**
 * 根据提供的格式化字符串创建格式化函数
 *
 * @param {FormatterStr} str - 格式化字符串
 * @return {FormatterFn} 格式化方法
 */
function createFormatterByStr(str: FormatterStr): FormatterFn {
  // 这里也可以进行参数归一化，date datetime 也可以看作是一种字符串格式化的形式
  str =
    {
      date: 'yyyy-MM-dd',
      datetime: 'yyyy-MM-dd HH:mm:ss',
    }[str] || str;
  return function (dateInfo: DateInfo) {
    Object.keys(dateInfo).forEach((key) => {
      str = str.replace(
        new RegExp(key, 'g'),
        dateInfo[key as GetKeysByType<DateInfo, string>]
      );
    });
    return str;
  };
}

// 函数重载：当 formatter 为字符串类型时，可以选择是否传递 isPad 参数
function format(date: Date, formatter: FormatterStr, isPad?: Boolean): string;

// 函数重载：当 formatter 为函数类型时，不接受 isPad 参数
function format(date: Date, formatter: FormatterFn): string;

/**
 * 日期格式化函数
 * @param {Date} date
 * @param {Formatter} formatter
 * @param {Boolean} isPad
 * @returns {string}
 * @description 日期格式化函数
 */
function format(date: Date, formatter: Formatter, isPad?: Boolean): string {
  // 获取日期数据
  const dateInfo = createDateInfo(date, isPad);

  /**
   * 参数归一化方法，将所有情况归纳为一种.
   *
   * @param {Formatter} formatter - The formatter to be used for formatting the date information. It can be either a function or a string.
   * @return {any} The formatted date information.
   * @throws {Error} If the formatter is not a function or a string.
   */
  function _formatNormalize(formatter: Formatter) {
    formatter =
      typeof formatter === 'string'
        ? createFormatterByStr(formatter)
        : formatter;
    if (typeof formatter !== 'function') {
      throw new Error('formatter must be function or string');
    }
    return _formatFn(dateInfo, formatter);
  }

  return _formatNormalize(formatter);
}

const a = format(new Date(), 'datetime');

const b = format(new Date(), (dateInfo) => {
  // 今年
  const { year } = dateInfo;
  const thisYear = new Date().getFullYear();
  const diff = year - thisYear;
  if (diff === 0) return '今年';
  return diff > 0 ? `${diff}年后` : `${diff}年前`;
});

debugger;
