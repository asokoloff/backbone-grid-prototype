define([
    'underscore',
    'marionette',
    'gridmodel',
    'gridcollection',
    'gridview',
    'chance'
], function(_, Marionette, GridModel, GridCollection, GridView) {

    // this is a proper AMD load.
    var chance = new Chance();

    // Creates and manages a single instance of GridView
    var GridController = Marionette.Controller.extend({

        initialize: function () {
            var that = this;
            this.gridView = new GridView();
            this.gridView.collection = new GridCollection();

            // create top level nodes
            _.each(this.getDummyData(), function(data) {
                that.gridView.collection.addItem(new GridModel(data));
            });

            // listen for requests to load empty folders
            this.listenTo(this.gridView, "itemview:request_folder_contents", function(view) {
                that.populateFolder(view.model);
            });
        },

        populateFolder: function (parent) {
            var that = this;
            _.each(this.getDummyData(), function(data) {
                that.gridView.collection.addItem(new GridModel(data), parent);
            });
            parent.childrenLoaded = true;
            this.gridView.render();
        },

        getDummyData: function () {
            var result = [],
            hasChildren, i;
            for (i = 0; i < 20; i++) {
                hasChildren = false;
                if (Math.random() > 0.5) {
                    hasChildren = true;
                }
                result.push({
		    'id': chance.hash({length: 10}),
                    'title': chance.name(),
		    'tel': chance.phone(),
		    'city': chance.city(),
                    'hasChildren': hasChildren
                });
            }
            return result;
        }
    });

    return GridController;
});
