(function() {
    
    var manacle = {};
    var root = this;
    var orig = root.manacle;
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = manacle;
    } else {
        root.manacle = manacle;
    }

    manacle.VERSION = '0.1.0';

    manacle.noConflict = function() {
        root.manacle = orig;
        return manacle;
    };

    manacle.create = function() {
        return new Acl();
    };
    
    manacle.Rule = Rule;
    manacle.Acl = Acl;
    
    // Rule
    // ---------------
    
    function Rule(allowed, actions, subjects, condition) {
        this.allowed = allowed;
        this.actions = actions;
        this.subjects = subjects;
        this.condition = condition;

        if (!isArray(this.actions)) {
            this.actions = [this.actions];
        }
        if (!isArray(this.subjects)) {
            this.subjects = [this.subjects];
        }
    };

    Rule.prototype.matchAction = function(action) {
        return this.actions.indexOf(action) >= 0 ||
            this.actions.indexOf('*') >= 0;
    };

    Rule.prototype.matchSubject = function(subject) {
        return this.subjects.indexOf(subject) >= 0 ||
            this.subjects.indexOf('*') >= 0;
    };

    Rule.prototype.match = function(action, subject) {
        return this.matchAction(action) && this.matchSubject(subject);
    };

    Rule.prototype.check = function(args) {
        if (this.condition !== undefined) {
            return this.condition.apply(this, args);
        } else {
            return true;
        }
    };
    
    // Acl
    // ---------------
    
    function Acl() {
        this.rules = [];
    };

    Acl.prototype.allow = function(action, subject, condition) {
        this.rules.push(new Rule(true, action, subject, condition));
    };

    Acl.prototype.deny = function(action, subject, condition) {
        this.rules.push(new Rule(false, action, subject, condition));
    };

    Acl.prototype.allowed = function(action, subject) {
        var args = [].slice.call(arguments, 2);
        var matches = this.matches(action, subject);

        for (var i = 0; i < matches.length; i++) {
            if (matches[i].check(args)) {
                return matches[i].allowed;
            }
        }

        return false;
    };

    Acl.prototype.denied = function(action, subject) {
        return !this.allowed.apply(this, arguments);
    };

    Acl.prototype.matches = function(action, subject) {
        var rules = this.rules.slice().reverse();
        var matches = [];

        for (var i = 0; i < rules.length; i++) {
            if (rules[i].match(action, subject)) {
                matches.push(rules[i]);
            }
        }

        return matches;
    };
    
    // Helpers
    // ---------------
    
    function isArray(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };
    
})();