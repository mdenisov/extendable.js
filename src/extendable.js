
(function() {
    var util = {
        copyProperties: function(p_src, p_dest) {
            if (!p_dest) throw new Error('p_dest must be defined');
            p_src = p_src || {};

            for (var prop in p_src) {
                if (p_src.hasOwnProperty(prop)) {
                    p_dest[prop] = p_src[prop];
                }
            }
        }
    };

    /**
     * Main Extendable module
     * @exports Extendable
     */
    var Extendable = {
        /**
         * Extend the object which holds this function and set the current
         * object as it's prototype. The newly created object will contain
         * the properties defined by p_props
         *
         * @param  {Object} p_props properties the new object will have
         * @return {Object}         The newly created object
         */
        extend: function(p_props) {
            p_props = p_props || {};
            var extendedObject = this;
            // set the extended object as new object's prototype
            var newObject = Object.create(extendedObject);
            util.copyProperties(p_props, newObject);
            return newObject;
        },
        /**
         * Overrides a method on an existing object with the ability to call
         * the super method. The super parameter (overridden method) will then
         * be added as the first argument to the list.
         *
         * Remember to always add the p_super argument as the first argument
         * when defining a new method and after extending just call the method
         * as you usually would (without the super argument). Also, you can't
         * name the parameteras 'super' because it's a reserved keyword in
         * JavaScript, use 'p_super' or something like that.
         *
         * @param  {String} p_methodName   The name of the method to override
         * @param  {Function} p_newMethod  A new method which overrides
         * @return {Object}                The same object instance (this)
         */
        override: function(p_methodName, p_newMethod) {
            var object = this;
            // the old function
            var overriddenFunction = object[p_methodName];
            if (typeof p_methodName !== 'string') {
                throw new TypeError('p_methodName should be a string');
            }
            if (typeof overriddenFunction !== 'function') {
                throw new Error('Method "' +
                    p_methodName + '" should be a function, but is ' +
                    typeof overriddenFunction);
            }

            // wrap the new method in a separate function so the overridden
            // function can be mapped as the first function parameter
            object[p_methodName] = function() {
                // there is a risk that somebody might have extended the object
                // and we do not want to pass the old `object` reference when
                // somebody calls the function.
                var obj = this;

                // wrap the overridden function so that the `this` reference can
                // be set to the "real" this (`obj`) variable
                function overridenWrapper() {
                    return overriddenFunction.apply(obj, arguments);
                }

                var args = Array.prototype.slice.call(arguments);
                // add the wrapped super function as the first argument
                args.splice(0, 0, overridenWrapper);

                // call the new method and return the result
                return p_newMethod.apply(obj, args);
            };

            return object;
        },
        /**
         * Create a new object from the current object (this). Calling this
         * method is effectively the same as calling `extend()` with
         * no arguments or calling Object.create(arg1) where `arg1` is the
         * current object.
         *
         * @return {Object} A new object with the current object as the
         * prototype
         */
        create: function() {
            return Object.create(this);
        }
    };

    // export the module
    if (typeof module !== 'undefined' && module.exports) {
        // node.js
        module.exports = Extendable;
    }
    else if (typeof define === 'function' && define.amd) {
        // amd module
        define([], function() {
            return Extendable;
        });
    }
    else {
        // global variable
        window.Extendable = Extendable;
    }
}());