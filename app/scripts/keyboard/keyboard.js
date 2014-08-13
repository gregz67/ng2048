'use strict';

angular.module('Keyboard', [])
  .service('KeyboardService', function($document) {

    var keyboardMap = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };

    // initialize the keyboard event bindings
    this.init = function() {
      var self = this;
      this.keyEventHandlers = [];
      $document.bind('keydown', function(evt) {
        var key = keyboardMap[evt.which];

        if (key) {
          // one of our keys was pressed
          evt.preventDefault();
          self._handleKeyEvent(key, evt);
        }
      });
    };

    // bind event handlers to call when and event is fired
    this.keyEventHandlers = [];
    this.on = function(cb) {
      this.keyEventHandlers.push(cb);
    };

    this._handleKeyEvent = function(key, evt) {
      var callbacks = this.keyEventHandlers;
      if (!callbacks) {
        return;
      }

      evt.preventDefault();
      if (callbacks) {
        for (var x = 0; x < callbacks.length; x++) {
          var cb = callbacks[x];
          cb(key, evt);
        }
      }

    };
  });