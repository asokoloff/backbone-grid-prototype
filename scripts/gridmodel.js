define(['backbone'], function(Backbone) {

    var GridModel = Backbone.Model.extend({

	sortkeyDelimiter: '    ',

	sortkey: function (sortfield) {
            if (this.parent) {
                return this.parent.sortkey(sortfield) + this.sortkeyDelimiter + this.get(sortfield);
            }
            return this.get(sortfield);
	}
    });

    return GridModel;
});
