require.config({
    baseUrl: "scripts",
    waitSeconds: 200,
    paths: {
        'jquery': 'vendor/jquery-1.11.1',
        'underscore': 'vendor/underscore',
        'backbone': 'vendor/backbone',
        'marionette': 'vendor/backbone.marionette',
	'chance': 'vendor/chance.min'
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
    }
});

require(['jquery', 'backbone', 'underscore', 'marionette', 'chance'], function ($, Backbone, _, Marionette) {

    'use strict';

    var GridDemo = new Marionette.Application();

    GridDemo.addRegions({
        mainRegion: '#main-region'
    });

    GridDemo.ItemModel = Backbone.Model.extend({

	sortkeyDelimiter: '    ',

	sortkey: function (sortfield) {
            if (this.parent) {
                return this.parent.sortkey(sortfield) + this.sortkeyDelimiter + this.get(sortfield);
            } else {
                return this.get(sortfield);
            }
	},

        initialize: function () {
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
	    // return true;
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

    GridDemo.Items = Backbone.Collection.extend({
        model: GridDemo.ItemModel,

	sortkeyDelimiter: '    ',

	sortField: 'id',

	comparator: function (model) {
	    return model.sortkey(this.sortField);
	},

        addItem: function (model, parent) {

            model.parent = parent || null;
            model.childrenLoaded = false;
            model.isOpen = false;

            if (model.parent) {
                model.level = model.parent.level + 1;
                // model.sortkey = model.parent.sortkey + this.sortkeyDelimiter + model.get('id');
            } else {
                model.level = 0;
                // model.sortkey = model.get('id');
            }
            this.add(model);
        },

        _get_descendents: function (aModel) {
            var result = [],
            search_string = aModel.sortkey + this.sortkeyDelimiter;
            _.each(this.models, function (collectionModel) {
                if (collectionModel.sortkey.indexOf(search_string) === 0) {
                    result.push(collectionModel);
                }
            });
            return result;
        },

        _uuidGenerator: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },

        getNodes: function (parent) {

            var hasChildren, i, newI;
            for (i = 0; i < 20; i++) {
                hasChildren = false;
                if (Math.random() > 0.5) {
                    hasChildren = true;
                }
                newI = new GridDemo.ItemModel({
                    // 'id': this._uuidGenerator(),
		    'id': chance.hash({length: 10}),
                    'title': chance.name(),
		    'tel': chance.phone(),
		    'city': chance.city(),
                    'hasChildren': hasChildren
                });
		this.addItem(newI, parent);
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
                collection.getNodes(model);
                this.gridView.render();

            } else {
                this.gridView.render();
            }
        },

        closeFolder: function () {
            this.model.closeFolder();
	    this.render();
            this.gridView.render();
        },

        serializeData: function () {
            return {
                model: this.model.toJSON(),
                folder_style: this.model.folder_style,
                folder_control: this.model.folder_control,
                indent: 10 + this.model.level * 24
            };
        },

        onRender: function () {
            if (!this.model.isVisible()) {
                this.$el.hide();
            }
        }

    });

    GridDemo.GridView = Marionette.CompositeView.extend({
        template: '#gridview_template',
        itemViewContainer: "tbody",
        itemView: GridDemo.RowView,
        itemViewOptions: function () {
            return { gridView: this };
        },
	events: {
	    'click #id': 'idSort',
	    'click #title': 'titleSort',
	    'click #tel': 'telSort',
	    'click #city': 'citySort'
	},
	idSort: function (e) {
	    this.sortBy('id');
	},
	titleSort: function (e) {
	    this.sortBy('title');
	},
	telSort: function (e) {
	    this.sortBy('tel');
	},
	citySort: function (e) {
	    this.sortBy('city');
	},
	sortBy: function (field) {
	    this.collection.sortField = field;
	    this.collection.sort();
	    this.render();
	}
    });

    GridDemo.on("initialize:after", function(){
        var onlyCollection = new GridDemo.Items();
        onlyCollection.getNodes();
        GridDemo.mainView = new GridDemo.GridView({
            collection: onlyCollection
        }); 
        GridDemo.mainRegion.show(GridDemo.mainView);
    });

    GridDemo.start();
});

