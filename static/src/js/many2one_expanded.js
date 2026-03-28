/** @odoo-module **/

import { Many2OneField } from "@web/views/fields/many2one/many2one_field";
import { patch } from "@web/core/utils/patch";

const EXPANDED_LIMIT = 80;

patch(Many2OneField.prototype, {
    get Many2XAutocompleteProps() {
        const props = super.Many2XAutocompleteProps;
        // Override the searchLimit that gets passed to name_search RPC
        if (props.searchLimit !== undefined) {
            props.searchLimit = EXPANDED_LIMIT;
        }
        return props;
    },
});

console.log("[ProductSearchExpanded] Many2OneField patched — limit:", EXPANDED_LIMIT);