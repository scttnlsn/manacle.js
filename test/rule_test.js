var should = require('should');
var Rule = require('../manacle').Rule;

describe('Rule', function() {
    it('accepts single action', function() {
        var rule = new Rule(true, 'foo');
        rule.matchAction('foo').should.be.ok;
        rule.matchAction('bar').should.not.be.ok;
    });
    
    it('accepts multiple actions', function() {
        var rule = new Rule(true, ['foo', 'bar']);
        rule.matchAction('foo').should.be.ok;
        rule.matchAction('bar').should.be.ok;
    });
    
    it('accepts wildcard actions', function() {
        var rule = new Rule(true, '*');
        rule.matchAction('foo').should.be.ok;
    });
    
    it('accepts single subject', function() {
        var rule = new Rule(true, null, 'foo');
        rule.matchSubject('foo').should.be.ok;
        rule.matchSubject('bar').should.not.be.ok;
    });
    
    it('accepts multiple subject', function() {
        var rule = new Rule(true, null, ['foo', 'bar']);
        rule.matchSubject('foo').should.be.ok;
        rule.matchSubject('bar').should.be.ok;
    });
    
    it('accepts wildcard subjects', function() {
        var rule = new Rule(true, null, '*');
        rule.matchSubject('foo').should.be.ok;
    });
    
    it('matches actions and subjects', function() {
        var rule = new Rule(true, ['foo', 'bar'], ['baz', 'qux']);
        
        rule.match('foo', 'baz').should.be.ok;
        rule.match('foo', 'qux').should.be.ok;
        rule.match('bar', 'baz').should.be.ok;
        rule.match('bar', 'qux').should.be.ok;
        rule.match('baz', 'foo').should.not.be.ok;
        rule.match('qux', 'foo').should.not.be.ok;
        rule.match('baz', 'bar').should.not.be.ok;
        rule.match('qux', 'bar').should.not.be.ok;
        
        var rule = new Rule(true, '*', ['baz', 'qux']);
        
        rule.match('foo', 'baz').should.be.ok;
        rule.match('foo', 'qux').should.be.ok;
        rule.match('bar', 'baz').should.be.ok;
        rule.match('bar', 'qux').should.be.ok;
        rule.match('baz', 'foo').should.not.be.ok;
        rule.match('qux', 'foo').should.not.be.ok;
        rule.match('baz', 'bar').should.not.be.ok;
        rule.match('qux', 'bar').should.not.be.ok;
        
        var rule = new Rule(true, ['foo', 'bar'], '*');
        
        rule.match('foo', 'baz').should.be.ok;
        rule.match('foo', 'qux').should.be.ok;
        rule.match('bar', 'baz').should.be.ok;
        rule.match('bar', 'qux').should.be.ok;
        rule.match('baz', 'foo').should.not.be.ok;
        rule.match('qux', 'foo').should.not.be.ok;
        rule.match('baz', 'bar').should.not.be.ok;
        rule.match('qux', 'bar').should.not.be.ok;
    });
    
    it('checks optional conditions', function() {
        var rule = new Rule(true, null, null, function(foo) {
            return foo === 'foo';
        });
        
        rule.check(['foo']).should.be.ok;
        rule.check(['bar']).should.not.be.ok;
        
        var rule = new Rule();
        
        rule.check(['foo', 'bar']).should.be.ok;
    });
});