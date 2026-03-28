/** @odoo-module **/

import { Many2One } from "@web/views/fields/many2one/many2one";
import { patch } from "@web/core/utils/patch";

const EXPANDED_LIMIT = 80;

patch(Many2One.prototype, {
    get many2XAutocompleteProps() {
        const props = super.many2XAutocompleteProps;
        props.searchLimit = EXPANDED_LIMIT;
        return props;
    },
});

console.log("[ProductSearchExpanded] Many2One patched — searchLimit:", EXPANDED_LIMIT);