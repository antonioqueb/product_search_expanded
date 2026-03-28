## ./__init__.py
```py
# -*- coding: utf-8 -*-
from . import models
```

## ./__manifest__.py
```py
{
    "name": "Product Search Expanded",
    "version": "19.0.1.0.0",
    "category": "Inventory",
    "summary": "Expands the product search dropdown to show more results with scrollable list",
    "description": """
        Extends the Many2One search dropdown for product fields to display
        more results in a scrollable container instead of the default ~8 items.
        The 'Search More...' option is preserved at the bottom.
    """,
    "author": "Alphaqueb Consulting",
    "website": "https://www.alphaqueb.com",
    "depends": ["product"],
    "assets": {
        "web.assets_backend": [
            "product_search_expanded/static/src/js/many2one_expanded.js",
            "product_search_expanded/static/src/css/many2one_expanded.css",
        ],
    },
    "installable": True,
    "application": False,
    "license": "LGPL-3",
}
```

## ./models/__init__.py
```py
# -*- coding: utf-8 -*-
from . import product
```

## ./models/product.py
```py
# -*- coding: utf-8 -*-
from odoo import models, api

EXPANDED_SEARCH_LIMIT = 80


class ProductTemplate(models.Model):
    _inherit = 'product.template'

    @api.model
    def _name_search(self, name='', domain=None, operator='ilike', limit=None, order=None):
        if limit is None or limit == 8:
            limit = EXPANDED_SEARCH_LIMIT
        return super()._name_search(
            name=name, domain=domain, operator=operator,
            limit=limit, order=order,
        )


class ProductProduct(models.Model):
    _inherit = 'product.product'

    @api.model
    def _name_search(self, name='', domain=None, operator='ilike', limit=None, order=None):
        if limit is None or limit == 8:
            limit = EXPANDED_SEARCH_LIMIT
        return super()._name_search(
            name=name, domain=domain, operator=operator,
            limit=limit, order=order,
        )
```

## ./static/src/js/many2one_expanded.js
```js
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
```

