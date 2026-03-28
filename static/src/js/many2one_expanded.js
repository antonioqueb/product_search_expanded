/** @odoo-module **/

import { Many2XAutocomplete } from "@web/views/fields/many2x_autocomplete";
import { patch } from "@web/core/utils/patch";

/**
 * Increase the number of results shown in the Many2One/Many2Many dropdown.
 *
 * In Odoo 19, Many2XAutocomplete.loadOptionsSource calls
 * orm.call(resModel, "name_search", ...) with a limit parameter.
 * We patch the sources getter and loadOptionsSource to increase that limit.
 *
 * The backend _name_search override in product.py handles the server-side,
 * this ensures the frontend also requests/displays more results.
 */

const EXPANDED_LIMIT = 80;

patch(Many2XAutocomplete.prototype, {
    /**
     * Patch sources to increase optionLimit so the autocomplete dropdown
     * shows more items before truncating.
     */
    get sources() {
        const parentSources = super.sources;
        return parentSources.map((source) => {
            const patched = Object.assign({}, source);
            if (patched.optionLimit !== undefined) {
                patched.optionLimit = EXPANDED_LIMIT;
            }
            return patched;
        });
    },

    /**
     * Patch loadOptionsSource to request more results from the server.
     */
    async loadOptionsSource(request) {
        // Temporarily override searchLimit prop if it exists
        if (this.props && typeof this.props.searchLimit === "number") {
            const orig = this.props.searchLimit;
            this.props.searchLimit = EXPANDED_LIMIT;
            const result = await super.loadOptionsSource(request);
            this.props.searchLimit = orig;
            return result;
        }
        return super.loadOptionsSource(request);
    },
});
