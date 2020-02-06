/**
 * @license
 * =========================================================
 * bootstrap-datetimepicker.js
 * http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Copyright 2012 Stefan Petre
 *
 * Contributions:
 *  - Andrew Rowls
 *  - Thiago de Arruda
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================
 */

(function($) {

  // Picker object
  var smartPhone = (window.orientation != undefined);
  
  var DateTimePicker = function(element, options) {
    this.id = dpgId++;
    this.init(element, options);
  };

  var dateToDate = function(dt) {
    if (typeof dt === 'string') {
      return new Date(dt);
    }
    return dt;
  };

  DateTimePicker.prototype = {
    constructor: DateTimePicker,

    init: function(element, options) {
      var icon;
      if (!(options.pickTime || options.pickDate))
        throw new Error('Must choose at least one picker');
      this.options = options;
      this.$element = $(element);
      this.$element.attr("readonly", false);
      this.language = 'zh-CN';
      
      this.loadShow = options.loadShow;
      this.pickDate = options.pickDate;
      this.pickTime = options.pickTime;
      this.pickSeconds = options.pickSeconds;
      var isPickDate = this.$element.data('pick-date');
      if (isPickDate != undefined) {
        isPickDate ? this.pickDate = true : this.pickDate = false;
      }
      var isPickTime = this.$element.data('pick-time');


      if (isPickTime != undefined) {
        isPickTime ? this.pickTime = true : this.pickTime = false;
      }

      var isPickSecond = this.$element.data('pick-second');
      if (isPickSecond != undefined) {
        isPickSecond ? this.pickSeconds = true : this.pickSeconds = false;
      }


      //      alert(this.pickDate +" "+this.pickTime);
      /*      this.pickDate =  this.$element.data('date') || options.pickDate;
            alert(this.pickDate);
            this.pickTime =  this.$element.data('time') || options.pickTime;*/

      this.isInput = this.$element.is('input');
      this.component = false;
      /*
            if (this.$element.find('.input-append') || this.$element.find('.input-prepend'))
                this.component = this.$element.find('.add-on');
            if (this.component) {
              icon = this.component.find('i');
            }
      */
      if (this.pickTime) {
        //if (icon && icon.length) this.timeIcon = icon.data('time-icon');
        if (!this.timeIcon) this.timeIcon = 'fa fa-clock';
        //icon.addClass(this.timeIcon);
      }
      if (this.pickDate) {
        //if (icon && icon.length) this.dateIcon = icon.data('date-icon');
        if (!this.dateIcon) this.dateIcon = 'fa fa-calendar2';
        //icon.removeClass(this.timeIcon);
        //icon.addClass(this.dateIcon);
      }
      this.format = options.dateFormat;
      if (!this.format) {
        if (this.isInput) this.format = this.$element.data('date-format');
        else this.format = this.$element.find('input').data('date-format');
        if (!this.format) this.format = 'yyyy-MM-dd';
      }
      var isLoadShow = this.$element.hasClass("load-show") ? this.loadShow = 1 : this.loadShow = 0;
      //切记：不能与下面判断合并，此处在显示前禁用时间
      if (isLoadShow) {
        this.pickTime = false;
      }

      this._compileFormat();

      this.widget = $(getTemplate(this.timeIcon, this.pickDate, this.pickTime, options.pick12HourFormat, this.pickSeconds, options.collapse,isLoadShow)).appendTo(isLoadShow ? this.$element : $(document.body));
      this.inputStor = {
              hours:this.widget.find("#dpTime input.tb"),
              minutes:this.widget.find("#dpTime input.te"),
              seconds:this.widget.find("#dpTime input.tl")
          };
      
      if (isLoadShow) {
    	  
      }

      this.minViewMode = options.minViewMode || this.$element.data('date-minviewmode') || 0;
      if (typeof this.minViewMode === 'string') {
        switch (this.minViewMode) {
          case 'months':
            this.minViewMode = 1;
            break;
          case 'years':
            this.minViewMode = 2;
            break;
          default:
            this.minViewMode = 0;
            break;
        }
      }
      this.viewMode = options.viewMode || this.$element.data('date-viewmode') || 0;
      if (typeof this.viewMode === 'string') {
        switch (this.viewMode) {
          case 'months':
            this.viewMode = 1;
            break;
          case 'years':
            this.viewMode = 2;
            break;
          default:
            this.viewMode = 0;
            break;
        }
      }
      this.startViewMode = this.viewMode;
      this.weekStart = options.weekStart || this.$element.data('date-weekstart') || 0;
      this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
      //      alert(this.$element.data('start-date')||options.startDate );

      this.setStartDate(this.$element.data('start-date') || options.startDate);
      this.setEndDate(this.$element.data('end-date') || options.endDate);

      //      alert(this.startDate);
      //      alert(this.endDate);
      this.fillDow();
      this.fillMonths();
      //this.fillHours();
      //this.fillMinutes();
      //this.fillSeconds();
      this.update();
      this.showMode();
      this._attachDatePickerEvents();
      //this.set();
    },

    show: function(e) {
      var refObjAndOperate = this.$element.data('ref-obj');
      if (refObjAndOperate) {
        tempString = refObjAndOperate.split(" ");
        if (tempString.length == 2) {
          refObjId = tempString[0];
          operate = tempString[1];
          refObj = $(refObjId);
          if (refObj) {
            var refObjValue = refObj.val();
            if (refObjValue) {
             var refObjDate = Date.parse(refObjValue.replace(/-/g, "/")),
                 isPicker   = this.$element.data('pick-time');

              if (operate == "lt") {
                this.setEndDate(new Date(refObjDate + (isPicker?0:(3600 * 24 * 1000))));
              }
              if (operate == "gt") {
                this.setStartDate(new Date(refObjDate + (isPicker?0:(3600 * 8 * 1000))));
              }
            } else {
              if (operate == "lt" && typeof this.endDate == Date) {
                this.setEndDate(Infinity);
              }
              if (operate == "gt" && typeof this.startDate == Date) {
                this.setStartDate(Infinity);
              }
            }
          }
        }
      }

      if (!this.$element.val()) {
        var tempCurrent = new Date();
        this._date = UTCDate(
          tempCurrent.getFullYear(),
          tempCurrent.getMonth(),
          tempCurrent.getDate(),
          tempCurrent.getHours(),
          tempCurrent.getMinutes(),
          tempCurrent.getSeconds(),
          tempCurrent.getMilliseconds()
        );
        this.viewDate = this._date;
        this.fillDate();
        //return;
      }
      //为弹出框的input注入初始值
      if(this.pickDate && this.pickTime){
          this.downMenuTime();
          this.setTime(this._date.getUTCHours(),this._date.getUTCMinutes(),this._date.getUTCSeconds());
      }

      if(!this.pickDate && this.pickTime && this.pickSeconds){
          this.fillTime();
      }

      this.widget.show();

      this.height = this.component ? this.component.outerHeight() : this.$element.outerHeight();
      if (!this.loadShow) {
        this.place();
      }

      this.$element.trigger({
        type: 'show',
        date: this._date
      });
      this._attachDatePickerGlobalEvents(e);
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
    },

    disable: function() {
      this.$element.find('input').prop('disabled', true);
      this._detachDatePickerEvents();
    },
    enable: function() {
      this.$element.find('input').prop('disabled', false);
      this._attachDatePickerEvents();
    },

    hide: function(e) {
      // Ignore event if in the middle of a picker transition
      if (!this.widget.is(":visible")) {
        return;
      }
      if (this.loadShow) {
        return;
      }
      
      if(e && (e.target.name == this.$element[0].name)){
    	  return;
      }
      var collapse = this.widget.find('.collapse')
      for (var i = 0; i < collapse.length; i++) {
        var collapseData = collapse.eq(i).data('collapse');
        if (collapseData && collapseData.transitioning)
          return;
      }
      var str = this.$element.val();
      if (str != "" && str != null) {
          var edate = this.parseDate(str);
          if (!edate) {
        	  if (confirm("不合法的日期格式或日期超出限定范围,需要撤销吗?")) {
        		  this.$element.val("");
        	  } else {
        		  this.$element.val("");
        	  }
          }
      }
      this.widget.hide();
      this.viewMode = this.startViewMode;
      this.showMode();
      //this.set();
      this.$element.trigger({
        type: 'hide',
        date: this._date
      });
      //此处调用关联input失去焦点,方便input再次获取焦点时弹出选择框，由于input注册了事件onblur，调用该隐藏方法，形成嵌套，所以方法开始判断控件是否在显示状态
      //if(this.$element.focus){
      this.$element.blur();
      //}

      this._detachDatePickerGlobalEvents();
    },

    set: function() {
      var formatted = '';
      if (!this._unset) formatted = this.formatDate(this._date);
      var refObjAndOperate = this.$element.data('ref-obj'),
          isPicker   = this.$element.data('pick-time');
      if (refObjAndOperate) {
        tempString = refObjAndOperate.split(" ");
        if (tempString.length == 2) {
          refObjId = tempString[0];
          operate = tempString[1];
          refObj = $(refObjId);
          if (refObj) {
            var refObjValue = refObj.val();
            if (refObjValue) {
              var refObjDate = Date.parse(refObjValue.replace(/-/g,   "/")),
                  valueDate  = Date.parse(formatted.replace(/-/g, "/"));
              if (operate == "lt") {
                if (valueDate > refObjDate) {
                  return;
                }
              }
              if (operate == "gt") {
                if (valueDate < refObjDate) {
                  return;
                }
              }
            }
          }
        }
      }
      var ted = new Date(Date.parse(formatted.replace(/-/g, "/")) + (isPicker?0:(3600 * 24 * 1000)));

        if(isPicker){
            if(ted.valueOf() >= this.endDate.valueOf() || ted.valueOf() <= this.startDate.valueOf()){
                return;
            }
        }

      if(ted.valueOf() > this.endDate.valueOf() || ted.valueOf() < this.startDate.valueOf()){
         return;
      }
      if (!this.isInput) {
        if (this.component) {
          var input = this.$element.find('input');
          input.val(formatted);
          this._resetMaskPos(input);
        }
        this.$element.data('date', formatted);
      } else {
        this.$element.val(formatted);
        this._resetMaskPos(this.$element);
      }
    },
    //1002
    setValue: function(newDate) {
      if (!newDate) {
        this._unset = true;
      } else {
        this._unset = false;
      }
      if (typeof newDate === 'string') {
        this._date = this.parseDate(newDate);
      } else if (newDate) {
        this._date = new Date(newDate);
      }

      this.set();
      this.viewDate = UTCDate(this._date.getUTCFullYear(), this._date.getUTCMonth(), 1, 0, 0, 0, 0);
      this.fillDate();
      this.fillTime();
    },
    //设置时间 --> 时 分 秒
    setTime: function(hh,mm,ss){
        var inp = this.widget.find("input");
        var i = 0;
        while(i < inp.length){
            switch(inp[i].className){
                case "tb":
                    this.inputStor.hours.val(padLeft(hh.toString(),2,"0"));
                  break;
                case "te":
                    this.inputStor.minutes.val(padLeft(mm.toString(),2,"0"));
                  break;
                case "tl":
                    this.inputStor.seconds.val(padLeft(ss.toString(),2,"0"));
                  break;
            }
            i++;
        }
    },
    //关闭自动提示的时间信息
    downMenuTime: function(){
        $("#dpTime .menuSel").hide();
    },

    getDate: function() {
      if (this._unset) return null;
      return new Date(this._date.valueOf());
    },

    setDate: function(date) {
      if (!date) this.setValue(null);
      else this.setValue(date.valueOf());
    },

    setStartDate: function(date) {
      if (date instanceof Date) {
        this.startDate = date;
      } else if (typeof date === 'string') {
        if (date) {
          this.startDate = new Date(Date.parse(date.replace(/-/g, "/")) + 3600 * 24 * 1000);
          //alert( this.startDate);
          if (!this.startDate.getUTCFullYear()) {
            this.startDate = -Infinity;
          }
        }
      } else {
        this.startDate = -Infinity;
      }
      if (this.viewDate) {
        this.update();
      }
    },

    setEndDate: function(date) {
      if (date instanceof Date) {
        this.endDate = date;
      } else if (typeof date === 'string') {
        if (date) {
          this.endDate = new Date(Date.parse(date.replace(/-/g, "/")));
          if (!this.endDate.getUTCFullYear()) {
            this.endDate = Infinity;
          }
        }
      } else {
        this.endDate = Infinity;
      }
      if (this.viewDate) {
        this.update();
      }
    },

    getLocalDate: function() {
      if (this._unset) return null;
      var d = this._date;
      return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),
        d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
    },

    setLocalDate: function(localDate) {
      if (!localDate) this.setValue(null);
      else
        this.setValue(Date.UTC(
          localDate.getFullYear(),
          localDate.getMonth(),
          localDate.getDate(),
          localDate.getHours(),
          localDate.getMinutes(),
          localDate.getSeconds(),
          localDate.getMilliseconds()));
    },

    place: function() {
      var position = 'absolute';
      var offset = this.component ? this.component.offset() : this.$element.offset();
      this.width = this.component ? this.component.outerWidth() : this.$element.outerWidth(true);
      var dateHeight  = this.widget.outerHeight(true),		//当前date的高度
      	  $window	  = $(document.body),
      	  inputHeight = this.component ? this.component.offset() : this.$element.offset();

      offset.top = offset.top + this.height;
//        + $window.scrollTop();
      
      if (this.options.width != undefined) {
        this.widget.width(this.options.width);
      }
      
      if (this.options.orientation == 'left') {
        this.widget.addClass('left-oriented');
        offset.left = offset.left - this.width + 20;
      }
      //判断弹出层
      if (this._isInFixed()) {
        position = 'fixed';
        offset.top = inputHeight.top + this.height;
        offset.left = offset.left;
      }
      //判断右边距
      if ($window.width() < inputHeight.left + this.width) {
        offset.right = $window.width() - offset.left - this.width + ((position == 'fixed') ? 155 : 18);
        offset.left = 'auto';
        (position == 'fixed') ? offset.left = offset.left - ((this.width > 120) ? this.height : 105): '';
      } else {
        offset.right = 'auto';
      }
      //判断下边据
      if ($window.height() < (inputHeight.top + dateHeight + 34)) {
        offset.top = offset.top - this.height - dateHeight;
      }
      
      this.widget.css({
        position: position,
        top: offset.top,
        left: offset.left,
        right: offset.right
      });
    },

    notifyChange: function() {
      this.$element.trigger({
        type: 'changeDate',
        date: this.getDate(),
        localDate: this.getLocalDate()
      });
    },

    update: function(newDate) {
      var dateStr = newDate;
      if (!dateStr) {
        if (this.isInput) {
          dateStr = this.$element.val();
        } else {
          dateStr = this.$element.find('input').val();
        }
        if (dateStr) {
          this._date = this.parseDate(dateStr);
        }
        if (!this._date) {
          var tmp = new Date()
          this._date = UTCDate(tmp.getFullYear(),
            tmp.getMonth(),
            tmp.getDate(),
            tmp.getHours(),
            tmp.getMinutes(),
            tmp.getSeconds(),
            tmp.getMilliseconds())
        }
      }
      this.viewDate = UTCDate(this._date.getUTCFullYear(), this._date.getUTCMonth(), 1, 0, 0, 0, 0);
      this.fillDate();
      this.fillTime();
    },

    fillDow: function() {
      var dowCnt = this.weekStart;
      var html = $('<tr>');
      while (dowCnt < this.weekStart + 7) {
        html.append('<th class="dow">' + dates[this.language].daysMin[(dowCnt++) % 7] + '</th>');
      }
      this.widget.find('.datepicker-days thead').append(html);
    },

    fillMonths: function() {
      var html = '';
      var i = 0
      while (i < 12) {
        html += '<span class="month">' + dates[this.language].monthsShort[i++] + '</span>';
      }
      this.widget.find('.datepicker-months td').append(html);
    },

    fillDate: function() {
      var year = this.viewDate.getUTCFullYear();
      var month = this.viewDate.getUTCMonth();
      var currentDate = UTCDate(
        this._date.getUTCFullYear(),
        this._date.getUTCMonth(),
        this._date.getUTCDate(),
        0, 0, 0, 0
      );
      var startYear = typeof this.startDate === 'object' ? this.startDate.getUTCFullYear() : -Infinity;
      var startMonth = typeof this.startDate === 'object' ? this.startDate.getUTCMonth() : -1;
      var endYear = typeof this.endDate === 'object' ? this.endDate.getUTCFullYear() : Infinity;
      var endMonth = typeof this.endDate === 'object' ? this.endDate.getUTCMonth() : 12;

      this.widget.find('.datepicker-days').find('.disabled').removeClass('disabled');
      this.widget.find('.datepicker-months').find('.disabled').removeClass('disabled');
      this.widget.find('.datepicker-years').find('.disabled').removeClass('disabled');

      this.widget.find('.datepicker-days th:eq(1)').text(year + '年 ' + dates[this.language].months[month]);

      var prevMonth = UTCDate(year, month - 1, 28, 0, 0, 0, 0);
      var day = DPGlobal.getDaysInMonth(
        prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
      prevMonth.setUTCDate(day);
      prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7) % 7);
      if ((year == startYear && month <= startMonth) || year < startYear) {
        this.widget.find('.datepicker-days th:eq(0)').addClass('disabled');
      }
      if ((year == endYear && month >= endMonth) || year > endYear) {
        this.widget.find('.datepicker-days th:eq(2)').addClass('disabled');
      }

      var nextMonth = new Date(prevMonth.valueOf());
      nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
      nextMonth = nextMonth.valueOf();
      var html = [];
      var row;
      var clsName;
      while (prevMonth.valueOf() < nextMonth) {
        if (prevMonth.getUTCDay() === this.weekStart) {
          row = $('<tr>');
          html.push(row);
        }
        clsName = '';
        if (prevMonth.getUTCFullYear() < year ||
          (prevMonth.getUTCFullYear() == year &&
            prevMonth.getUTCMonth() < month)) {
          clsName += ' old';
        } else if (prevMonth.getUTCFullYear() > year ||
          (prevMonth.getUTCFullYear() == year &&
            prevMonth.getUTCMonth() > month)) {
          clsName += ' new';
        }

        if (prevMonth.valueOf() === currentDate.valueOf()) {
          clsName += ' active';
        }
        if ((prevMonth.valueOf() + 86400000) <= this.startDate) {
          clsName += ' disabled';
        }
        if (prevMonth.valueOf() > this.endDate) {
          clsName += ' disabled';
        }
        row.append('<td class="day' + clsName + '">' + prevMonth.getUTCDate() + '</td>');
        prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
      }
      this.widget.find('.datepicker-days tbody').empty().append(html);
      var currentYear = this._date.getUTCFullYear();

      var months = this.widget.find('.datepicker-months').find(
        'th:eq(1)').text(year + '年').end().find('span').removeClass('active');
      if (currentYear === year) {
        months.eq(this._date.getUTCMonth()).addClass('active');
      }
      if (currentYear - 1 < startYear) {
        this.widget.find('.datepicker-months th:eq(0)').addClass('disabled');
      }
      if (currentYear + 1 > endYear) {
        this.widget.find('.datepicker-months th:eq(2)').addClass('disabled');
      }
      for (var i = 0; i < 12; i++) {
        if ((year == startYear && startMonth > i) || (year < startYear)) {
          $(months[i]).addClass('disabled');
        } else if ((year == endYear && endMonth < i) || (year > endYear)) {
          $(months[i]).addClass('disabled');
        }
      }

      html = '';
      year = parseInt(year / 10, 10) * 10;
      var yearCont = this.widget.find('.datepicker-years').find(
        'th:eq(1)').text(year + '年 - ' + (year + 9) + '年').end().find('td');
      this.widget.find('.datepicker-years').find('th').removeClass('disabled');
      if (startYear > year) {
        this.widget.find('.datepicker-years').find('th:eq(0)').addClass('disabled');
      }
      if (endYear < year + 9) {
        this.widget.find('.datepicker-years').find('th:eq(2)').addClass('disabled');
      }
      year -= 1;
      for (var i = -1; i < 11; i++) {
        html += '<span class="year' + (i === -1 || i === 10 ? ' old' : '') + (currentYear === year ? ' active' : '') + ((year < startYear || year > endYear) ? ' disabled' : '') + '">' + year + '</span>';
        year += 1;
      }
      yearCont.html(html);
    },

    fillHours: function() {
      var table = this.widget.find(
        '.timepicker .timepicker-hours table');
      table.parent().hide();
      var html = '';
      if (this.options.pick12HourFormat) {
        var current = 1;
        for (var i = 0; i < 3; i += 1) {
          html += '<tr>';
          for (var j = 0; j < 4; j += 1) {
            var c = current.toString();
            html += '<td class="hour">' + padLeft(c, 2, '0') + '</td>';
            current++;
          }
          html += '</tr>'
        }
      } else {
        var current = 0;
        for (var i = 0; i < 6; i += 1) {
          html += '<tr>';
          for (var j = 0; j < 4; j += 1) {
            var c = current.toString();
            html += '<td class="hour">' + padLeft(c, 2, '0') + '</td>';
            current++;
          }
          html += '</tr>'
        }
      }
      table.html(html);
    },

    fillMinutes: function() {
      var table = this.widget.find(
        '.timepicker .timepicker-minutes table');
      table.parent().hide();
      var html = '';
      var current = 0;
      for (var i = 0; i < 5; i++) {
        html += '<tr>';
        for (var j = 0; j < 4; j += 1) {
          var c = current.toString();
          html += '<td class="minute">' + padLeft(c, 2, '0') + '</td>';
          current += 3;
        }
        html += '</tr>';
      }
      table.html(html);
    },

    fillSeconds: function() {
      var table = this.widget.find(
        '.timepicker .timepicker-seconds table');
      table.parent().hide();
      var html = '';
      var current = 0;
      for (var i = 0; i < 5; i++) {
        html += '<tr>';
        for (var j = 0; j < 4; j += 1) {
          var c = current.toString();
          html += '<td class="second">' + padLeft(c, 2, '0') + '</td>';
          current += 3;
        }
        html += '</tr>';
      }
      table.html(html);
    },
    //1003
    fillTime: function() {
      if (!this._date)
        return;
      var timeComponents = this.widget.find('.timepicker span[data-time-component]');
      var table = timeComponents.closest('table');
      var is12HourFormat = this.options.pick12HourFormat;
      var hour = this._date.getUTCHours();
      var minute = 0,second = 0;
      var period = 'AM';
      if (is12HourFormat) {
        if (hour >= 12) period = 'PM';
        if (hour === 0) hour = 12;
        else if (hour != 12) hour = hour % 12;
        this.widget.find(
          '.timepicker [data-action=togglePeriod]').text(period);
      }
    
      hour = hour.toString();
      minute = this._date.getUTCMinutes().toString();
      second = this._date.getUTCSeconds().toString();
      timeComponents.find("input").each(function(){
          switch($(this).data('action')){
              case "selectHour":
                  $(this).val(padLeft(hour,2,"0"));
                break;
              case "selectMinute":
                  $(this).val(padLeft(minute,2,"0"));
                break;
              case "selectSecond":
                  $(this).val(padLeft(second,2,"0"));
                break;
          }
      });
      // timeComponents.filter('[data-time-component=hours]').val(hour);
      // timeComponents.filter('[data-time-component=minutes] input').val(minute);
      // timeComponents.filter('[data-time-component=seconds] input').val(second);
    },

    click: function(e) {
      e.stopPropagation();
      e.preventDefault();
      this._unset = false;
      var target = $(e.target).closest('span, td, th, button, i, input');
      if (target.length === 1) {
        if (!target.is('.disabled')) {
          this.downMenuTime();
          switch (target[0].nodeName.toLowerCase()) {
            case 'th':
              switch (target[0].className) {
                case 'switch':
                  this.showMode(1);
                  break;
                case 'prev':
                case 'next':
                  var vd = this.viewDate;
                  var navFnc = DPGlobal.modes[this.viewMode].navFnc;
                  var step = DPGlobal.modes[this.viewMode].navStep;
                  if (target[0].className === 'prev') step = step * -1;
                  vd['set' + navFnc](vd['get' + navFnc]() + step);
                  this.fillDate();
                  this.set();
                  break;
              }
              break;
            case 'span':
              var falg = false; 
              if(target.is('.menuSapn')){
                var tae = parseInt(target.text(), 10) || 0;
                if(target.parent().is(".hhMenu")){
                    this.inputStor.hours.val(padLeft(tae.toString(),2,"0"));      
                }
                if(target.parent().is(".mmMenu")){
                    this.inputStor.minutes.val(padLeft(tae.toString(),2,"0"));
                }
                if(target.parent().is(".ssMenu")){
                    this.inputStor.seconds.val(padLeft(tae.toString(),2,"0"));
                }
                this.downMenuTime();
                return;
              }
              if (target.is('.month')) {
            	falg = true;
                var month = target.parent().find('span').index(target);
                this.viewDate.setUTCMonth(month);
              } else {
                var year = parseInt(target.text(), 10) || 0;
                this.viewDate.setUTCFullYear(year);
              }
              if (this.viewMode !== 0) {
                this._date = UTCDate(
                  this.viewDate.getUTCFullYear(),
                  this.viewDate.getUTCMonth(),
                  this.viewDate.getUTCDate(),
                  this._date.getUTCHours(),
                  this._date.getUTCMinutes(),
                  this._date.getUTCSeconds(),
                  this._date.getUTCMilliseconds()
                );
                this.notifyChange();
              }
              this.showMode(-1);
              this.fillDate();
              this.set();
              if(this.viewMode == 2 && this.minViewMode == 2){
                  this.hide();
              }
              if(falg && this.minViewMode == 1){
            	  this.hide();
              }
              break;
            case 'td':
              if (target.is('.day')) {
                var day = parseInt(target.text(), 10) || 1;
                var month = this.viewDate.getUTCMonth();
                var year = this.viewDate.getUTCFullYear();
                if (target.is('.old')) {
                  if (month === 0) {
                    month = 11;
                    year -= 1;
                  } else {
                    month -= 1;
                  }
                } else if (target.is('.new')) {
                  if (month == 11) {
                    month = 0;
                    year += 1;
                  } else {
                    month += 1;
                  }
                }
                this._date = UTCDate(
                  year, month, day,
                  this._date.getUTCHours(),
                  this._date.getUTCMinutes(),
                  this._date.getUTCSeconds(),
                  this._date.getUTCMilliseconds()
                );

                this.viewDate = UTCDate(
                  year, month, Math.min(28, day), 0, 0, 0, 0);

                this.onCallback(e);
                this.fillDate();
                this.set();
                this.notifyChange();
                if(this.pickTime && this.pickDate){
                    if (target.is('.active')) {
                        this.hide();
                    }
                }else{
                    this.hide();
                }
              }
              break;
            case 'button':
              switch (target[0].className) {
                case 'clear':
                    this.$element.val("").removeClass("ferror");
                    this.hide();
                  break;
                case 'today':
                	var tmp = new Date();
                    if(this.pickDate && this.pickTime){
                        this._date = UTCDate(
                            tmp.getFullYear(),
                            tmp.getMonth(),
                            tmp.getDate(),
                            this.compareTime(this.inputStor.hours.val(),"hour"),
                            this.compareTime(this.inputStor.minutes.val(),"minutes"),
                            this.compareTime(this.inputStor.seconds.val(),"seconds"),
                            this._date.getUTCMilliseconds()
                        );
                    }else{
                        this._date = UTCDate(
                            tmp.getFullYear(),
                            tmp.getMonth(),
                            tmp.getDate(),
                            tmp.getUTCHours(),
                            tmp.getUTCMinutes(),
                            tmp.getUTCSeconds(),
                            tmp.getUTCMilliseconds()
                        );
                    }
                    this.fillDate();
                    this.set();
                    this.notifyChange();
                    this.hide();
                    this.onCallback(e);
                  break;
                case 'confirm':
                    if(this.pickDate && this.pickTime){              
                        this._date = UTCDate(
                        	this._date.getUTCFullYear(),
                        	this._date.getUTCMonth(),
                        	this._date.getUTCDate(),
                            this.compareTime(this.inputStor.hours.val(),"hour"),
                            this.compareTime(this.inputStor.minutes.val(),"minutes"),
                            this.compareTime(this.inputStor.seconds.val(),"seconds"),
                            this._date.getUTCMilliseconds()
                        );

                    }
                    this.set();
                    this.notifyChange();
                    this.hide();
                    this.onCallback(e);
                  break;
              }
              break;
            case 'i':
              //alert("click for clock");
              break;
            case 'input':
              switch (target[0].className) {
                case 'tb':
                  $(target[0]).focus();
                  $(target[0]).blur(function(){
                     var s = parseInt($(this).val(),10) || 0;
                     if(s > 23) s = 23;
                     $(target[0]).val(padLeft(s.toString(),2,"0"));
                  });
                  $("#dpTime .hhMenu").show().siblings(".menuSel").hide();
                  break;
                case 'te':
                  $(target[0]).focus();
                  $(target[0]).blur(function(){
                     var s = parseInt($(this).val(),10) || 0;
                     if(s > 59) s = 59;
                     $(target[0]).val(padLeft(s.toString(),2,"0"));
                  });
                  $("#dpTime .mmMenu").show().siblings(".menuSel").hide();
                  break;
                case 'tl':
                  $(target[0]).focus();
                  $(target[0]).blur(function(){
                     var s = parseInt($(this).val(),10) || 0;
                     if(s > 59) s = 59;
                     $(target[0]).val(padLeft(s.toString(),2,"0"));
                  });
                  $("#dpTime .ssMenu").show().siblings(".menuSel").hide();
                  break;
              }
              break;
          }
        }
      }
    },
    onCallback : function(e){
        var functionName = this.$element.data('callback') || 0;
        if(functionName){
            var functionObj = eval(functionName);
            if (typeof(functionObj) == "function") {  
                e.pickerObject = this;
                functionObj.apply(this.$element, arguments);
            }
        }
    },
    actions: {
      incrementHours: function(e) {
    	  this.actions.blurTime.call(this);
          this._date.setUTCHours(this._date.getUTCHours() + 1);
      },

      incrementMinutes: function(e) {
    	  this.actions.blurTime.call(this);
          this._date.setUTCMinutes(this._date.getUTCMinutes() + 1);
      },

      incrementSeconds: function(e) {
    	  this.actions.blurTime.call(this);
    	  this._date.setUTCSeconds(this._date.getUTCSeconds() + 1);
      },

      decrementHours: function(e) {
    	  this.actions.blurTime.call(this);
          this._date.setUTCHours(this._date.getUTCHours() - 1);
      },

      decrementMinutes: function(e) {
    	  this.actions.blurTime.call(this);
          this._date.setUTCMinutes(this._date.getUTCMinutes() - 1);
      },

      decrementSeconds: function(e) {
    	  this.actions.blurTime.call(this);
          this._date.setUTCSeconds(this._date.getUTCSeconds() - 1);
      },

      togglePeriod: function(e) {
        var hour = this._date.getUTCHours();
        if (hour >= 12) hour -= 12;
        else hour += 12;
        this._date.setUTCHours(hour);
      },

      showPicker: function() {
        this.widget.find('.timepicker > div:not(.timepicker-picker)').hide();
        this.widget.find('.timepicker .timepicker-picker').show();
      },

      showHours: function() {
        // this.widget.find('.timepicker .timepicker-picker').hide();
        // this.widget.find('.timepicker .timepicker-hours').show();
      },
      
      sureTime: function(e){
          var timeComponents = this.widget.find('.timepicker span[data-time-component]'),that = this;
          timeComponents.find("input").each(function(){
              var date = $(this).val();
              switch($(this).data('action')){
                  case "selectHour":
                      that._date.setUTCHours(that.compareTime(date,"hour"));
                    break;
                  case "selectMinute":
                      that._date.setUTCMinutes(that.compareTime(date,"minutes"));
                    break;
                  case "selectSecond":
                      that._date.setUTCSeconds(that.compareTime(date,"seconds"));
                    break;
              }
          });
          that.hide();
          this.onCallback(e);
      },
      
      clearTime: function(){
    	  this.$element.val("");
          this.hide();
      },
      
      showMinutes: function() {
        // this.widget.find('.timepicker .timepicker-picker').hide();
        // this.widget.find('.timepicker .timepicker-minutes').show();
      },

      showSeconds: function() {
        // this.widget.find('.timepicker .timepicker-picker').hide();
        // this.widget.find('.timepicker .timepicker-seconds').show();
      },
      
      blurTime: function(){
    	  var timeComponents = this.widget.find('.timepicker span[data-time-component]'),that = this;
          timeComponents.find("input").each(function(){
              var date = $(this).val();
              switch($(this).data('action')){
                  case "selectHour":
                      that._date.setUTCHours(that.compareTime(date,"hour"));
                    break;
                  case "selectMinute":
                      that._date.setUTCMinutes(that.compareTime(date,"minutes"));
                    break;
                  case "selectSecond":
                      that._date.setUTCSeconds(that.compareTime(date,"seconds"));
                    break;
              }
          });
      },
      
      selectHour: function(e) {
    	 $(e.target).focus();
//         var tgt = $(e.target),that = this;
//         $(tgt).focus();
        // var value = parseInt(tgt.text(), 10);
        // if (this.options.pick12HourFormat) {
        //   var current = this._date.getUTCHours();
        //   if (current >= 12) {
        //     if (value != 12) value = (value + 12) % 24;
        //   } else {
        //     if (value === 12) value = 0;
        //     else value = value % 12;
        //   }
        // }
        // this._date.setUTCHours(value);

        // this.actions.showPicker.call(this);
      },

      selectMinute: function(e) {
    	  $(e.target).focus();
//        var tgt = $(e.target),that = this;
//        $(tgt).focus();
        // var value = parseInt(tgt.text(), 10);
        // this._date.setUTCMinutes(value);
        // this.actions.showPicker.call(this);
      },

      selectSecond: function(e) {
    	  $(e.target).focus();
//        var tgt = $(e.target),that = this;
//        $(tgt).focus();
        // var value = parseInt(tgt.text(), 10);
        // this._date.setUTCSeconds(value);
        // this.actions.showPicker.call(this);
      }
    },
    //1001
    doAction: function(e) {
      e.stopPropagation();
      e.preventDefault();
      if (!this._date) this._date = UTCDate(1970, 0, 0, 0, 0, 0, 0);
      var action = $(e.currentTarget).data('action');
      var rv = this.actions[action].apply(this, arguments);
      if(action == "clearTime" || action == "selectHour" || action == "selectMinute" || action == "selectSecond") return rv;
      this.set();
      this.fillTime();
      this.notifyChange();
      return rv;
    },
    setFillTime:function(date,type){
        if(date !== ""){
            if(type == "hour"){
                this._date.setUTCHours(this.compareTime(date,type));
            }else if(type == "minute"){
                this._date.setUTCMinutes(this.compareTime(date,type));
            }else if(type == "second"){
                this._date.setUTCSeconds(this.compareTime(date,type));
            }
            this.set();
            this.fillTime();
            this.notifyChange();
        }
    },
    stopEvent: function(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    compareTime: function(date,type){
        var td = parseInt(date,10) || 0;
        if(type == "hour"){
            if(td > 23) td = 23;
        }else{
            if(td > 59) td = 59;
        }
        return td;
    },
    // part of the following code was taken from
    // http://cloud.github.com/downloads/digitalBush/jquery.maskedinput/jquery.maskedinput-1.3.js
    keydown: function(e) {
      // when hiting TAB, for accessibility
      var key = e.keyCode || e.which;
      if (key == 9) this.hide();
    },

    keypress: function(e) {
      var key = String.fromCharCode(e.keyCode).toLowerCase();
      if (e.ctrlKey && key == "v") {
        return;
      }
      var k = e.which;
      if (k == 8 || k == 46) {
        // For those browsers which will trigger
        // keypress on backspace/delete
        return;
      }
      var input = $(e.target);
      var c = String.fromCharCode(k);
      var val = input.val() || '';
      val += c;
      var mask = this._mask[this._maskPos];
      if (!mask) {
        return false;
      }
      if (mask.end != val.length) {
        return;
      }
      if (!mask.pattern.test(val.slice(mask.start))) {
        val = val.slice(0, val.length - 1);
        while ((mask = this._mask[this._maskPos]) && mask.character) {
          val += mask.character;
          // advance mask position past static
          // part
          this._maskPos++;
        }
        val += c;
        if (mask.end != val.length) {
          input.val(val);
          return false;
        } else {
          if (!mask.pattern.test(val.slice(mask.start))) {
            input.val(val.slice(0, mask.start));
            return false;
          } else {
            input.val(val);
            this._maskPos++;
            return false;
          }
        }
      } else {
        this._maskPos++;
      }
    },

    change: function(e) {
      var input = $(e.target);
      this._resetMaskPos(input);
    },

    showMode: function(dir) {
      if (dir) {
        this.viewMode = Math.max(this.minViewMode, Math.min(
          2, this.viewMode + dir));
      }
      this.widget.find('.datepicker > div').hide().filter(
        '.datepicker-' + DPGlobal.modes[this.viewMode].clsName).show();
    },

    destroy: function() {
      this._detachDatePickerEvents();
      this._detachDatePickerGlobalEvents();
      this.widget.remove();
      this.$element.removeData('datetimepicker');

      this.component.removeData('datetimepicker');
    },

    formatDate: function(d) {
      return this.format.replace(formatReplacer, function(match) {
        var methodName, property, rv, len = match.length;
        if (match === 'ms')
          len = 1;
        property = dateFormatComponents[match].property
        if (property === 'Hours12') {
          rv = d.getUTCHours();
          if (rv === 0) rv = 12;
          else if (rv !== 12) rv = rv % 12;
        } else if (property === 'Period12') {
          if (d.getUTCHours() >= 12) return 'PM';
          else return 'AM';
        } else if (property === 'UTCYear') {
          rv = d.getUTCFullYear();
          rv = rv.toString().substr(2);
        } else {
          methodName = 'get' + property;
          rv = d[methodName]();
        }
        if (methodName === 'getUTCMonth') rv = rv + 1;
        return padLeft(rv.toString(), len, '0');
      });
    },

    parseDate: function(str) {
      var match, i, property, methodName, value, parsed = {};
      if (!(match = this._formatPattern.exec(str)))
        return null;
      for (i = 1; i < match.length; i++) {
        property = this._propertiesByIndex[i];
        if (!property)
          continue;
        value = match[i];
        if (/^\d+$/.test(value))
          value = parseInt(value, 10);
        parsed[property] = value;
      }
      return this._finishParsingDate(parsed);
    },

    _resetMaskPos: function(input) {
      var val = input.val();
      for (var i = 0; i < this._mask.length; i++) {
        if (this._mask[i].end > val.length) {
          // If the mask has ended then jump to
          // the next
          this._maskPos = i;
          break;
        } else if (this._mask[i].end === val.length) {
          this._maskPos = i + 1;
          break;
        }
      }
    },

    _finishParsingDate: function(parsed) {
      var year, month, date, hours, minutes, seconds, milliseconds;
      year = parsed.UTCFullYear;
      if (parsed.UTCYear) year = 2000 + parsed.UTCYear;
      if (!year) year = 1970;
      if (parsed.UTCMonth) month = parsed.UTCMonth - 1;
      else month = 0;
      date = parsed.UTCDate || 1;
      hours = parsed.UTCHours || 0;
      minutes = parsed.UTCMinutes || 0;
      seconds = parsed.UTCSeconds || 0;
      milliseconds = parsed.UTCMilliseconds || 0;
      if (parsed.Hours12) {
        hours = parsed.Hours12;
      }
      if (parsed.Period12) {
        if (/pm/i.test(parsed.Period12)) {
          if (hours != 12) hours = (hours + 12) % 24;
        } else {
          hours = hours % 12;
        }
      }
      return UTCDate(year, month, date, hours, minutes, seconds, milliseconds);
    },

    _compileFormat: function() {
      var match, component, components = [],
        mask = [],
        str = this.format,
        propertiesByIndex = {},
        i = 0,
        pos = 0;
      while (match = formatComponent.exec(str)) {
        component = match[0];
        if (component in dateFormatComponents) {
          i++;
          propertiesByIndex[i] = dateFormatComponents[component].property;
          components.push('\\s*' + dateFormatComponents[component].getPattern(
            this) + '\\s*');
          mask.push({
            pattern: new RegExp(dateFormatComponents[component].getPattern(
              this)),
            property: dateFormatComponents[component].property,
            start: pos,
            end: pos += component.length
          });
        } else {
          components.push(escapeRegExp(component));
          mask.push({
            pattern: new RegExp(escapeRegExp(component)),
            character: component,
            start: pos,
            end: ++pos
          });
        }
        str = str.slice(component.length);
      }
      this._mask = mask;
      this._maskPos = 0;
      this._formatPattern = new RegExp(
        '^\\s*' + components.join('') + '\\s*$');
      this._propertiesByIndex = propertiesByIndex;
    },
    inputBlur: function(e) {
      if (!this.widget.is(":visible")) {
        return;
      }
    },
    _attachDatePickerEvents: function() {
      var self = this;
      // this handles date picker clicks
      this.widget.on('click', '.datepicker *', $.proxy(this.click, this));
      //this.widget.on('dblclick', '.datepicker *', $.proxy(this.test, this));
      // this handles time picker clicks
      this.widget.on('click', '[data-action]', $.proxy(this.doAction, this));
      if (this.isInput) {

        this.$element.on('blur', $.proxy(this.inputBlur, this));
      }

      this.widget.on('mousedown', $.proxy(this.stopEvent, this));
      if (this.pickDate && this.pickTime) {
        //日历折叠匿名函数
        this.widget.on('click.togglePicker', '.accordion-toggle', function(e) {
          e.stopPropagation();
          var $this = $(this);
          var $parent = $this.closest('ul');
          var expanded = $parent.find('.collapse.in');
          var closed = $parent.find('.collapse:not(.in)');

          if (expanded && expanded.length) {
            var collapseData = expanded.data('collapse');
            if (collapseData && collapseData.transitioning) return;
            expanded.collapse('hide');
            closed.collapse('show')
            $this.find('i').toggleClass(self.timeIcon + ' ' + self.dateIcon);
            self.$element.find('.add-on i').toggleClass(self.timeIcon + ' ' + self.dateIcon);
          }
        });
      }
      if (this.loadShow) {
        this.widget.show()
      }
      if (this.isInput) {
        this.$element.on({
          'click': $.proxy(this.show, this),
          'keyup': $.proxy(this.change, this)
        });
        if (this.options.maskInput) {
          this.$element.on({
            'keydown': $.proxy(this.keydown, this),
            'keypress': $.proxy(this.keypress, this)
          });
        }
      } else {
        this.$element.on({
          'change': $.proxy(this.change, this)
        }, 'input');
        if (this.options.maskInput) {
          this.$element.on({
            'keydown': $.proxy(this.keydown, this),
            'keypress': $.proxy(this.keypress, this)
          }, 'input');
        }
        if (this.component) {
          this.component.on('click', $.proxy(this.show, this));
        } else {
          this.$element.on('click', $.proxy(this.show, this));
        }
      }
    },

    _attachDatePickerGlobalEvents: function(e) {
      //$(window).on('resize.datetimepicker' + this.id, $.proxy(this.place, this));
      //if (!this.isInput) {
      $(document).on(
        'mousedown.datetimepicker' + this.id, $.proxy(this.hide, this));
      //}
    },

    _detachDatePickerEvents: function() {
      this.widget.off('click', '.datepicker *', this.click);
      this.widget.off('click', '[data-action]');
      this.widget.off('mousedown', this.stopEvent);
      if (this.pickDate && this.pickTime) {
        this.widget.off('click.togglePicker');
      }
      if (this.isInput) {
        this.$element.off("blur", this.inputBlur);
        this.$element.off({
          'click': this.show,
          'change': this.change
        });
        if (this.options.maskInput) {
          this.$element.off({
            'keydown': this.keydown,
            'keypress': this.keypress
          });
        }
      } else {
        this.$element.off({
          'change': this.change
        }, 'input');
        if (this.options.maskInput) {
          this.$element.off({
            'keydown': this.keydown,
            'keypress': this.keypress
          }, 'input');
        }
        if (this.component) {
          this.component.off('click', this.show);
        } else {
          this.$element.off('click', this.show);
        }
      }
    },

    _detachDatePickerGlobalEvents: function() {
      $(window).off('resize.datetimepicker' + this.id);
      //if (!this.isInput) {
      $(document).off('mousedown.datetimepicker' + this.id);
      //}
    },

    _isInFixed: function() {
      if (this.$element) {
        var parents = this.$element.parents();
        var inFixed = false;
        for (var i = 0; i < parents.length; i++) {
          if ($(parents[i]).css('position') == 'fixed') {
            inFixed = true;
            break;
          }
        };
        return inFixed;
      } else {
        return false;
      }
    }

  };

  $.fn.datepicker = function(option, val) {
    return this.each(function() {
      var $this = $(this),
        data = $this.data('datetimepicker'),
        options = typeof option === 'object' && option;
      if (!data) {
        $this.data('datetimepicker', (data = new DateTimePicker(
          this, $.extend({}, $.fn.datepicker.defaults, options))));
      }
      if (typeof option === 'string') data[option](val);
    });
  };

  $.fn.datepicker.defaults = {
    maskInput: true,
    pickDate: true,
    pickTime: false,
    pick12HourFormat: false,
    pickSeconds: true,
    startDate: -Infinity,
    endDate: Infinity,
    collapse: true,
    loadShow: false
  };
  $.fn.datepicker.Constructor = DateTimePicker;
  var dpgId = 0;
  var dates = $.fn.datepicker.dates = {
    "zh-CN": {
      days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
      daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
      months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      today: "今日"
    }
  };

  var dateFormatComponents = {
    dd: {
      property: 'UTCDate',
      getPattern: function() {
        return '(0?[1-9]|[1-2][0-9]|3[0-1])\\b';
      }
    },
    MM: {
      property: 'UTCMonth',
      getPattern: function() {
        return '(0?[1-9]|1[0-2])\\b';
      }
    },
    yy: {
      property: 'UTCYear',
      getPattern: function() {
        return '(\\d{2})\\b'
      }
    },
    yyyy: {
      property: 'UTCFullYear',
      getPattern: function() {
        return '(\\d{4})\\b';
      }
    },
    hh: {
      property: 'Hours12',
      getPattern: function() {
        return '(0?[1-9]|1[0-2])\\b';
      }
    },
    mm: {
      property: 'UTCMinutes',
      getPattern: function() {
        return '(0?[0-9]|[1-5][0-9])\\b';
      }
    },
    ss: {
      property: 'UTCSeconds',
      getPattern: function() {
        return '(0?[0-9]|[1-5][0-9])\\b';
      }
    },
    ms: {
      property: 'UTCMilliseconds',
      getPattern: function() {
        return '([0-9]{1,3})\\b';
      }
    },
    HH: {
      property: 'UTCHours',
      getPattern: function() {
        return '(0?[0-9]|1[0-9]|2[0-3])\\b';
      }
    },
    PP: {
      property: 'Period12',
      getPattern: function() {
        return '(AM|PM|am|pm|Am|aM|Pm|pM)\\b';
      }
    }
  };

  var keys = [];
  for (var k in dateFormatComponents) keys.push(k);
  keys[keys.length - 1] += '\\b';
  keys.push('.');

  var formatComponent = new RegExp(keys.join('\\b|'));
  keys.pop();
  var formatReplacer = new RegExp(keys.join('\\b|'), 'g');

  function escapeRegExp(str) {
    // http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  function padLeft(s, l, c) {
    if (l < s.length) return s;
    else return Array(l - s.length + 1).join(c || ' ') + s;
  }

  function getTemplate(timeIcon, pickDate, pickTime, is12Hours, showSeconds, collapse, isShow) {
    if (pickDate && pickTime) {
      return (
        '<div class="bootstrap-datetimepicker-widget dropdown-menu 3" style="max-height:235px;">' +
        //'<ul>' +
        //'<li' + (collapse ? ' class="collapse in"' : '') + '>' +
        '<div class="datepicker">' +
        DPGlobal.tempButton(timeIcon,isShow) +
        '</div>' +
        //'</li>' +
        //'<li class="picker-switch accordion-toggle"><a><i class="' + timeIcon + '"></i></a></li>' +
        //'<li' + (collapse ? ' class="collapse"' : '') + '>' +
        //'<div class="timepicker">' +
        //TPGlobal.getTemplate(is12Hours, showSeconds) +
        //'</div>' +
        // '</li>' +
        // '</ul>' +
        '</div>'
      );
    } else if (pickTime) {
      return (
        '<div class="bootstrap-datetimepicker-widget dropdown-menu 2">' +
        '<div class="timepicker">' +
        TPGlobal.getTemplate(is12Hours, showSeconds) +
        '</div>' +
        '</div>'
      );
    } else {
      return (
        '<div class="bootstrap-datetimepicker-widget dropdown-menu 1" style="max-height:215px;">' +
        '<div class="datepicker">' +
        DPGlobal.tempButton(null,isShow) +
        '</div>' +
        '</div>'
      );
    }
  }

  function UTCDate() {

    return new Date(Date.UTC.apply(Date, arguments));
  }

  var DPGlobal = {
    modes: [{
      clsName: 'days',
      navFnc: 'UTCMonth',
      navStep: 1
    }, {
      clsName: 'months',
      navFnc: 'UTCFullYear',
      navStep: 1
    }, {
      clsName: 'years',
      navFnc: 'UTCFullYear',
      navStep: 10
    }],
    isLeapYear: function(year) {
      return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
    },
    getDaysInMonth: function(year, month) {
      return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
    },
      headTemplate: '<thead>' +
          '<tr>' +
          '<th class="prev">&lsaquo;</th>' +
          '<th colspan="5" class="switch" ></th>' +
          '<th class="next">&rsaquo;</th>' +
          '</tr>' +
          '</thead>',
      contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
  };
  //正常日历模版
  DPGlobal.template =
      '<div class="datepicker-days">' +
      '<table class="table-condensed">' +
      DPGlobal.headTemplate +
      '<tbody></tbody>' +
      '</table>' +
      '</div>' +
      '<div class="datepicker-months">' +
      '<table class="table-condensed">' +
      DPGlobal.headTemplate +
      DPGlobal.contTemplate +
      '</table>' +
      '</div>' +
      '<div class="datepicker-years">' +
      '<table class="table-condensed">' +
      DPGlobal.headTemplate +
      DPGlobal.contTemplate +
      '</table>' +
      '</div>';
  DPGlobal.timeModelate = 
      '<div class="menuSel hhMenu" >'+
          '<span class="menuSapn">0</span><span class="menuSapn">1</span><span class="menuSapn">2</span><span class="menuSapn">3</span>'+
          '<span class="menuSapn">4</span><span class="menuSapn">5</span><span class="menuSapn">6</span>'+
          '<span class="menuSapn">7</span><span class="menuSapn">8</span><span class="menuSapn">9</span>'+
          '<span class="menuSapn">10</span><span class="menuSapn">11</span><span class="menuSapn">12</span>'+
          '<span class="menuSapn">13</span><span class="menuSapn">14</span><span class="menuSapn">15</span>'+
          '<span class="menuSapn">16</span><span class="menuSapn">17</span><span class="menuSapn">18</span>'+
          '<span class="menuSapn">19</span><span class="menuSapn">20</span><span class="menuSapn">21</span>'+
          '<span class="menuSapn">22</span><span class="menuSapn">23</span>'+
      '</div>'+
      '<div class="menuSel mmMenu" >'+
          '<span class="menuSapn">0</span><span class="menuSapn">5</span><span class="menuSapn">10</span>'+
          '<span class="menuSapn">15</span><span class="menuSapn">20</span><span class="menuSapn">25</span>'+
          '<span class="menuSapn">30</span><span class="menuSapn">35</span><span class="menuSapn">40</span>'+
          '<span class="menuSapn">45</span><span class="menuSapn">50</span><span class="menuSapn">55</span>'+
      '</div>'+
      '<div class="menuSel ssMenu" >'+
          '<span class="menuSapn">0</span><span class="menuSapn">10</span><span class="menuSapn">20</span>'+
          '<span class="menuSapn">30</span><span class="menuSapn">40</span><span class="menuSapn">50</span>'+
      '</div>';
  DPGlobal.timeiInputMode = 
      '<div class="dpconter">'+
      '<font class="bold m-r-sm">时间</font>' +
      '</div>'+
      '<div class="dpconter b">'+
      '<input class="tb" maxlength="2"/>' +
      '<b class="tm">:</b>' +
      '<input class="te" maxlength="2"/>' +
      '<b class="tm">:</b>' +
      '<input class="tl" maxlength="2"/>' +
      '</div>';
      //预留添加小时钟
      // '<div class="dpconter">'+
      // '<a class="accordion-toggle" >' +
      // '<i class="' + icon + '"></i>' +
      // '</a>' +
      // '</div>'+
  //日历模版
  DPGlobal.tempButton = function(icon,isShow) {
    if(icon == null){
        return ('<div class="datepicker-days">' +
            '<table class="table-condensed">' +
            DPGlobal.headTemplate +
            '<tbody></tbody>' +
            '</table>' +
            (!isShow?
            		'<div class="fr">' +
                    '<button class="clear">清空</button>' +
                    '<button class="today" style="margin-left: 5px;">今天</button>' +
                    '<button class="confirm" style="margin-left: 5px;">确定</button></div>' : '')+
            
            '</div>' +
            '<div class="datepicker-months">' +
            '<table class="table-condensed">' +
            DPGlobal.headTemplate +
            DPGlobal.contTemplate +
            '</table>' +
            '</div>' +
            '<div class="datepicker-years">' +
            '<table class="table-condensed">' +
            DPGlobal.headTemplate +
            DPGlobal.contTemplate +
            '</table>' +
        '</div>');
    }
    return ('<div class="datepicker-days">' +
        '<table class="table-condensed">' +
        DPGlobal.headTemplate +
        '<tbody></tbody>' +
        '</table>' +
        '<div class="divconter" id="dpTime">' +
        DPGlobal.timeModelate+
        DPGlobal.timeiInputMode+
        '</div>' +
        (!isShow?
        		'<div class="fr">' +
                '<button class="clear">清空</button>' +
                '<button class="today" style="margin-left: 5px;">今天</button>' +
                '<button class="confirm" style="margin-left: 5px;">确定</button></div>' : '')+
        '</div>' +
        '<div class="datepicker-months">' +
        '<table class="table-condensed">' +
        DPGlobal.headTemplate +
        DPGlobal.contTemplate +
        '</table>' +
        '</div>' +
        '<div class="datepicker-years">' +
        '<table class="table-condensed">' +
        DPGlobal.headTemplate +
        DPGlobal.contTemplate +
        '</table>' +
    '</div>');
    
  }

  var TPGlobal = {
    hourTemplate: '<span data-action="showHours" data-time-component="hours" class="timepicker-hour"><input type="text" maxlength="2" data-action="selectHour" style="text-align:center; vertical-align:middle"/></span>',
    minuteTemplate: '<span data-action="showMinutes" data-time-component="minutes" class="timepicker-minute"><input type="text" maxlength="2" data-action="selectMinute" style="text-align:center; vertical-align:middle"/></span>',
    secondTemplate: '<span data-action="showSeconds" data-time-component="seconds" class="timepicker-second"><input type="text" maxlength="2" data-action="selectSecond" style="text-align:center; vertical-align:middle"/></span>'
  };
  //时间模版
  TPGlobal.getTemplate = function(is12Hours, showSeconds) {
    return (
      '<div class="timepicker-picker">' +
      '<table class="table-condensed"' +
      (is12Hours ? ' data-hour-format="12"' : '') +
      '>' +
      '<tr>' +
      '<td><a href="#" class="btn" data-action="incrementHours"><i class="fa fa-chevron-up"></i></a></td>' +
      '<td class="separator"></td>' +
      '<td><a href="#" class="btn" data-action="incrementMinutes"><i class="fa fa-chevron-up"></i></a></td>' +
      (showSeconds ?
        '<td class="separator"></td>' +
        '<td><a href="#" class="btn" data-action="incrementSeconds"><i class="fa fa-chevron-up"></i></a></td>' : '') +
      (is12Hours ? '<td class="separator"></td>' : '') +
      '</tr>' +
      '<tr>' +
      '<td>' + TPGlobal.hourTemplate + '</td> ' +
      '<td class="separator">:</td>' +
      '<td>' + TPGlobal.minuteTemplate + '</td> ' +
      (showSeconds ?
        '<td class="separator">:</td>' +
        '<td>' + TPGlobal.secondTemplate + '</td>' : '') +
      (is12Hours ?
        '<td class="separator"></td>' +
        '<td>' +
        '<button type="button" class="btn btn-primary" data-action="togglePeriod"></button>' +
        '</td>' : '') +
      '</tr>' +
      '<tr>' +
      '<td><a href="#" class="btn" data-action="decrementHours"><i class="fa fa-chevron-down"></i></a></td>' +
      '<td class="separator"></td>' +
      '<td><a href="#" class="btn" data-action="decrementMinutes"><i class="fa fa-chevron-down"></i></a></td>' +
      (showSeconds ?
        '<td class="separator"></td>' +
        '<td><a href="#" class="btn" data-action="decrementSeconds"><i class="fa fa-chevron-down"></i></a></td>' : '') +
      (is12Hours ? '<td class="separator"></td>' : '') +
      '</tr>' +
      '</table>' +
      '<div class="fr m-t-xs">' +
		      '<button data-action="clearTime">清空</button>' +
		      '<button data-action="sureTime" style="margin-left:10px;">确定</button>' +
		'</div>' +
      '</div>' //+
      // '<div class="timepicker-hours" >' +
      // '<table class="table-condensed">' +
      // '</table>' +
      // '</div>' +
      // '<div class="timepicker-minutes" >' +
      // '<table class="table-condensed">' +
      // '</table>' +
      // '</div>' +
      // (showSeconds ?
      //   '<div class="timepicker-seconds" >' +
      //   '<table class="table-condensed">' +
      //   '</table>' +
      //   '</div>' : '')
    );
  }
})(window.jQuery);
