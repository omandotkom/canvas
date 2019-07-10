import axios from 'axios';

export default {

    computed: {
        Canvas() {
            return Canvas;
        },
    },

    methods: {
        /**
         * Trim an alphanumeric string and convert to a slug.
         *
         * @param text
         * @return string
         * @source https://gist.github.com/mathewbyrne/1280286
         */
        slugify(text) {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/--+/g, '-');
        },

        /**
         * Return a number formatted with a suffix.
         *
         * @param number
         * @returns {string}
         */
        suffixedNumber(number) {
            let formatted = '';
            let suffix = '';

            if (number < 900) {
                formatted = number;
                suffix = '';
            } else if (number < 900000) {
                let n_total = number / 1000;
                formatted = parseFloat(n_total.toFixed(1));
                suffix = 'K';
            } else if (number < 900000000) {
                let n_total = number / 1000000;
                formatted = parseFloat(n_total.toFixed(1));
                suffix = 'M';
            } else if (number < 900000000000) {
                let n_total = number / 1000000000;
                formatted = parseFloat(n_total.toFixed(1));
                suffix = 'B';
            } else {
                let n_total = number / 1000000000000;
                formatted = parseFloat(n_total.toFixed(1));
                suffix = 'T';
            }

            return formatted + suffix;
        },

        /**
         * Get the plural form of a word.
         *
         * @param string
         * @param count
         * @returns {string}
         */
        pluralize(string, count) {
            if (count > 1 || count === 0) {
                return ' ' + string + 's';
            } else {
                return ' ' + string;
            }
        },

        request() {
            let instance = axios.create();
            let token = document.head.querySelector('meta[name="csrf-token"]');

            if (token) {
                axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
            }

            instance.defaults.baseURL = '/' + Canvas.path;

            instance.interceptors.response.use(
                response => response,
                error => {
                    switch (error.response.status) {
                        case 500:
                            console.error(error.response.data.message);
                            break;

                        case 401:
                            window.location.href = '/logout';
                            break;
                    }

                    return Promise.reject(error);
                }
            );

            return instance;
        },
    }
};