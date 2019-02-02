import Controller from '@ember/controller';
import config from 'ghost-admin/config/environment';
import {alias} from '@ember/object/computed';
import {computed} from '@ember/object';
import {get} from '@ember/object';
import {inject as service} from '@ember/service';

const TYPES = [{
    name: 'All posts',
    value: null
}, {
    name: 'Draft posts',
    value: 'draft'
}, {
    name: 'Published posts',
    value: 'published'
}, {
    name: 'Scheduled posts',
    value: 'scheduled'
}, {
    name: 'Featured posts',
    value: 'featured'
}, {
    name: 'Pages',
    value: 'page'
}];

const ORDERS = [{
    name: 'Newest',
    value: null
}, {
    name: 'Oldest',
    value: 'published_at asc'
}, {
    name: 'Recently updated',
    value: 'updated_at desc'
}];

export default Controller.extend({

    session: service(),
    store: service(),

    queryParams: ['type', 'author', 'tag', 'order'],

    type: null,
    author: null,
    tag: null,
    order: null,

    _hasLoadedTags: false,
    _hasLoadedAuthors: false,

    availableTypes: null,
    availableOrders: null,

    init() {
        this._super(...arguments);
        this.availableTypes = TYPES;
        this.availableOrders = ORDERS;
    },

    postsInfinityModel: alias('model'),

    showingAll: computed('type', 'author', 'tag', function () {
        let {type, author, tag} = this.getProperties(['type', 'author', 'tag']);

        return !type && !author && !tag;
    }),

    selectedType: computed('type', function () {
        let types = this.get('availableTypes');
        return types.findBy('value', this.get('type'));
    }),

    selectedOrder: computed('order', function () {
        let orders = this.get('availableOrders');
        return orders.findBy('value', this.get('order'));
    }),

    _availableTags: computed(function () {
        return this.get('store').peekAll('tag');
    }),

    availableTags: computed('_availableTags.[]', function () {
        let tags = this.get('_availableTags')
            .filter(tag => tag.get('id') !== null);
        //.sort((tagA, tagB) => tagA.name.localeCompare(tagB.name, undefined, {ignorePunctuation: true}))

        let options = tags.toArray();

        // separate main / secondary category
        let options2 = [];
        for (let opt of options) {
            let opt2 = {
                name: opt.name, slug: opt.slug, parent: null
            };
            for (let k in config.ccbCategories) {
                for (let k2 of config.ccbCategories[k]) {
                    if (k2 === opt.slug) {
                        opt2.name = '-- ' + opt2.name;
                        opt2.parent = k;
                        break;
                    }
                }
            }
            options2.push(opt2);
        }

        // order
        let options3 = [];
        for (let k in config.ccbCategories) {
            let main = options2.filter((v) => {
                return v.slug === k ? v : false;
            });
            options3 = options3.concat(main);
            for (let k2 of config.ccbCategories[k]) {
                let second = options2.filter((v) => {
                    return v.slug === k2 ? v : false;
                });
                options3 = options3.concat(second);
            }
        }

        for (let opt of options2) {
            let include = false;
            for (let opt2 of options3) {
                if (opt.slug === opt2.slug) {
                    include = true;
                    break;
                }
            }
            if (!include) {
                options3.push(opt);
            }
        }

        options3.unshiftObject({name: 'All tags', slug: null});
        return options3;
    }),

    selectedTag: computed('tag', '_availableTags.[]', function () {
        let tag = this.get('tag');
        let tags = this.get('availableTags');

        return tags.findBy('slug', tag);
    }),

    _availableAuthors: computed(function () {
        return this.get('store').peekAll('user');
    }),

    availableAuthors: computed('_availableAuthors.[]', function () {
        let authors = this.get('_availableAuthors');
        let options = authors.toArray();

        options.unshiftObject({name: 'All authors', slug: null});

        return options;
    }),

    selectedAuthor: computed('author', 'availableAuthors.[]', function () {
        let author = this.get('author');
        let authors = this.get('availableAuthors');

        return authors.findBy('slug', author);
    }),

    actions: {
        changeType(type) {
            this.set('type', get(type, 'value'));
        },

        changeAuthor(author) {
            this.set('author', get(author, 'slug'));
        },

        changeTag(tag) {
            this.set('tag', get(tag, 'slug'));
        },

        changeOrder(order) {
            this.set('order', get(order, 'value'));
        },

        openEditor(post) {
            this.transitionToRoute('editor.edit', post.get('id'));
        }
    }
});
