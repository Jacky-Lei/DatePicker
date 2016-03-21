var React = require('react');
var ReactDOM = require('react-dom');

var DateHelpers = {
  makeNewDate: function(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  },
  moveToSundayOfWeek: function(date) {
    while (date.getDay() !== 0)
        {date.setDate(date.getDate()-1);}
    return date;
  },
  formatDate: function (dateObj) {
    var currentDate = dateObj.getDate().toString();
    if (currentDate.length === 1) {currentDate = "0" + currentDate;}
    var currentMonth = (dateObj.getMonth() + 1).toString();
    if (currentMonth.length === 1) {currentMonth = "0" + currentMonth;}
    var currentYear = dateObj.getFullYear().toString();
    return (currentMonth + "/" + currentDate + "/" + currentYear);
  }
};

var DatePicker = React.createClass({
  getInitialState: function () {
    var today = new Date();
    return {currentDateObj: today};
  },
  handleChange: function (day)  {
    this.setState({currentDateObj: day});
  },
  handleSearchChange: function (dateObject) {
    this.setState({currentDateObj: dateObject});
  },
  render: function () {
    var datePickerComponent = this;
    var dateNextYearObj = new Date();
    return(
      <div>
        <SearchBar
          currentDateObj={this.state.currentDateObj}
          handleSearchChange={this.handleSearchChange}
        />
        <Calendar
          currentDateObj={this.state.currentDateObj}
          handleChange={this.handleChange}
          datePickerComponent={datePickerComponent}
        />
      </div>
    );
  }
});

var SearchBar = React.createClass({
  getInitialState: function () {
    var formattedCurrentDate = DateHelpers.formatDate(this.props.currentDateObj);
    return {currentDateObj: formattedCurrentDate};
  },
  componentWillReceiveProps: function (nextProps) {
    var formattedCurrentDate = DateHelpers.formatDate(nextProps.currentDateObj);
    this.setState({currentDateObj: formattedCurrentDate});
  },
  handleChange: function (e) {
    var inputString = e.target.value.toString();
    var inputRegex = /^\d{2}[/]\d{2}[/]\d{4}$/;
    if (inputRegex.test(inputString)) {
      var year = e.target.value[6]+e.target.value[7]+e.target.value[8]+e.target.value[9];
      var monthIndex = e.target.value[0]+e.target.value[1];
      var month = (parseInt(monthIndex) - 1).toString();
      if (month.length === 1) {month = "0"+month;}
      var day = e.target.value[3]+e.target.value[4];
      var currentDateObj = new Date(year, month, day);
      this.props.handleSearchChange(currentDateObj);
      this.setState({currentDateObj:inputString });
    } else {
      this.setState({currentDateObj:inputString});
    }
  },
  render: function () {
    return (
      <div>
        <input
          type="text"
          onChange={this.handleChange}
          value={this.state.currentDateObj}/>
        &nbsp;&nbsp;Please insert dates in mm&nbsp;&frasl;&nbsp;dd&nbsp;&frasl;&nbsp;yyyy format
      </div>
    );
  }
});

var Calendar = React.createClass({
  getInitialState: function () {
    return ({currentDateObj: this.props.currentDateObj,
      selectedMonth: this.props.currentDateObj.getMonth(),
      selectedDate: this.props.currentDateObj.getDate()});
  },
  componentWillReceiveProps: function (nextProps) {
    this.setState({currentDateObj: nextProps.currentDateObj,
      selectedMonth: nextProps.currentDateObj.getMonth(),
      selectedDate: nextProps.currentDateObj.getDate()});
  },
  moveBack: function () {
    var previousMonth = this.state.currentDateObj.getMonth() - 1;
    var previousMonthObj = new Date((this.state.currentDateObj).setMonth(previousMonth));
    this.setState({currentDateObj: previousMonthObj});
  },
  moveForward: function () {
    var nextMonth = this.state.currentDateObj.getMonth() + 1;
    var nextMonthObj = new Date((this.state.currentDateObj).setMonth(nextMonth));
    this.setState({currentDateObj: nextMonthObj});
  },
  render: function () {
    var currentDateObj = this.state.currentDateObj;
    return (
      <div>
        <MonthHeader
          currentDateObj={currentDateObj}
          moveForward={this.moveForward}
          moveBack={this.moveBack}
        />
        <Weeks
          currentDateObj={currentDateObj}
          selectedMonth={this.state.selectedMonth}
          selectedDate={this.state.selectedDate}
          handleChange={this.props.handleChange}
          datePickerComponent={this.props.datePickerComponent}
        />
      </div>
    );
  }
});

