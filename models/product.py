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
