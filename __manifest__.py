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
