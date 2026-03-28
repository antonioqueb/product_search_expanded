/** @odoo-module **/

import { Many2XAutocomplete } from "@web/views/fields/many2x_autocomplete";
import { patch } from "@web/core/utils/patch";

const EXPANDED_LIMIT = 80;

patch(Many2XAutocomplete.prototype, {
    /**
     * Override sources to increase the optionLimit so more items are displayed
     * in the dropdown instead of being truncated.
     */
    get sources() {
        const sources = super.sources;
        return sources.map((s) => ({
            ...s,
            optionLimit: EXPANDED_LIMIT,
        }));
    },

    /**
     * Override to ensure the RPC call to name_search uses a higher limit.
     * In Odoo 19, loadOptionsSource builds the name_search call using
     * this.props.searchLimit or a default of 8.
     */
    async loadOptionsSource(request) {
        // Save and override searchLimit
        const origLimit = this.props.searchLimit;
        this.props.searchLimit = EXPANDED_LIMIT;
        try {
            return await super.loadOptionsSource(request);
        } finally {
            this.props.searchLimit = origLimit;
        }
    },
});

console.log("[ProductSearchExpanded] Many2XAutocomplete patched — limit:", EXPANDED_LIMIT);