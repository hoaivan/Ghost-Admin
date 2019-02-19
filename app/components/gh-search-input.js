/* global key */
/* eslint-disable camelcase */
import Component from '@ember/component';
import RSVP from 'rsvp';
import {computed} from '@ember/object';
import {isBlank, isEmpty} from '@ember/utils';
import {run} from '@ember/runloop';
import {inject as service} from '@ember/service';

export function computedGroup(category) {
    return computed('content', 'currentSearch', function () {
        if (!this.get('currentSearch') || !this.get('content')) {
            return [];
        }

        return this.get('content').filter((item) => {
            let search = this.get('currentSearch').toString().toLowerCase();
            if (category === 'Stories' || category === 'Pages') {
                return (item.category === category);
            }
            return (item.category === category) && (item.title.toString().toLowerCase().indexOf(search) >= 0);
        });
    });
}

export default Component.extend({
    store: service('store'),
    router: service('router'),
    ajax: service(),
    notifications: service(),

    content: null,
    contentExpiresAt: false,
    contentExpiry: 10000,
    currentSearch: '',
    term: '',
    isLoadingPost: false,
    isLoading: false,
    selection: null,

    posts: computedGroup('Stories'),
    pages: computedGroup('Pages'),
    users: computedGroup('Users'),
    tags: computedGroup('Tags'),

    groupedContent: computed('posts', 'pages', 'users', 'tags', function () {
        let groups = [];

        if (!isEmpty(this.get('posts'))) {
            groups.pushObject({groupName: 'Stories', options: this.get('posts')});
        }

        if (!isEmpty(this.get('pages'))) {
            groups.pushObject({groupName: 'Pages', options: this.get('pages')});
        }

        if (!isEmpty(this.get('users'))) {
            groups.pushObject({groupName: 'Users', options: this.get('users')});
        }

        if (!isEmpty(this.get('tags'))) {
            groups.pushObject({groupName: 'Tags', options: this.get('tags')});
        }

        return groups;
    }),

    init() {
        this._super(...arguments);
        this.content = [];
    },

    actions: {
        openSelected(selected) {
            if (!selected) {
                return;
            }

            if (selected.category === 'Stories' || selected.category === 'Pages') {
                let id = selected.id.replace('post.', '');
                this.get('router').transitionTo('editor.edit', id);
            }

            if (selected.category === 'Users') {
                let id = selected.id.replace('user.', '');
                this.get('router').transitionTo('team.user', id);
            }

            if (selected.category === 'Tags') {
                let id = selected.id.replace('tag.', '');
                this.get('router').transitionTo('settings.tags.tag', id);
            }
        },

        onFocus() {
            this._setKeymasterScope();
        },

        onBlur() {
            this._resetKeymasterScope();
        },

        search(term) {
            return new RSVP.Promise((resolve, reject) => {
                run.debounce(this, this._performSearch, term, resolve, reject, 1000);
            });
        }
    },

    _markLoading(status) {
        this.set('isLoading', status);
        this.set('isLoadingPost', status);
    },

    _clear_posts() {
        if (this.get('content')) {
            let ct = this.get('content').filter((item) => item.category !== 'Pages' && item.category !== 'Stories');
            this.set('content', ct);
        }
    },

    refreshContent() {
        let promises = [];
        let now = new Date();
        let contentExpiry = this.get('contentExpiry');
        let contentExpiresAt = this.get('contentExpiresAt');

        if (this.get('isLoading') || contentExpiresAt > now) {
            if (this.get('isLoadingPost')) {
                return RSVP.resolve();
            }
            this._clear_posts();
            let promises = [];
            this.set('isLoadingPost', true);
            promises.pushObject(this._loadPosts());
            return RSVP.all(promises).then(() => { }).finally(() => {
                this.set('isLoadingPost', false);
            });
        }

        this._markLoading(true);
        this.set('content', []);
        promises.pushObject(this._loadPosts());
        promises.pushObject(this._loadUsers());
        promises.pushObject(this._loadTags());

        return RSVP.all(promises).then(() => { }).finally(() => {
            this._markLoading(false);
            this.set('contentExpiresAt', new Date(now.getTime() + contentExpiry));
        });
    },

    _loadPosts() {
        // let store = this.get('store');
        // let postsUrl = `${store.adapterFor('post').urlForQuery({}, 'post')}/`;
        // let postsQuery = {fields: 'id,title,page', limit: 'all', status: 'all', filter: 'page:[true,false]'};
        // let content = this.get('content');
        //
        // return this.get('ajax').request(postsUrl, {data: postsQuery}).then((posts) => {
        //     content.pushObjects(posts.posts.map(post => ({
        //         id: `post.${post.id}`,
        //         title: post.title,
        //         category: post.page ? 'Pages' : 'Stories'
        //     })));
        let postsUrl = `${window.location.origin}/api/ext/search/${encodeURIComponent(this.get('term'))}`;
        let postsQuery = {_all: true};
        let content = this.get('content');

        return this.get('ajax').request(postsUrl, {data: postsQuery}).then((resp) => {
            if (resp.status) {
                content.pushObjects(resp.data.map(post => ({
                    id: `post.${post.id}`,
                    title: post.content,
                    slug: post.slug,
                    category: Number(post.page) ? 'Pages' : 'Stories'
                })));
            } else {
                this.get('notifications').showAPIError(resp);
            }
        }).catch((error) => {
            this.get('notifications').showAPIError(error, {key: 'search.loadPosts.error'});
        });
    },

    _loadUsers() {
        let store = this.get('store');
        let usersUrl = `${store.adapterFor('user').urlForQuery({}, 'user')}/`;
        let usersQuery = {fields: 'name,slug', limit: 'all'};
        let content = this.get('content');

        return this.get('ajax').request(usersUrl, {data: usersQuery}).then((users) => {
            content.pushObjects(users.users.map(user => ({
                id: `user.${user.slug}`,
                title: user.name,
                category: 'Users'
            })));
        }).catch((error) => {
            this.get('notifications').showAPIError(error, {key: 'search.loadUsers.error'});
        });
    },

    _loadTags() {
        let store = this.get('store');
        let tagsUrl = `${store.adapterFor('tag').urlForQuery({}, 'tag')}/`;
        let tagsQuery = {fields: 'name,slug', limit: 'all'};
        let content = this.get('content');

        return this.get('ajax').request(tagsUrl, {data: tagsQuery}).then((tags) => {
            content.pushObjects(tags.tags.map(tag => ({
                id: `tag.${tag.slug}`,
                title: tag.name,
                category: 'Tags'
            })));
        }).catch((error) => {
            this.get('notifications').showAPIError(error, {key: 'search.loadTags.error'});
        });
    },

    _performSearch(term, resolve, reject) {
        if (isBlank(term)) {
            return resolve([]);
        }
        this.set('term', term);
        this.refreshContent().then(() => {
            this.set('currentSearch', term);

            return resolve(this.get('groupedContent'));
        }).catch(reject);
    },

    _setKeymasterScope() {
        key.setScope('search-input');
    },

    _resetKeymasterScope() {
        key.setScope('default');
    },

    willDestroy() {
        this._super(...arguments);
        this._resetKeymasterScope();
    }
});
