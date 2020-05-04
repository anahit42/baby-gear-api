# Contributing to baby-gear-api

## Code Contributions

#### Step 1: Clone

Clone the project from [GitHub](https://github.com/anahit42/baby-gear-api)
   
   ``` bash
   $ git clone git@github.com:anahit42/baby-gear-api.git
   $ cd baby-gear-api
   ```

#### Step 2: Branch

Create a new branch with issue number:

   ``` bash
   $ git checkout -b API-111
   ```

#### Step 3: Before Commit

Your code is unlikely be committed if linting is not applied.
Thus make sure you run the following before the commit:
 - `npm run lint`

#### Step 4: Commit

Make sure git knows your name and email address:

   ``` bash
   $ git config --global user.name "Example User"
   $ git config --global user.email "user@example.com"
   ```
    
Add and commit:

   ``` bash
   $ git add my/changed/files
   $ git commit
   ```
    
Commit your changes following this [Commit message guidelines](#commit-message-guidelines)
   
#### Step 6: Push

Push your working branch:

   ``` bash
   $ git push origin API-111
   ```

#### Step 7: Pull Request

Open a Pull Request with a clear title and description.


## Commit message guidelines

### Separate subject from body with a blank line

Firstly, not every commit requires both a subject and a body. 
Sometimes a single line is fine, especially when the change is so simple that no 
further context is necessary.

For example:

```text
Fix typo in user model documentation
```

However, when a commit merits a bit of explanation and context, you need to write a body.
For example:

```text
Modify user model to include address schema

- require address schema definition and use for user model address fields
- apply linting

```

### Limit the subject line to 50 characters

50 characters is not a hard limit, just a rule of thumb. Keeping subject lines at this 
length ensures that they are readable, and forces the author to think for 
a moment about the most concise way to explain what’s going on.

### Capitalize the subject line

This is as simple as it sounds. Begin all subject lines with a capital letter.

For example:
```text
Accelerate to 88 miles per hour
```

Instead of:

```text
accelerate to 88 miles per hour
```


### Do not end the subject line with a period

Trailing punctuation is unnecessary in subject lines. Besides, space is precious when
you’re trying to keep them to 50 chars or less. Treat it like title, not a sentence.

Example:
```text
Open the pod bay doors
```
Instead of:
```text
Open the pod bay doors.
```

### Use the imperative mood in the subject line

Imperative mood just means “spoken or written as if giving a command or instruction”.
A few examples:

- Clean your room
- Close the door
- Take out the trash

One reason for this is that Git itself uses the imperative whenever it creates
a commit on your behalf. For example, the default message created when using git merge reads:

```text
Merge branch 'API-111'
```

So when you write your commit messages in the imperative, you’re following Git’s own built-in 
conventions. For example:

- Refactor subsystem X for readability
- Update getting started documentation
- Remove deprecated methods
- Release version 1.0.0

Instead of:

- Fixed bug with Y
- Changing behavior of X
- More fixes for broken stuff
- Sweet new API methods

When in doubt, try to apply the following rule:

If applied, this commit will `your subject line here`

### Wrap the body at 72 characters

Git never wraps text automatically. When you write the body of a commit message,
you must mind its right margin, and wrap text manually.

### Use the body to explain what and why vs. how

This commit from Bitcoin Core is a great example of explaining what changed and why:

```text
commit eb0b56b19017ab5c16c745e6da39c53126924ed6
Author: Pieter Wuille <pieter.wuille@gmail.com>
Date:   Fri Aug 1 22:57:55 2014 +0200

   Simplify serialize.h's exception handling

   Remove the 'state' and 'exceptmask' from serialize.h's stream
   implementations, as well as related methods.

   As exceptmask always included 'failbit', and setstate was always
   called with bits = failbit, all it did was immediately raise an
   exception. Get rid of those variables, and replace the setstate
   with direct exception throwing (which also removes some dead
   code).

   As a result, good() is never reached after a failure (there are
   only 2 calls, one of which is in tests), and can just be replaced
   by !eof().

   fail(), clear(n) and exceptions() are just never called. Delete
   them.
```
