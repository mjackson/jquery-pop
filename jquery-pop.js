(function ($, undefined) {

  var createObject = Object.create || function (proto) {
    function F() {}
    F.prototype = proto;
    return new F();
  };

  function inherit(child, parent) {
    child.prototype = createObject(parent.prototype);
    child.prototype.constructor = child;
    return child;
  }

  // Property

  function Property(el, name, primitiveType) {
    this.$el = $(el);
    this.name = name;
    this.type = primitiveType || String;
  }

  Property.prototype.coerce = function (value) {
    return this.type(value);
  };

  Property.prototype.get = function () {
    return this.coerce(this._get(this.$el));
  };

  Property.prototype.set = function (value) {
    this._set(this.$el, this.coerce(value));
    return this;
  };

  function ValueProperty(el, name, primitiveType) {
    Property.call(this, el, name, primitiveType);
  }

  inherit(ValueProperty, Property);

  ValueProperty.prototype._get = function ($el) {
    return $el.is(":input") ? $el.val() : $el.text();
  };

  ValueProperty.prototype._set = function ($el, value) {
    if ($el.is(":input")) {
      $el.val(value);
    } else {
      $el.text(value);
    }
  };

  function DataProperty(el, name, attributeName, primitiveType) {
    Property.call(this, el, name, primitiveType);
    this.attributeName = attributeName;
  }

  inherit(DataProperty, Property);

  DataProperty.prototype._get = function ($el) {
    return $el.data(this.attributeName);
  };

  DataProperty.prototype._set = function ($el, value) {
    $el.data(this.attributeName, value);
  };

  function AttrProperty(el, name, attributeName, primitiveType) {
    Property.call(this, el, name, primitiveType);
    this.attributeName = attributeName;
  }

  inherit(AttrProperty, Property);

  AttrProperty.prototype._get = function ($el) {
    return $el.attr(this.attributeName);
  };

  AttrProperty.prototype._set = function ($el, value) {
    $el.attr(this.attributeName, value);
  };

  function PropProperty(el, name, propertyName, primitiveType) {
    Property.call(this, el, name, primitiveType);
    this.propertyName = propertyName;
  }

  inherit(PropProperty, Property);

  PropProperty.prototype._get = function ($el) {
    return $el.prop(this.propertyName);
  };

  PropProperty.prototype._set = function ($el, value) {
    $el.prop(this.propertyName, value);
  };

  function ClassNameProperty(el, name, className) {
    Property.call(this, el, name, Boolean);
    this.className = className;
  }

  inherit(ClassNameProperty, Property);

  ClassNameProperty.prototype._get = function ($el) {
    return $el.hasClass(this.className);
  };

  ClassNameProperty.prototype._set = function ($el, value) {
    var hasClass = $el.hasClass(this.className);

    if (value) {
      if (!hasClass) {
        $el.addClass(this.className);
      }
    } else {
      if (hasClass) {
        $el.removeClass(this.className);
      }
    }
  };

  // Data type helpers

  function Value(primitiveType) {
    return function (el, name) {
      return new ValueProperty(el, name, primitiveType);
    };
  }

  function Data(attributeName, primitiveType) {
    return function (el, name) {
      return new DataProperty(el, name, attributeName, primitiveType);
    };
  }

  function Attr(attributeName, primitiveType) {
    return function (el, name) {
      return new AttrProperty(el, name, attributeName, primitiveType);
    };
  }

  function Prop(propertyName, primitiveType) {
    return function (el, name) {
      return new PropProperty(el, name, propertyName, primitiveType);
    };
  }

  function ClassName(className) {
    return function (el, name) {
      return new ClassNameProperty(el, name, className);
    };
  }

  // Model

  var NATIVE_TYPES = [String, Number, Boolean];

  function Model(el) {
    this.$el = $(el);
  }

  Model.prototype.prop = function (name, property, selector) {
    if (typeof property === "string") {
      selector = property;
      property = null;
    }

    var $el = this.$el;

    if (typeof selector === "string") {
      $el = $el.find(selector);
    } else if (selector) {
      $el = $(selector);
    }

    if (!property) {
      property = String;
    }

    if (NATIVE_TYPES.indexOf(property) !== -1) {
      property = Value(property);
    }

    if (typeof property === "function") {
      property = property($el, name);
    } else {
      throw "Invalid property definition: " + property.toString();
    }

    this["$" + property.name] = property.$el;

    this[property.name] = function (value) {
      if (arguments.length > 0) {
        property.set(value);
        return this;
      }

      return property.get();
    };

    return property;
  };

  Model.prototype.bind = function (type, selector, callback) {
    if (typeof selector === "function") {
      callback = selector;
      selector = null;
    }

    var $el = this.$el;

    if (typeof selector === "string") {
      $el = $el.find(selector);
    } else if (selector) {
      $el = $(selector);
    }

    $el.bind(type, $.proxy(callback, this));
  };

  // Expose.
  $.inherit = inherit;
  $.Value = Value;
  $.Data = Data;
  $.Attr = Attr;
  $.Prop = Prop;
  $.ClassName = ClassName;
  $.Model = Model;

}(jQuery));
