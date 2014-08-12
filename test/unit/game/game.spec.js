/**
 */
'use strict';

describe('Game Module', function() {

  describe('GameManager', function() {
    var gameManager, _gridService;

    beforeEach(module('Game'));

    beforeEach(module(function($provide) {
      _gridService = {
        buildEmptyGameBoard: angular.noop,
        buildStartingPosition: angular.noop,
        anyCellsAvailable: angular.noop,
        tileMatchesAvailable: angular.noop,
        getSize: function() {
          return 4;
        }
      };

      // switch out GridService with mock
      $provide.value('GridService', _gridService);

    }));

    beforeEach(inject(function(GameManager) {
      gameManager = GameManager;
    }));

    it('should have a GameManager', function() {
      expect(gameManager).toBeDefined();
    });

    describe('.newGame', function() {
      it('should call the GridService to build an empty board', function() {
        spyOn(_gridService, 'buildEmptyGameBoard').andCallThrough();
        gameManager.newGame();
        expect(_gridService.buildEmptyGameBoard).toHaveBeenCalled();
      });
      it ('should call the GridService to place initial pieces', function() {
        spyOn(_gridService, 'buildStartingPosition').andCallThrough();
        gameManager.newGame();
        expect(_gridService.buildStartingPosition).toHaveBeenCalled();
      });
      it('should call reinit after', function() {
        spyOn(gameManager, 'reinit').andCallThrough();
        gameManager.newGame();
        expect(gameManager.reinit).toHaveBeenCalled();
      });
    });

    describe('.movesAvailable', function() {
      it('should report true if there are cells available', function() {
        spyOn(_gridService, 'anyCellsAvailable').andReturn(true);
        expect(gameManager.movesAvailable()).toBeTruthy();
      });

      it('should report true if there are matches available', function() {
        spyOn(_gridService, 'anyCellsAvailable').andReturn(false);
        spyOn(_gridService, 'tileMatchesAvailable').andReturn(true);
        expect(gameManager.movesAvailable()).toBeTruthy();
      });

      it('should report false if there are no cells nor matches available', function() {
        spyOn(_gridService, 'anyCellsAvailable').andReturn(false);
        spyOn(_gridService, 'tileMatchesAvailable').andReturn(false);
        expect(gameManager.movesAvailable()).toBeFalsy();
      });

    });

  });

});