var assert = require("assert"),
  fuzzy = require("../js/fuzzy.js");

describe('fuzzy', function(){
  describe('#match', function(){
    it('should return 0 when no character matches', function(){
      assert.equal(0, fuzzy('main.js', 'foo').score);
    });

    it('should return one when only one character matches', function() {
      assert.equal(1, fuzzy('main.js', 'j').score);
    });

    it('should return one for multiple occurrences of the same char', function() {
      assert.equal(1, fuzzy('structure', 'u').score);
      assert.equal(1, fuzzy('foo', 'o').score);
    });

    it('should add bonus points for subsequent matches', function() {
      assert.equal(16, fuzzy('structure', 'struct').score);
      assert.equal(20, fuzzy('structure', 'structre').score);
    });

    it('should add additional information to matches', function() {
      var term = 'structure',
        query = 'struct',
        match = fuzzy(term, query);

      assert.ok(match.score != null);
      assert.equal(query, match.query);
      assert.ok(term, match.term);
      assert.ok(match.highlightedTerm != null);
    });

    it('should highlight matched terms', function() {
      var match = fuzzy('software', 'wae');

      assert.equal(match.highlightedTerm,
        'soft<em>w</em><em>a</em>r<em>e</em>');
    });
  });

  describe('#matchComparator', function() {
    it('should sort fuzzy matches', function() {
      var match0 = { score: 1 },
        match1 = { score: 0 },
        match2 = { score: 5 },
        match3 = { score: 2 },
        matches = [match0, match1, match2, match3];

      matches.sort(fuzzy.matchComparator);

      assert.deepEqual([match2, match3, match0, match1], matches);
    });
  });
});