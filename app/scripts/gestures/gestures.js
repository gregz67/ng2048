'use strict';

angular.module('Gestures', [])
  .service('GesturesService', function($document) {

    // initialize the keyboard event bindings
    this.init = function() {
      var self = this;
      this.gestureEventHandlers = [];

      $document.bind('swipeleft', function(evt) {
        evt.preventDefault();
        self._handleGestureEvent('left', evt);
      });
      $document.bind('swiperight', function(evt) {
        evt.preventDefault();
        self._handleGestureEvent('right', evt);
      });
      $document.bind('swipeup', function(evt) {
        evt.preventDefault();
        self._handleGestureEvent('up', evt);
      });
      $document.bind('swipedown', function(evt) {
        evt.preventDefault();
        self._handleGestureEvent('down', evt);
      });
    };

    // bind event handlers to call when and event is fired
    this.gestureEventHandlers = [];
    this.on = function(cb) {
      this.gestureEventHandlers.push(cb);
    };

    this._handleGestureEvent = function(direction, evt) {
      var callbacks = this.gestureEventHandlers;
      if (!callbacks) {
        return;
      }

      evt.preventDefault();
      if (callbacks) {
        for (var x = 0; x < callbacks.length; x++) {
          var cb = callbacks[x];
          cb(direction, evt);
        }
      }

    };
  });