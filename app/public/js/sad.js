/*
######################################### 
# SAD - SWAMP Availability Dashboard    #
#                                       #
# Author: Alexandre Heideker - UFABC    #
# 2020-06-03                            #
# In context of SWAMP Project           #
#########################################
*/

String.prototype.trim = function () {
  return this.replace(/^\s+|\s+$/g, "");
};
Number.prototype.toFixedDown = function (digits) {
  var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
    m = this.toString().match(re);
  return m ? parseFloat(m[1]) : this.valueOf();
};

function toISO(s) {
  var d = new Date(s);
  return d.toISOString();
}

function secondsBetween(d1, d2) {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return Math.ceil(Math.abs(date2 - date1) / 1000);
}
function hoursBetween(d1, d2) {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60));
}
function daysBetween(d1, d2) {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
}

function monthsBetween(d1, d2) {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  var months;
  months = (date2.getFullYear() - date1.getFullYear()) * 12;
  months -= date1.getMonth() + 1;
  months += date2.getMonth();
  return months <= 0 ? 0 : months;
}

function QueryCrate(hostURL, sql) {
  var req = new XMLHttpRequest();
  var url = hostURL + ":4200/_sql";
  req.open("POST", url, false);
  req.setRequestHeader("Content-Type", " application/json");
  req.send('{"stmt":"' + sql + '"}');
  if (req.status == 200) {
    return req.responseText;
  }
  return "";
}

function getSADfromEntity(hostURL, EntityId, FromDate, ToDate) {
  hostURL = "http://" + hostURL;

  var jsonOut = "";
  if ((json = JSON.parse(QueryCrate(hostURL, "show tables from mtopeniot")))) {
    if (json.rows.length > 0) {
      //tables array
      var tables = json.rows;
      var filter = " entity_id = '" + EntityId + "' ";
      var tb =
        "select tb, entity_id, entity_type, firstData, lastData, qtd from (";
      for (var i = 0; i < tables.length; i++) {
        if (i > 0) tb += " union all ";
        tb +=
          "select  '" +
          tables[i][0] +
          "' as tb, entity_id, entity_type, min(time_index) as firstData, max(time_index) as lastData, count(time_index) as qtd from mtopeniot." +
          tables[i][0] +
          " where " +
          filter +
          " and time_index between '" +
          FromDate +
          "' and '" +
          ToDate +
          "' group by entity_id, entity_type";
      }
      tb += ") as t order by entity_type, entity_id";
      if ((json = JSON.parse(QueryCrate(hostURL, tb)))) {
        var sql1 =
          "select count(*) as qtd from (select extract(year from time_index) as ya, extract(month from time_index) as mt, extract(day from time_index) as dy, extract(hour from time_index) as hr from (";
        var sql2 = "select d from (";
        for (var j = 0; j < tables.length; j++) {
          if (j > 0) {
            sql1 += " union all ";
            sql2 += " union all ";
          }
          sql1 +=
            "select entity_id, time_index from mtopeniot." +
            tables[j][0] +
            " where " +
            filter +
            " and time_index between '" +
            FromDate +
            "' and '" +
            ToDate +
            "'";
          sql2 +=
            "select entity_id, date_trunc('minute', 'UCT', time_index) as d from mtopeniot." +
            tables[j][0] +
            " where  " +
            filter +
            " and time_index between '" +
            FromDate +
            "' and '" +
            ToDate +
            "' group by entity_id, d ";
        }
        for (var i = 0; i < json.rows.length; i++) {
          cntMonths = monthsBetween(json.rows[i][3], ToDate) + 1;
          cntDays = daysBetween(json.rows[i][3], ToDate) + 1;
          cntHours = hoursBetween(json.rows[i][3], ToDate) + 1;
          cntALL = secondsBetween(json.rows[i][3], ToDate) + 1;
          //getting samples from each entity
          var sqlf =
            sql1 +
            ") as t1 where t1.entity_id = '" +
            json.rows[i][1] +
            "' ) as t group by ya, mt, dy, hr";
          var js = JSON.parse(QueryCrate(hostURL, sqlf));
          sampHourly = js.rows.length;
          Hourly = (sampHourly / cntHours) * 100;

          sqlf =
            sql1 +
            ") as t1 where t1.entity_id = '" +
            json.rows[i][1] +
            "') as t group by ya, mt, dy";
          js = JSON.parse(QueryCrate(hostURL, sqlf));
          sampDaily = js.rows.length;
          Daily = (sampDaily / cntDays) * 100;

          sqlf =
            sql1 +
            ") as t1 where t1.entity_id = '" +
            json.rows[i][1] +
            "' ) as t group by ya, mt";
          js = JSON.parse(QueryCrate(hostURL, sqlf));
          sampMonthly = js.rows.length;
          Monthly = (sampMonthly / cntMonths) * 100;

          sqlf =
            sql2 +
            ") as t where t.entity_id = '" +
            json.rows[i][1] +
            "' order by d desc";
          js = JSON.parse(QueryCrate(hostURL, sqlf));
          //figure out sampling interval
          var samples = [];
          for (var j = 1; j < js.rows.length; j++) {
            samples.push(js.rows[j - 1][0] - js.rows[j][0]);
          }
          sampALL = js.rows.length;
          ALL = 0;
          sampling = 0;
          if (samples.length > 1) {
            samples.sort();
            var groups = [];
            var counters = [];
            for (var j = 0; j < samples.length; j++) {
              var k = 0;
              for (; k < groups.length; k++) {
                if (groups[k][0] == samples[j]) {
                  groups[k][1]++;
                  break;
                }
              }
              if (k >= groups.length) {
                groups.push([samples[j], 1]);
              }
            }
            m = 0;
            for (var j = 0; j < groups.length; j++) {
              if (groups[j][1] > groups[m][1]) m = j;
            }
            sampling = groups[m][0] / 1000;
            cntALL = Math.ceil(cntALL / sampling);
            ALL = (sampALL / cntALL) * 100;
          }

          jsonOut =
            '{ "EntityType"  : "' +
            json.rows[i][2] +
            '", "FirstData"  : "' +
            toISO(json.rows[i][3]) +
            '", "LastData"  : "' +
            toISO(json.rows[i][4]) +
            '", "Monthly"  : {"samples": "' +
            sampMonthly +
            '", "required": "' +
            cntMonths +
            '", "availability":"' +
            Monthly.toFixedDown(2) +
            '"}' +
            ', "Daily"  : {"samples": "' +
            sampDaily +
            '", "required": "' +
            cntDays +
            '", "availability":"' +
            Daily.toFixedDown(2) +
            '"}' +
            ', "Hourly"  : {"samples": "' +
            sampHourly +
            '", "required": "' +
            cntHours +
            '", "availability":"' +
            Hourly.toFixedDown(2) +
            '"}' +
            ', "Standart"  : {"samples": "' +
            sampALL +
            '", "required": "' +
            cntALL +
            '", "availability":"' +
            ALL.toFixedDown(2) +
            '"}' +
            ', "StandartSampling"  : "' +
            sampling.toFixed(1) +
            '" }';
        }
      }
    }
  }

  console.log(jsonOut == "" ? false : JSON.parse(jsonOut));
  return jsonOut == "" ? false : JSON.parse(jsonOut);
}
