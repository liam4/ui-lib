// Useful telnet key detection.

const compareBufStr = (buf, str) => {
  return buf.equals(Buffer.from(str.split('').map(c => c.charCodeAt(0))))
}

const telchars = {
  isSpace: buf => buf[0] === 0x20,
  isEnter: buf => buf[0] === 0x0d,
  isTab: buf => buf[0] === 0x09,
  isBackTab: buf => buf[0] === 0x1b && buf[2] === 0x5A,
  isBackspace: buf => buf[0] === 0x7F,

  // isEscape is hard because it's just send as ESC (the ANSI escape code),
  // so we need to make sure that the escape code is all on its own
  // (i.e. the length is 1)
  isEscape: buf => buf[0] === 0x1b && buf.length === 1,

  // Use this for when you'd like to detect the user confirming or issuing a
  // command, like the X button on your PlayStation controller, or the mouse
  // when you click on a button.
  isSelect: buf => telchars.isSpace(buf) || telchars.isEnter(buf),

  // Use this for when you'd like to detect the user cancelling an action,
  // like the O button on your PlayStation controller, or the Escape key on
  // your keyboard.
  isCancel: buf => telchars.isEscape(buf),

  isUp: buf => buf[0] === 0x1b && buf[2] === 0x41,
  isDown: buf => buf[0] === 0x1b && buf[2] === 0x42,
  isRight: buf => buf[0] === 0x1b && buf[2] === 0x43,
  isLeft: buf => buf[0] === 0x1b && buf[2] === 0x44,

  isShiftUp: buf => compareBufStr(buf, '\x1b[1;2A'),
  isShiftDown: buf => compareBufStr(buf, '\x1b[1;2B'),
  isShiftRight: buf => compareBufStr(buf, '\x1b[1;2C'),
  isShiftLeft: buf => compareBufStr(buf, '\x1b[1;2D'),

  isPageUp: buf => compareBufStr(buf, '\x1b[5~'),
  isPageDown: buf => compareBufStr(buf, '\x1b[6~'),

  isCaselessLetter: (buf, letter) => compareBufStr(buf, letter.toLowerCase()) || compareBufStr(buf, letter.toUpperCase()),
  isCharacter: (buf, char) => compareBufStr(buf, char),
}

module.exports = telchars
