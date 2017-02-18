
ag-Grid-rx
==============

A fork of [ag-Grid](http://www.ag-grid.com) which allows the use of an RxJS observable for
the provision of data into the grid, along with efficient updating of the existing rows when
that observable emits new values. This makes it ideal for Angular (2+) combined with NgRx or
Redux for state management.

The benefit of this is better performance, particularly on Internet Explorer (which struggles
with large grids of many columns against large data sets), for frequent live updating of large
data sets which mostly stay the same between refreshes.

In general, follow the usage guidelines for ag-Grid. The key difference is that setRowData can 
take an Observable<any[]> instead of a simple any[]. Each time this observable emits new data, 
the grid will attempt to map any identical objects to existing rows, instead of re-creating 
the entire grid.

To do this, the *data items must have a "natural ID" property, named 'id'*, which must be unique
within the data set and constant for a logical data item within that set. For correct 
functionality, the data objects supplied by the observable must be immutable - i.e. if the 
values for a row of data are changed, a *new object* with the same value for "id" must be 
provided. If the same object is re-used, *the grid will not be updated*. This model is designed 
to work well with state management libraries such as Flux, Redux, NgRx, et al. 

If no 'id' property is provided, or the data is not provided as an observable, the grid
should behave similarly to the default ag-Grid. But if you're not using an observable, 
you should probably just use the main ag-Grid components :) 

The only other key difference is that any selection is maintained when new data is emitted
by the provided observable, rather than the selection being fully cleared each time the data
is refreshed.

#### Install with Npm
```sh
$ npm install ag-grid-rx
```

#### Use with Angular (2+)
```sh
$ npm install ag-grid-rx-ng
```
See [ag-grid-rx-ng](https://github.com/mrsheepuk/ag-grid-rx-ng).

Building
==============

To build:
- `npm install`
- `npm install gulp -g`
- `bower install`
- `gulp` or `gulp release`

Default gulp task is for development. It includes source maps, does not include minification, and starts a watch.

'release' gulp task does minification and no source maps. This is for releasing.

Folder Structure
==============
The build has the following structure:
- **\src** -> contains source files (TypeScript and CSS), don't touch these!
- **\dist** -> contains distribution files
- **\dist\ag-grid.js and \dist\ag-grid.min.js** -> use these if not using a package manager and put ag-Grid on
the global scope. The new JavaScript distribution files contain the CSS for the grid, no need to reference
separately.
- **\dist\styles** -> contains CSS files, used if doing your own bundling.
- **\dist\lib** -> contains compiles JavaScript files in CommonJS format.
- **\main.js** -> CommonJS root file, reference this file if importing project via CommonJS.
- **\main.d.ts** -> CommonJS root definition file.
