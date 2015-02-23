define([
    'marionette',
    'gridrowview'
], function(Marionette, GridRowView) {

    var GridView = Marionette.CompositeView.extend({
        template: '#gridview_template',
        itemViewContainer: "tbody",
        itemView: GridRowView,
        itemViewOptions: function () {
            return { gridView: this };
        },
	events: {
	    'click #id': 'idSort',
	    'click #title': 'titleSort',
	    'click #tel': 'telSort',
	    'click #city': 'citySort'
	},
	idSort: function () {
	    this.sortBy('id');
	},
	titleSort: function () {
	    this.sortBy('title');
	},
	telSort: function () {
	    this.sortBy('tel');
	},
	citySort: function () {
	    this.sortBy('city');
	},
	sortBy: function (field) {
	    this.collection.sortField = field;
	    this.collection.sort();
	    this.render();
	}
    });

    return GridView;
});
