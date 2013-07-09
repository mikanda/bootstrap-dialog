
/**
 * Module dependencies.
 */

var dialog = require('./bootstrap-dialog'),
    Emitter = require('emitter');

/**
 * Module exports.
 */

module.exports = function(){
  var args = Array.prototype.slice.call(arguments);
  return new Dialog(args);
};

/**
 * More bulletproof implementation of dialog built on top of the
 * bootstrap abstraction.  Can be used with multiple instances.
 */

function Dialog(args) {
  this.args = args;
}
Emitter(Dialog.prototype);

/**
 * Initialize the instance with a new dialog.
 */

Dialog.prototype.init = function(){
  var self = this,
      emit = this.emit.bind(this),
      methods,
      events;

  // events to delegate

  events = [
    'show',
    'hide',
    'close'
  ];

  // methods to proxy

  methods = [
    'overlay',
    'closable',
    'escapable'
  ];

  // create new dialog on the fly

  this.dialog = dialog.apply(null, this.args);

  // delegate the important events

  events.forEach(function(event){
    self.dialog.on(event, function(){
      var args = Array.prototype.slice.call(arguments);
      args.unshift(event);

      // delegate event

      self.emit.apply(self, args);
    });
  });
  methods.forEach(function(method){
    self[method] = function(){
      if (self.dialog) {
        self.dialog[method].apply(self.dialog, arguments);
      }
      return self;
    };
  });
  return this.dialog;
};

/**
 * Show the dialog.
 *
 * @return {Dialog} to make it easy to add overlay etc
 */

Dialog.prototype.show = function(){
  if (this.dialog) {
    this.dialog.show.apply(this.dialog, arguments);
    return this;
  }
  this.init().show().overlay();
  return this;
};

/**
 * Hide the dialog.
 *
 * @return {Dialog} for chaining
 */

Dialog.prototype.hide = function(){
  var self = this;
  if (this.dialog) {

    // remove the nested instance

    this.dialog.on('hide', function(){
      self.dialog = null;
    });
    this.dialog.hide.apply(this.dialog, arguments);
  }
  return this;
};
