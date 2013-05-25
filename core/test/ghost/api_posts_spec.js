/*globals describe, beforeEach, it*/

(function () {
    "use strict";

    var _ = require("underscore"),
        should = require('should'),
        helpers = require('./helpers'),
        PostProvider = require('../../shared/models/dataProvider.bookshelf.posts');

    describe('Bookshelf PostsProvider', function () {

        var posts;

        beforeEach(function (done) {
            helpers.resetData().then(function () {
                posts = new PostProvider();
                done();
            });
        });

        it('can browse', function (done) {
            posts.browse(function (err, results) {
                if (err) { throw err; }

                should.exist(results);

                results.length.should.equal(2);

                done();
            });
        });

        it('can read', function (done) {
            var firstPost;

            posts.browse(function (err, results) {
                if (err) { throw err; }

                should.exist(results);

                results.length.should.be.above(0);

                firstPost = results.models[0];

                posts.read({slug: firstPost.attributes.slug}, function (err, found) {
                    if (err) { throw err; }

                    should.exist(found);

                    found.attributes.title.should.equal(firstPost.attributes.title);

                    done();
                });

            });
        });

        it('can edit', function (done) {
            var firstPost;

            posts.browse(function (err, results) {
                if (err) { throw err; }

                should.exist(results);

                results.length.should.be.above(0);

                firstPost = results.models[0];

                posts.edit({id: firstPost.id, title: "new title"}, function (err, edited) {
                    if (err) { throw err; }

                    should.exist(edited);

                    edited.attributes.title.should.equal('new title');

                    done();
                });

            });
        });

        it('can add', function (done) {
            var newPost = {
                title: 'Test Title 1',
                content: 'Test Content 1'
            };

            posts.add(newPost, function (err, createdPost) {
                if (err) { throw err; }

                should.exist(createdPost);

                createdPost.attributes.title.should.equal(newPost.title, "title is correct");
                createdPost.attributes.content.should.equal(newPost.content, "content is correct");
                createdPost.attributes.slug.should.equal(newPost.title.toLowerCase().replace(/ /g, '-'), 'slug is correct');

                done();
            });
        });

        it('can delete', function (done) {
            var firstPostId,
                ids,
                hasDeletedId;

            posts.browse(function (err, results) {
                if (err) { throw err; }

                should.exist(results);

                results.length.should.be.above(0);

                firstPostId = results.models[0].id;

                posts.destroy(firstPostId, function (err) {
                    if (err) { throw err; }

                    posts.browse(function (err, newResults) {
                        if (err) { throw err; }

                        ids = _.pluck(newResults.models, "id");

                        hasDeletedId = _.any(ids, function (id) {
                            return id === firstPostId;
                        });

                        hasDeletedId.should.equal(false);

                        done();
                    });
                });
            });
        });
    });
}());