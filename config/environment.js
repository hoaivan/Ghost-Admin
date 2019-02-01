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
            "quoc-phong-an-ninh": [
                "quoc-phong-an-ninh-truyen-thong",
                "quoc-phong-an-ninh-quoc-phong",
                "quoc-phong-an-ninh-tim-dong-doi"
            ],
            "kinh-te-xa-hoi": [
                "kinh-te-xa-hoi-kinh-te",
                "kinh-te-xa-hoi-xa-hoi",
                "kinh-te-xa-hoi-chong-tieu-cuc",
                "kinh-te-xa-hoi-thuoc-va-suc-khoe"
            ],
            "van-hoa-the-thao": [
                "van-hoa-the-thao-the-thao",
                "van-hoa-the-thao-thu-gian-giai-tri",
                "van-hoa-the-thao-khoa-hoc-doi-song",
                "van-hoa-the-thao-van-hoa",
                "van-hoa-the-thao-goc-nhin"
            ],
            "quoc-te": [
                "quoc-te-binh-luan",
                "quoc-te-su-kien",
                "quoc-te-chuyen-thoi-su"
            ],
            "thoi-su": [
                "thoi-su-trong-nuoc",
                "thoi-su-doi-ngoai",
                "thoi-su-tin-ccb"
            ],
            "ban-doc": [
                "ban-doc-qua-don-thu-ban-doc",
                "ban-doc-y-kien-ban-doc",
                "ban-doc-tra-loi-ban-doc"
            ],
            "hoi-ccbvn": [
                "hoi-ccbvn-to-chuc-hoi",
                "hoi-ccbvn-van-ban-van-kien",
                "hoi-ccbvn-huong-dan-cong-tac-hoi",
                "hoi-ccbvn-lanh-dao-hoi"
            ],
            "bao-thang": [
                "bao-thang-luan-ban",
                "bao-thang-su-kien-chinh-tri",
                "bao-thang-kinh-te-xa-hoi",
                "bao-thang-van-hoa-the-thao",
                "bao-thang-nam-thang-khong-quen",
                "bao-thang-hoa-ngay-thuong",
                "bao-thang-nhiem-vu-dac-biet",
                "bao-thang-bao-ve-phap-luat",
                "bao-thang-suc-khoe-doi-song",
                "bao-thang-quoc-te"
            ],
            "ky-niem-hoi": [],
            "cong-tac-hoi": [
                "cong-tac-hoi-hoat-dong-hoi",
                "cong-tac-hoi-ccb-tieu-bieu",
                "cong-tac-hoi-y-kien-hoi-vien",
                "cong-tac-hoi-hoi-cac-cap"
            ],
            "chinh-sach": [
                "chinh-sach-van-ban-moi",
                "chinh-sach-giai-dap-chinh-sach",
                "chinh-sach-thuc-hien-chinh-sach"
            ],
            "bien-dao": [],
            "dtts-va-mien-nui": [
                "dtts-va-mien-nui-chinh-tri-xa-hoi",
                "dtts-va-mien-nui-cho-ban-lang-giau-dep",
                "dtts-va-mien-nui-cong-tac-hoi",
                "dtts-va-mien-nui-chinh-sach",
                "dtts-va-mien-nui-truyen-thong-van-hoa",
                "dtts-va-mien-nui-quoc-te",
                "dtts-va-mien-nui-luan-ban",
                "dtts-va-mien-nui-bao-ve-phap-luat"
            ],
            "su-kien": [
                "su-kien-van-de-hom-nay",
                "su-kien-tieng-noi-ccb"
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
