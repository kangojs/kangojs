# Release Management
As explained in a number of places the KangoJS codebase is made up multiple packages.  
All these packages are versioned and released to npm individually.  

I'm still experimenting with the exact release management strategy. For now npm releases are
manual and each package release will be git tagged with `<package-name>-<version>`.  
This might change as I start using Lerna more and gain experience working with a monorepo like this.
