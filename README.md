manacle
=======

Manacle is a lightweight ACL implementation for Node.js and the browser.

Example
-------

Create a new ACL:

```javascript
var acl = manacle.create();
```

Define some rules:

```javascript
var user = { ... };

acl.allow('read', 'post');

if (user) {
    acl.allow('create', 'post');
    acl.allow(['update', 'delete'], 'post', function(post) {
        return post.user === user;
    });
    
    if (user.admin) {
        acl.allow('*', 'post');
    }
    
    if (user.blocked) {
        acl.deny(['create', 'update', 'delete'], 'post');
    }
}
```

Check various rules:

```javascript
var post = { ... };

// `true` for users who are not blocked
acl.allowed('create', 'post');

// `true` for all users (the given post object is ignored
// and unnecessary since there is no condition defined)
acl.allowed('read', 'post', post);

// `true` for users who are not blocked and either own
// the post or are an admin
acl.allowed('update', 'post', post);
acl.allowed('delete', 'post', post);

// `true` (undefined rules are denied by default)
acl.denied('foo', 'bar');
```
    
Note that the order in which the rules are defined matters as each newly
defined rule takes precedence over past rules.

Download
--------

Releases are available on [GitHub](https://github.com/scttnlsn/manacle/downloads)
or via [NPM](http://search.npmjs.org/#/manacle).

    npm install manacle

**Development:** [manacle.js](https://raw.github.com/scttnlsn/manacle.js/master/manacle.js)

**Production:**  [manacle.min.js](https://raw.github.com/scttnlsn/manacle.js/master/manacle.min.js)

API
---

#### allow(actions, subjects, condition)
#### deny(actions, subjects, condition)

Allow (or deny) the specified action(s) and subject(s),
optionally only if the given condition holds.

*Arguments:*

* actions - string or array of strings
* subjects - string or array of strings
* condition - function (optional)

#### allowed(action, subject, ...)
#### denied(action, subject, ...)

Check if the specified action(s) and subject(s) are allowed (or denied),
optionally checking a condition against any extra arguments.

*Arguments:*

* action - string
* subject - string
* additional arguments passed to condition function