var MonthHeader = React.createClass({
  render: function () {
    var currentDateObj = new Date(this.props.currentDateObj);
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
      var currentMonth = monthNames[currentDateObj.getMonth()];
      var currentYear = currentDateObj.getFullYear();
    return (
      <div className="month-header">
        <span className="move-left" onClick={this.props.moveBack}>&lt; </span>
        <span>{currentMonth} </span>
        <span>{currentYear} </span>
        <span className="move-right"onClick={this.props.moveForward}>&gt; </span>
      </div>
    );
  }
});

var Weeks = React.createClass({
  getWeekStartDates: function(currentDateObj) {
    // First day of the month
    currentDateObj.setDate(1);
    lastMonthSundayObj = DateHelpers.moveToSundayOfWeek(DateHelpers.makeNewDate(currentDateObj));
    var currentSundayObj = DateHelpers.makeNewDate(lastMonthSundayObj);
    currentSundayObj.setDate(currentSundayObj.getDate()+7);
    var starts = [lastMonthSundayObj],
    month = currentSundayObj.getMonth();
    while (currentSundayObj.getMonth() === month) {
      starts.push(DateHelpers.makeNewDate(currentSundayObj));
      currentSundayObj.setDate(currentSundayObj.getDate()+7);
    }
  return starts;
  },
	render: function() {
    var that = this;
    var starts = this.getWeekStartDates(this.props.currentDateObj),
        month = starts[1].getMonth();
    var renderWeeks = starts.map (function (start, index) {
      return (
        <WeekRow
          key={index}
          start={start}
          currentDateObj = {that.props.currentDateObj}
          selectedDate = {that.props.selectedDate}
          selectedMonth = {that.props.selectedMonth}
          handleChange={that.props.handleChange}
          datePickerComponent={that.props.datePickerComponent}
        />
      );
    });
		return (
        <div>
          <table>
            <thead>
              <tr>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
              </tr>
            </thead>
            <tbody>
              {renderWeeks}
            </tbody>
          </table>
        </div>
    );
	}
});
var WeekRow = React.createClass({
  buildDays: function(start) {
    var days = [DateHelpers.makeNewDate(start)],
        makeNewDate = DateHelpers.makeNewDate(start);
    for (var i = 1; i <= 6; i++) {
        makeNewDate = DateHelpers.makeNewDate(makeNewDate);
        makeNewDate.setDate(makeNewDate.getDate()+1);
        days.push(makeNewDate);
    }
    return days;
  },
  handleClick: function (day, e) {
    $(".selected").removeClass("selected");
    this.props.handleChange(day);
  },
  render: function () {
    var that = this;
    var start = this.props.start;
    var days = this.buildDays(this.props.start);
    var selectedClass = "";
    var renderDays = days.map(function (day, index) {
      if (that.props.selectedDate === day.getDate() && that.props.selectedMonth === day.getMonth()) {
        selectedClass = "selected";
      } else {
        selectedClass = "";
      }
      return (
        <td
          key={index}
          className={selectedClass}
          onClick={that.handleClick.bind(that, day)}>
          {day.getDate()}
        </td>);
    });
    return (
      <tr>
        {renderDays}
      </tr>
    );
  }
});

document.addEventListener("DOMContentLoaded", function () {
  ReactDOM.render(<DatePicker />, document.getElementById('main'));
});
