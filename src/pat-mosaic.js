define(['pat-base'], function(Base) {

  return Base.extend({
    name: 'mosaic',
    trigger: '.pat-mosaic',
    current_resize: null,

    init: function() {

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
        var key = "" + style.order;
        if (! order_items[style.order]) {
          order_items[key] = [];
        }
        order_items[key].push(it);
      });

      // Calculate gap between two columns.
      // Used to calculate the margin between elements in one column to be the same as the gap between columns.
      var gap = null;
      if ("2" in order_items) {
        var rect1 = order_items["1"][0].getBoundingClientRect();
        var rect2 = order_items["2"][0].getBoundingClientRect();
        gap = rect2.left - rect1.right;
      } else {
        // 1-column layout. nothing to do.
        this.$el[0].style.height = null;
        return;
      }

      var heights = {};
      var max_height = 0;
      Object.keys(order_items).forEach(function (key) {
        order_items[key].forEach(function (it) {
          it.style.marginBottom = gap + 'px'; // Same margin as gab btw columns.
          var style = getComputedStyle(it);
          var height = it.getBoundingClientRect().height + parseInt(style.marginTop, 10) + gap;
          heights[key] = (heights[key] || 0) + height;
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
