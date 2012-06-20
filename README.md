Usage:

```javascript
function MyView(el) {
  $.Model.call(this, el);

  this.prop("id", $.Data("id"));
  this.prop("isFavorited", $.ClassName("favorited"));
  this.prop("remainingCharCount", Number, "span.char-count");
}

$.inherit(MyView, $.Model);

var el = document.getElementById("my-view");
var view = new MyView(el);

el.id(); // The data-id attribute of #my-view
el.isFavorited(); // True if #my-view has a "favorited" class name, false otherwise
el.isFavorited(true); // Adds the "favorited" class name to #my-view
el.remainingCharCount(); // The text value of "#my-view span.char-count" as a Number
el.remainingCharCount(50); // Sets the text value of "#my-view span.char-count"
```