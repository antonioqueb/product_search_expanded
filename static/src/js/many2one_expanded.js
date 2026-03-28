/** @odoo-module **/

import { RecordAutocomplete } from "@web/core/record_selectors/record_autocomplete";
import { patch } from "@web/core/utils/patch";

const EXPANDED_LIMIT = 80;

patch(RecordAutocomplete.prototype, {
    /**
     * Override search to use expanded limit instead of the module's SEARCH_LIMIT.
     */
    search(name, limit) {
        // Force our expanded limit regardless of what was passed
        return super.search(name, EXPANDED_LIMIT + 1);
    },

    /**
     * Override loadOptionsSource to show all results instead of truncating
     * at the original SEARCH_LIMIT.
     */
    async loadOptionsSource(name) {
        if (this.lastProm) {
            this.lastProm.abort(false);
        }
        this.lastProm = this.search(name, EXPANDED_LIMIT + 1);
        const nameGets = (await this.lastProm).map(([id, label]) => [
            id,
            label ? label.split("\n")[0] : "Unnamed",
        ]);
        this.addNames(nameGets);
        const options = nameGets.map(([id, label]) => ({
            data: { record: { id, display_name: label } },
            label,
            onSelect: () => this.props.update([id]),
        }));
        if (EXPANDED_LIMIT < nameGets.length) {
            options.push({
                cssClass: "o_m2o_dropdown_option",
                label: "Buscar más...",
                onSelect: this.onSearchMore.bind(this, name),
            });
        }
        if (options.length === 0) {
            options.push({ label: "(sin resultados)" });
        }
        return options;
    },
});

console.log("[ProductSearchExpanded] RecordAutocomplete patched — limit:", EXPANDED_LIMIT);