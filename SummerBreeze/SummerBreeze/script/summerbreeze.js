﻿window.summerBreeze = (function ($, breeze) {

    var
        manager = null,

        store = null, 

        generator = function (obj) {

            var defaults = {
                enableQueing: false,
                autoSave: false
            };

            obj = $.extend(obj, defaults);

            var service = new breeze.DataService({
                serviceName: obj.serviceName,
                hasServerMetadata: false // don't ask the server for metadata
            });

            manager = new breeze.EntityManager({ dataService: service });

            store = manager.metadataStore;

            if (obj.enableQueing) {
                manager.enableSaveQueuing(obj.enableQueing);
            }

            if (obj.autoSave) {
                autoSave();
            }

            this.prototype.generate = function () {
                return run();
            }

        },

        autoSave = function () {
            manager.entityChanged.subscribe(function (args) {
                if (args.entityAction === breeze.EntityAction.EntityStateChange) {
                    var entity = args.entity;
                    if (entity.entityAspect.entityState.isModified()) {
                        return manager.saveChanges();
                       
                    }
                }
            });
        },

        run = function () {

            return $.Deferred(function (def) {

                getMetadata(metadataUri)
                    .then(function (metadata) {
                        addEntitiesToStore(JSON.parse(metadata), store);
                        def.resolve();
                    });
            }).promise();

        },

        getMetadata = function (uri) {
            return $.getJSON(uri);
        },

        createEntityType = function (config) {
            return new breeze.EntityType(config);
        },

        addEntitiesToStore = function (data, store) {

            $(data).each(function (index, elem) {

                var entityType = createEntityType({
                    shortName: elem.shortName,
                    namespace: elem.namespace,
                    autoGeneratedKeyType: eval(elem.autoGeneratedKeyType)
                });


                $(elem.dataProperties).each(function (idx, el) {
                    el.validators = $.map(el.validators, function (e, i) {
                        return eval(e);
                    });

                    el.name = $.checkCamel(el.name);

                    entityType.addProperty(new breeze.DataProperty(el));

                });

                $(elem.navigationProperties).each(function (idx, el) {
                    el.name = $.checkCamel(el.name);

                    el.foreignKeyNames = $.map(el.foreignKeyNames, function (e, i) {
                        return $.checkCamel(e);
                    });

                    entityType.addProperty(new breeze.NavigationProperty(el));
                });


                store.addEntityType(entityType);

            });

        };

    return {
        generator: generator,
        manager: manager,
        store: store
    }

    $.checkCamel = function (text) {
        return breeze.NamingConvention.defaultInstance.name === "camelCase" ? text.replace(text.charAt(0), text.charAt(0).toLowerCase()) : text;
    };


}(jQuery, breeze));

