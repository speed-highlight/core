const black_ = '\x1b[30m',
  red_ = '\x1b[31m',
  green_ = '\x1b[32m',
  gray_ = '\x1b[90m',
  yellow_ = '\x1b[33m',
  blue_ = '\x1b[34m',
  magenta_ = '\x1b[35m',
  cyan_ = '\x1b[36m',
  white_ = '\x1b[37m';

export default {
  deleted: red_,
  var: red_,
  err: red_,
  kwd: red_,
  num: yellow_,
  class: yellow_,
  cmnt: gray_,
  insert: green_,
  str: green_,
  str: green_,
  bool: cyan_,
  type: blue_,
  oper: blue_,
  section: magenta_,
  func: magenta_
};