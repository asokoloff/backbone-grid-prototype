define(['backbone', 'gridmodel'], function(Backbone, GridModel) {

    var GridCollection = Backbone.Collection.extend({

        model: GridModel,

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
            } else {
                model.level = 0;
            }
            this.add(model);
        }

        // _get_descendents: function (aModel) {
        //     var result = [],
        //     search_string = aModel.sortkey + this.sortkeyDelimiter;
        //     _.each(this.models, function (collectionModel) {
        //         if (collectionModel.sortkey.indexOf(search_string) === 0) {
        //             result.push(collectionModel);
        //         }
        //     });
        //     return result;
        // },

    });

    return GridCollection;
});
