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

require(['marionette', 'gridcontroller'], function (Marionette, GridController) {

    'use strict';

    var GridDemo = new Marionette.Application();

    GridDemo.addRegions({
        mainRegion: '#main-region'
    });

    GridDemo.on("initialize:after", function(){
        var gridController = new GridController();
        GridDemo.mainView = gridController.gridView; 
        GridDemo.mainRegion.show(GridDemo.mainView);
    });

    GridDemo.start();
});
