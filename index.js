
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
  var self = this,
      opts;
  opts = [
    'closable',
    'overlay',
    'escapable'
  ];

  // generate option methods

  opts.forEach(function(opt){
    self[opt] = function(){
      self._renderOpts.push(opt);
      return self;
    };
  });
  this._renderOpts = [];
  this.args = args;
}

// inherit from emitter

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
  return this.dialog;
};

/**
 * Show the dialog.
 *
 * @return {Dialog} to make it easy to add overlay etc
 */

Dialog.prototype.show = function(){
  var d;

  // use previously created dialog

  if (this.dialog) d = this.dialog;
  else d = this.init();

  // apply scheduled options

  this._renderOpts.forEach(function(opt){
    d[opt]();
  });
  d.show.apply(d, arguments);
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

    this.dialog.hide.apply(this.dialog, arguments);
    self.dialog = null;
  }
  return this;
};
