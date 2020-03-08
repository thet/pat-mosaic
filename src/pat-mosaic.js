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
        el.appendChild(el_break);
      }

      this.calculate_heights();

      // calculate heights after window resize
      window.addEventListener('resize', function (e) {
        if (this.current_resize !== null) {
          window.clearTimeout(this.current_resize);
        }
        window.setTimeout(this.calculate_heights, 200);
      }.bind(this));
    },

    calculate_heights: function () {
      var heights = {};
      var max_height = 0;
      this.$el[0].querySelectorAll('.pat-mosaic__item').forEach(function (it) {
        var style = getComputedStyle(it);
        var height = it.getBoundingClientRect().height + parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
        heights[style.order] = (heights[style.order] || 0) + height;
      });
      Object.values(heights).forEach(function (val) {
        if (val>max_height) {
          max_height = val;
        }
      });
      this.$el[0].style.height = max_height + "px";
    },

  });

});
