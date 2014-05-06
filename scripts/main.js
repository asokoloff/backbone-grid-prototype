require.config({
    baseUrl: "scripts",
    //Increase the timeout time so if the server is insanely slow the client won't burst
    waitSeconds: 200,
    paths: {
        'jquery': 'vendor/jquery',
        // 'jquery-ui': 'vendor/jquery-ui',
        // 'jquery-drag' : 'vendor/jquery.event.drag',
        // 'jquery-drop' : 'vendor/jquery.event.drop',
        'underscore': 'vendor/underscore',
        'backbone': 'vendor/backbone',
        'marionette': 'vendor/backbone.marionette'
        // 'common': 'common',
        // 'slickcore': 'vendor/slick.core',
        // 'slickgrid' : 'vendor/slick.grid',
        // 'slickdataview' : 'vendor/slick.dataview'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        'marionette': {
            deps: ['jquery', 'underscore', 'backbone'],
            exports: 'Marionette'
        }
        // 'slickcore': {
        //     deps: ['jquery-ui']
        // },
        // 'slickgrid': {
        //     deps: ['slickcore', 'jquery-drag', 'jquery-drop']
        // },
        // 'slickdataview': {
        //     deps: ['slickgrid']
        // }
    }
});

require(['jquery', 'backbone', 'underscore', 'marionette'], function ($, Backbone, _, Marionette) {

    'use strict';

    var GridDemo = new Marionette.Application();

    GridDemo.addRegions({
        mainRegion: '#main-region'
    });

    GridDemo.ItemModel = Backbone.Model.extend({

        initialize: function () {
            this.childrenLoaded = false;
            this.parent = this.get('parent');
            if (this.parent) {
                this.set('level', this.parent.get('level') + 1);
                this.set('sortkey', this.parent.get('sortkey') + ' ' + this.get('id'));
            } else {
                this.set('level', 0);
                this.set('sortkey', this.get('id'));
            }
            // move to itemview
            this.folder_control = '';
            this.folder_style = '';
            if (this.get('hasChildren')) {
                this.closeFolder();
            }
        },

        // move to itemview
        openFolder: function () {
            this.isOpen = true;
            this.folder_control = 'V';
            this.folder_style = 'close-me';
        },

        // move to itemview
        closeFolder: function () {
            this.isOpen = false;
            this.folder_control = '>';
            this.folder_style = 'open-me';
        },

        // move to itemview
        isVisible: function () {
            var node = this.parent;
            while (node) {
                if (node.isOpen === false) {
                    return false;
                } else {
                    node = node.parent;
                }
            }
            return true;
        }
    });

    GridDemo.ItemCollection = Backbone.Collection.extend({
        model: GridDemo.ItemModel,

        comparator: 'sortkey',

        _uuidGenerator: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },

        getNodes: function (parent) {

            var hasChildren, i, newI;
            for (i = 0; i < 50; i++) {
                hasChildren = false;
                if (Math.random() > 0.5) {
                    hasChildren = true;
                }
                newI = new GridDemo.ItemModel({
                    'id': this._uuidGenerator(),
                    'title': 'Item ' + i,
                    'hasChildren': hasChildren,
                    'parent': parent
                });
                this.add(newI);
            }
            if (parent) {
                parent.childrenLoaded = true;
            }
        }
    });

    GridDemo.RowView = Marionette.ItemView.extend({
        model: GridDemo.ItemModel,
        events: {
            'click .open-me': 'openFolder',
            'click .close-me': 'closeFolder'
        },
        template: '#row-template',
        tagName: 'tr',

        initialize: function (options) {
            this.gridView = options.gridView;
        },

        openFolder: function () {
            var model = this.model,
            collection = model.collection,
            that = this;
            if (!model.get('hasChildren')) {
                throw('Tried to open something that is not a folder!');
            }
            model.openFolder();
            this.render();
            if (!model.childrenLoaded) {
                // setTimeout(function() {
                //     collection.getNodes(model);
                //     that.gridView.render();
                // }, 500);

                collection.getNodes(model);
                this.gridView.render();

            } else {
                this.gridView.render();
            }
        },

        closeFolder: function () {
            this.model.closeFolder();
            this.gridView.render();
        },

        serializeData: function () {
            return {
                model: this.model.toJSON(),
                folder_style: this.model.folder_style,
                folder_control: this.model.folder_control,
                indent: this.model.get('level') * 8
            };
        },

        onRender: function () {
            if (!this.model.isVisible()) {
                this.$el.hide();
            }
        }

    });

    GridDemo.GridView = Marionette.CollectionView.extend({
        tagName: 'table',
	className: 'table table-striped table-bordered table-condense',
        itemView: GridDemo.RowView,
        itemViewOptions: function () {
            return { gridView: this }
        }
    });

    GridDemo.on("initialize:after", function(){
        var onlyCollection = new GridDemo.ItemCollection();
        onlyCollection.getNodes();
        GridDemo.mainView = new GridDemo.GridView({
            collection: onlyCollection
        }); 
        GridDemo.mainRegion.show(GridDemo.mainView);
    });

    GridDemo.start();
});


/*

To get the index for a model:


*/

/* ------------------------------------- 

    
    // var grid;
    // var columns = [
    //     {id: "title", name: "Title", field: "title"},
    //     {id: "duration", name: "Duration", field: "duration"},
    //     {id: "%", name: "% Complete", field: "percentComplete"},
    //     {id: "start", name: "Start", field: "start"},
    //     {id: "finish", name: "Finish", field: "finish"},
    //     {id: "effort-driven", name: "Effort Driven", field: "effortDriven"}
    // ];

    // var options = {
    //     enableCellNavigation: true,
    //     enableColumnReorder: false
    // };

    // var data = [];
    // for (var i = 0; i < 500; i++) {
    //   data[i] = {
    //     title: "Task " + i,
    //     duration: "5 days",
    //     percentComplete: Math.round(Math.random() * 100),
    //     start: "01/01/2009",
    //     finish: "01/05/2009",
    //     effortDriven: (i % 5 == 0)
    //   };
    // }

    // grid = new Slick.Grid("#myGrid", data, columns, options);

*/
