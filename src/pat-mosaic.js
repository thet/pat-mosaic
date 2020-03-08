define(['pat-base'], function(Base) {

  return Base.extend({
    name: 'mosaic',
    trigger: '.pat-mosaic',
    current_resize: null,
    max_cols: 4,

    init: function() {

      // Insert column break elements.
      var el = this.$el[0];
      var el_break = null;
      for (var i = 0; i < this.max_cols - 1; i++) {
        el_break = document.createElement('span');
        el_break.setAttribute('class', 'pat-mosaic__break');
        el_break.setAttribute('style', 'order: ' + (i+1));
        el.appendChild(el_break);
      }

      this.calculate_heights();

      // calculate heights after window resize
      window.addEventListener('resize', function (e) {
        this.$el[0].classList.remove('pat-mosaic--layout-done');
        if (this.current_resize !== null) {
          window.clearTimeout(this.current_resize);
        }
        window.setTimeout(this.calculate_heights.bind(this), 200);
      }.bind(this));
    },

    calculate_heights: function () {

      // Get all items in a object with column number as key
      var order_items = {};
      this.$el[0].querySelectorAll('.pat-mosaic__item').forEach(function (it) {
        var style = getComputedStyle(it);
        if (! order_items[style.order]) {
          order_items[style.order] = [];
        }
        order_items[style.order].push(it);
      });

      // Calculate gap between two columns.
      // Used to calculate the margin between elements in one column to be the same as the gap between columns.
      var gap = null;
      if ("2" in order_items) {
        var rect1 = order_items["1"][0].getBoundingClientRect();
        var rect2 = order_items["2"][0].getBoundingClientRect();
        gap = rect2.left - rect1.right;
      }

      var heights = {};
      var max_height = 0;
      Object.keys(order_items).forEach(function (key) {
        order_items[key].forEach(function (it) {
          it.style.marginBottom = gap + 'px'; // Same margin as gab btw columns.
          var style = getComputedStyle(it);
          var height = it.getBoundingClientRect().height + parseInt(style.marginTop, 10) + gap;
          heights[style.order] = (heights[style.order] || 0) + height;
        });
      });
      Object.values(heights).forEach(function (val) {
        if (val>max_height) {
          max_height = val;
        }
      });
      this.$el[0].style.height = max_height + "px";
      this.$el[0].classList.add('pat-mosaic--layout-done');
    },

  });

});
