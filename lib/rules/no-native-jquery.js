/**
 * @fileoverview Prevent usage of $ in the views
 * @author Ilya Volodin
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var helper = require("../backbone-helper.js");

module.exports = function(context) {

    var backboneView = [];
    var settings = context.settings || /* istanbul ignore next */ {};

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        "CallExpression": function(node) {
            backboneView.push(backboneView[backboneView.length - 1] || helper.isBackboneView(node, settings.backbone));
        },
        "CallExpression:exit": function(node) {
            if (helper.isBackboneView(node, settings.backbone)) {
                backboneView.pop();
            }
        },
        "Identifier": function(node) {
            if (backboneView[backboneView.length - 1] && node.name === "$") {
                var ancestors = context.getAncestors(node), parent = ancestors.pop();

                if (parent.type === "CallExpression") {
                    if (context.options && context.options.length > 0) {
                        if (context.options[0] === "selector" && parent.arguments && parent.arguments.length > 0) {
                            if (parent.arguments[0].type === "Literal") {
                                context.report(node, "Use this.$ instead of $ in views");
                                return;
                            } else {
                                return;
                            }
                        }
                    }
                    context.report(node, "Use this.$ instead of $ in views");
                }
            }
        }
    };
};

module.exports.schema = [
    {
        "enum": ["all", "selector"]
    }
];
