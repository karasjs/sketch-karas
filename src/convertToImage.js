import { Document } from 'sketch/dom';
import UI from 'sketch/ui';
import parse from './parse';
import message from './message';

export default function () {
  let content = message.content || '🌈转换图片成功！🌈';
  UI.message(content);
}
