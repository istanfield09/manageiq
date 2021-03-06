describe('dialogFieldRefresh', function() {
  describe('#addOptionsToDropDownList', function() {
    var data = {};

    beforeEach(function() {
      var html = "";
      html += '<select class="dynamic-drop-down-345 selectpicker">';
      html += '</select>';
      setFixtures(html);
    });

    context('when the refreshed values contain a checked value', function() {
      context('when the refreshed values contain a null key', function() {
        beforeEach(function() {
          data = {values: {refreshed_values: [[null, 'not test'], ['123', 'is test']], checked_value: 123}};
        });

        it('it does not blow up', function() {
          var test = function() {
            dialogFieldRefresh.addOptionsToDropDownList(data, 345);
          };
          expect(test).not.toThrow();
        });

        it('selects the option that corresponds to the checked value', function() {
          dialogFieldRefresh.addOptionsToDropDownList(data, 345);
          expect($('.dynamic-drop-down-345.selectpicker').val()).toBe('123');
        });
      });
    });

    context('when the refreshed values do not contain a checked value', function() {
      beforeEach(function() {
        data = {values: {refreshed_values: [["test", "test"], ["not test", "not test"]], checked_value: null}};
      });

      it('selects the first option', function() {
        dialogFieldRefresh.addOptionsToDropDownList(data, 345);
        expect($('.dynamic-drop-down-345.selectpicker').val()).toBe('test');
      });
    });
  });

  describe('#refreshDropDownList', function() {
    beforeEach(function() {
      spyOn(dialogFieldRefresh, 'addOptionsToDropDownList');

      spyOn($.fn, 'selectpicker');
      spyOn($, 'post').and.callFake(function() {
        var d = $.Deferred();
        d.resolve("the data");
        return d.promise();
      });
    });

    it('calls addOptionsToDropDownList', function() {
      dialogFieldRefresh.refreshDropDownList('abc', 123, 'test');
      expect(dialogFieldRefresh.addOptionsToDropDownList).toHaveBeenCalledWith("the data", 123);
    });

    it('ensures the select picker is refreshed', function() {
      dialogFieldRefresh.refreshDropDownList('abc', 123, 'test');
      expect($.fn.selectpicker).toHaveBeenCalledWith('refresh');
    });

    it('sets the value in the select picker', function() {
      dialogFieldRefresh.refreshDropDownList('abc', 123, 'test');
      expect($.fn.selectpicker).toHaveBeenCalledWith('val', 'test');
    });

    it('uses the correct selector', function() {
      dialogFieldRefresh.refreshDropDownList('abc', 123, 'test');
      expect($.fn.selectpicker.calls.mostRecent().object.selector).toEqual('#abc');
    });
  });
});
