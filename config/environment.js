/* eslint-env node */
'use strict';

module.exports = function (environment) {
    let ENV = {
        modulePrefix: 'ghost-admin',
        environment,
        rootURL: '/',
        locationType: 'trailing-hash',
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            },
            // @TODO verify that String/Function need to be enabled
            EXTEND_PROTOTYPES: {
                Date: false,
                Array: true,
                String: true,
                Function: true
            }
        },

        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created

            // override the default version string which contains git info from
            // https://github.com/cibernox/git-repo-version. Only include the
            // `major.minor` version numbers
            version: require('../package.json').version.match(/^(\d+\.)?(\d+)/)[0]
        },

        'ember-simple-auth': { },

        moment: {
            includeTimezone: 'all',
            includeLocales: true
        },

        ccbCategories: {
            "thoi-su": [
            ],
            "chinh-tri": [
            ],
            "cuu-chien-binh": [
                "cuu-chien-binh-tren-tran-tuyen-moi",
                "cuu-chien-binh-vac-tu-va",
                "cuu-chien-binh-cong-tac-hoi"
            ],
            "doanh-nhan-ccb": [
                "doanh-nhan-ccb-khoi-nghiep",
                "doanh-nhan-ccb-la-lanh-dum-la-rach",
                "doanh-nhan-ccb-chinh-sach-moi"
            ],
            "chinh-sach": [
            ],
            "quoc-phong-an-ninh": [
                "quoc-phong-an-ninh-quoc-phong",
                "quoc-phong-an-ninh-an-ninh"
            ],
            "kinh-te-xa-hoi": [
                "kinh-te-xa-hoi-kinh-te",
                "kinh-te-xa-hoi-xa-hoi",
                "kinh-te-xa-hoi-nguoi-tot-viec-tot"
            ],
            "suc-khoe": [
            ],
            "van-hoa-the-thao": [
                "van-hoa-the-thao-van-hoa",
                "van-hoa-the-thao-the-thao"
            ],
            "phap-luat": [
            ],
            "quoc-te": [
            ]
        }
    };

    if (environment === 'development') {
        // ENV.APP.LOG_RESOLVER = true;
        ENV.APP.LOG_ACTIVE_GENERATION = true;
        ENV.APP.LOG_TRANSITIONS = true;
        ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        ENV.APP.LOG_VIEW_LOOKUPS = true;

        // This is needed so that browserify dependencies in tests work correctly
        // See https://github.com/ef4/ember-browserify/issues/14
        ENV.browserify = {
            tests: true
        };

        // Enable mirage here in order to mock API endpoints during development
        ENV['ember-cli-mirage'] = {
            enabled: false
        };
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
        ENV.APP.autoboot = false;

        // This is needed so that browserify dependencies in tests work correctly
        // See https://github.com/ef4/ember-browserify/issues/14
        ENV.browserify = {
            tests: true
        };

        // Withuot manually setting this, pretender won't track requests
        ENV['ember-cli-mirage'] = {
            trackRequests: true
        };
    }

    return ENV;
};
