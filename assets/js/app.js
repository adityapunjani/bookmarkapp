(function ($) {


    // Model
    window.Bookmark = Backbone.Model.extend({

        // Default attributes for the bookmark.
        defaults: {
            link: '',
            tag: ''
        },
        // Ensure that each todo created has `title`.
        initialize: function () {
            //set default 
        }


    });

    //Collections
    var BookmarkList = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: window.Bookmark,

        // Save all of the todo items under the `"todos"` namespace.
        localStorage: new Store('bookmarks-backbone'),
    });
    window.Bookmarks = new BookmarkList;

    //Views
    window.BookmarkView = Backbone.View.extend({

        events: {
            'click span.delete': 'remove'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'unrender', 'remove'); // every function that uses 'this' as the current object should be in here
            this.model.bind('change', this.render);
            this.model.bind('remove', this.unrender);
        },

        render: function () {


            $(this.el).html('<tr><th width="60%"> <a href="http://' + this.model.get('link') + '" target="_blank">' + this.model.get('link') + '</a></th>' + '<th width="40%"">' + this.model.get('tag') + '</th> <th><span class="delete btn btn-danger" style="cursor:pointer; color:white; font-family:sans-serif;">Delete</span></th></tr>');
            return this;

        },
        unrender: function () {
            $(this.el).remove();
        },
        remove: function () {
            this.model.destroy();
            window.Bookmarks.invoke('save');
        }
    });

    //Application View
    window.AppView = Backbone.View.extend({
        el: $('body'),

        events: {
            'submit #new_bookmark': 'createBookmark',
            'keypress #tagkey': 'callSearch',
            'submit #showall': 'showAll'
        },

        initialize: function () {

            _.bindAll(this, 'render', 'createBookmark', 'appendBookmark', 'removeView', 'callSearch', 'showAll', 'theFetch');


            window.Bookmarks.bind('add', this.appendBookmark);
            window.Bookmarks.bind('reset', this.theFetch);
            $(this.el).append("<table></table>");
            window.Bookmarks.fetch();



        },
        render: function () {

        },

        createBookmark: function () {

            var bookmark = new Bookmark();
            bookmark.set({
                link: $('#bk_link', this.el).val().trim(),
                tag: $('#bk_tag', this.el).val().trim()
            });

            window.Bookmarks.add(bookmark);
            window.Bookmarks.invoke('save');
            $('#bk_link', this.el).val('');
            $('#bk_tag', this.el).val('');


        },


        appendBookmark: function (bookmark) {
            var view = new window.BookmarkView({
                model: bookmark
            });
            $('table', this.el).append(view.render().el);
        },

        removeView: function () {

            $('table', this.el).remove();
            $(this.el).append("<table></table>");


        },
        callSearch: function (e) {

            if (e.which === 13) {

                var key = $('#tagkey', this.el).val().trim();
                var resultBookmarks = window.Bookmarks.where({
                    tag: key
                });

                window.Results = new BookmarkList(resultBookmarks);

                this.removeView();
                window.Results.each(this.appendBookmark);
            }

        },
        showAll: function () {
            this.removeView();

            window.Bookmarks.each(this.appendBookmark);
        },
        theFetch: function () {

            window.Bookmarks.each(this.appendBookmark);
        }
    });


    window.App = new AppView;
})(jQuery);