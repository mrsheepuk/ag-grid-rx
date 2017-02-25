
ag-Grid-rx
==============

A fork of [ag-Grid](http://www.ag-grid.com) which supports the use of an RxJS observable for
the provision of data into the grid, giving efficient updating of the existing rows when
that observable emits new values. This makes it ideal for Angular (2+) combined with NgRx or
Redux for state management.

When using an observable data source, certain features of the main ag-Grid are not supported 
- see below for key differences.

#### Benefits
* Better in-browser performance when frequently updating large data sets which mostly stay
  the same between refreshes (particularly noticable on Internet Explorer).
* Fits in nicely with the recommended Angular (2+) architecture of uni-directional data 
  flow with immutable state, with changes notified by Observables (see NgRx, in particular).
* Selected rows are maintained through data refreshes, provided the relevant nodes are
  still present. If one or more of the selected nodes is removed from the data, the 
  selectionChanged event is fired.

#### Key differences to ag-Grid
* To use with an observable source:
    - Set the rowDataSource configuration option or call the setRowDataSource API method.
    - Set the rowModelType configuration option to 'observable'. 
    - You must also provide a rowDataSourceKeyProperty value. This identifies a 'primary 
      key' property which each item provided by the Observable must have.
* The 'primary key' must be unique within the supplied data, and constant for a given 
  'logical' data item.
* The objects provided by the Observable **must** be immutable if you wish the grid to 
  be updated with the updated values. For best performance, you should keep the same
  objects for rows whose data is unchanged, and provide new objects (with the same 'primary 
  key' value) for those rows whose data is updated. If you supply all-new objects each time,
  it will work, but you will not gain much performance over the non-Observable ag-Grid.
* Pagination, child / nested rows and row grouping are not supported for an Observable 
  data source. Fork this and implement it if you need it, my use case didn't need it and it 
  would add to the complexity of the Observable implementation.

For everything else, see the main [ag-Grid documentation](http://www.ag-grid.com/).

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
- **\dist\ag-grid-rx.js and \dist\ag-grid-rx.min.js** -> use these if not using a package manager and put 
ag-Grid-rx on the global scope. The new JavaScript distribution files contain the CSS for the grid, no need to 
reference separately.
- **\dist\styles** -> contains CSS files, used if doing your own bundling.
- **\dist\lib** -> contains compiled JavaScript files in CommonJS format.
- **\main.js** -> CommonJS root file, reference this file if importing project via CommonJS.
- **\main.d.ts** -> CommonJS root definition file.
