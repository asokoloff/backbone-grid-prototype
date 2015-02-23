define([
    'marionette',
    'gridmodel'
], function(Marionette, GridModel) {

    var GridRowView = Marionette.ItemView.extend({
        model: GridModel,
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
            var model = this.model;
            if (!model.get('hasChildren')) {
                throw('Tried to open something that is not a folder!');
            }
            model.isOpen = true;
            if (model.childrenLoaded) {
                this.gridView.render();
                // this.trigger("request_folder_refresh");
            } else {
                this.trigger("request_folder_contents");
            }
        },

        closeFolder: function () {
            this.model.isOpen = false;
            this.gridView.render();
            // this.trigger("request_folder_refresh");
        },

        serializeData: function () {
            var folderControl = '';
            var folderStyle = '';
            if (this.model.get('hasChildren')) {
                if (this.model.isOpen) {
                    folderControl = 'V';
                    folderStyle = 'close-me';
                } else {
                    folderControl = '>';
                    folderStyle = 'open-me';
                }
            }
            return {
                model: this.model.toJSON(),
                folder_style: folderStyle,
                folder_control: folderControl,
                indent: 10 + this.model.level * 24
            };
        },

        onRender: function () {
            var parent = this.model.parent;
            while (parent) {
                if (parent.isOpen === false) {
                    this.$el.hide();
                    return;
                }
                parent = parent.parent;
            }
            this.$el.show();
        }
    });

    return GridRowView;
});
