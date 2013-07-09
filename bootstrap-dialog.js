/*
 * require dependencies
 */
var template = require('./template'),
    o = require('jquery'),
    dialog = require('dialog'),
    Dialog = dialog.Dialog,
    Draggy = require('draggy'),
    attr = require('attr'),
    stylar = require('stylar');

/*
 * create new instance
 * call the Dialog super constructor
 */
function BootstrapDialog (options) {
  return Dialog.call(this, options);
}
/*
 * inherit the prototype of Dialog
 */
BootstrapDialog.prototype = Object.create(Dialog.prototype);

/*
 * override the render function
 *  - change template from dialogs to this
 *  - add footer functionality
 *  - call the super render function
 */
BootstrapDialog.prototype.render = function(options){
  var foot = options.foot,
      el;
  
  this.template = template;
  el = this.el = o(this.template);

  if (!foot) {
    el.find('.modal-footer').remove();
  } else {
    if ('string' == typeof foot) {
      el.find('.modal-footer').text(foot);
    } else if (foot) {
      el.find('.modal-footer').append(foot.el || foot);
    }
  }

  Dialog.prototype.render.call(this, options);
};

BootstrapDialog.prototype.movable = function () {
  /*
   * make header-text unselectable and set cursor to move
   */
  var header = this.el.find('.modal-header')[0];
  if (header) {
    attr(header)
      .set('unselectable', 'on');
    stylar(header)
      .set('user-select', 'none')
      .set('cursor', 'move');
  }
  /*
   * make el draggable
   */
  new Draggy(this.el[0]);
  return this;
  /*
   * TODO:
   * make whole el moveable but just title draggable
   */
};

module.exports = function (title, msg, foot) {
  switch (arguments.length) {
    case 3:
      return new BootstrapDialog({ title: title, message: msg, foot: foot });
    case 2:
      return new BootstrapDialog({ title: title, message: msg });
    case 1:
      return new BootstrapDialog({ message: title });
  }
};

module.exports.BootstrapDialog = BootstrapDialog;
