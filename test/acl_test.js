var should = require('should');
var Acl = require('../manacle').Acl;

describe('Acl', function() {
    var acl;
    
    beforeEach(function() {
        acl = new Acl();
    });
    
    it('should initially deny everything', function() {
        acl.allowed('foo', 'bar').should.not.be.ok;
        acl.allowed('baz', 'qux').should.not.be.ok;
        acl.denied('foo', 'bar').should.be.ok;
        acl.denied('baz', 'qux').should.be.ok;
    });
    
    it('allows specified rules', function() {
        acl.allow('foo', 'bar');
        acl.allowed('foo', 'bar').should.be.ok;
    });
    
    it('matches most recently defined rules first', function() {
        acl.allow('foo', 'bar');
        acl.deny('foo', 'bar');
        acl.allowed('foo', 'bar').should.not.be.ok;
    });
    
    it('matches multiple actions', function() {
        acl.allow(['foo', 'bar'], 'baz');
        acl.allowed('foo', 'baz').should.be.ok;
        acl.allowed('bar', 'baz').should.be.ok;
    });
    
    it('matches multiple subjects', function() {
        acl.allow('foo', ['bar', 'baz']);
        acl.allowed('foo', 'bar').should.be.ok;
        acl.allowed('foo', 'baz').should.be.ok;
    });
    
    it('matches wildcard actions', function() {
        acl.allow('*', 'foo');
        acl.allowed('bar', 'foo').should.be.ok;
        acl.allowed('baz', 'foo').should.be.ok;
    });
    
    it('matches wildcard subjects', function() {
        acl.allow('foo', '*');
        acl.allowed('foo', 'bar').should.be.ok;
        acl.allowed('foo', 'baz').should.be.ok;
    });
    
    describe('when no condition is provided', function() {
        it('ignores extra arguments', function() {
            acl.allow('foo', 'bar');
            acl.allowed('foo', 'bar', 'baz').should.be.ok;
        });
    });
    
    describe('when a condition is provided', function() {
        beforeEach(function() {
            acl.allow('foo', 'bar', function(baz) {
                return baz === 'baz';
            });
        });
        
        it('denies match that does not include condition args', function() {
            acl.allowed('foo', 'bar').should.not.be.ok;
        });
        
        it('allows match only when condition is met', function() {
            acl.allowed('foo', 'bar', 'baz').should.be.ok;
            acl.allowed('foo', 'bar', 'qux').should.not.be.ok;
            acl.allowed('foo', 'bar', 'qux', 'baz').should.not.be.ok;
        });
    });
});