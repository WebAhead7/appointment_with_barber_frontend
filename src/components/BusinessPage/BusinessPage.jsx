import React, { useEffect, useState } from "react";
import "./BusinessPage.css";
import { NavLink } from "react-router-dom";
//functions imports
import api from "../api/api";

//components imports
import Card from "../Public/Card";
import Title from "../Public/Title";
import DayBox from "../Public/DayBox";

const BusinessPage = ({ user, setUser }) => {
  let businessId = window.location.pathname.split("/")[2];
  //businesspage/:id
  //states
  const [business, setBusiness] = useState(null);
  const [selectVal, setSelectVal] = useState(null);
  const [days, setDays] = useState([]);
  const [msg, setMsg] = useState(null);
  const [day1, setDay1] = useState(0);
  const daysObj = {
    0: "Su",
    1: "Mo",
    2: "Tu",
    3: "We",
    4: "Th",
    5: "Fr",
    6: "Sa",
    7: "Su",
    8: "Mo",
    9: "Tu",
    10: "We",
    11: "Th",
    12: "Fr",
    13: "Sa",
  };

  //functions
  const favToggle = (e) => {
    if (e.target.classList.contains("empty")) {
      e.target.src = "/img/filledstar.svg";
      e.target.classList.remove("empty");
      api("favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("access_token"),
        },
        body: JSON.stringify({
          businessId: String(businessId),
        }),
      })
        .then((favorites) => {
          let userObj = JSON.parse(localStorage.getItem("userObj"));
          userObj.myFavorites = favorites.myfavorites;
          localStorage.setItem("userObj", JSON.stringify(userObj));
          setUser(userObj);
        })
        .catch((err) => console.error(err));
    } else {
      e.target.src = "/img/emptystar.svg";
      e.target.classList.add("empty");
      api("favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("access_token"),
        },
        body: JSON.stringify({
          businessId: String(businessId),
        }),
      })
        .then((favorites) => {
          let userObj = JSON.parse(localStorage.getItem("userObj"));
          userObj.myFavorites = favorites.myfavorites;
          localStorage.setItem("userObj", JSON.stringify(userObj));
          setUser(userObj);
        })
        .catch((err) => console.error(err));
    }
  };

  const changeHandler = (e) => {
    setSelectVal(e.target.value);
  };
  //useEffect
  useEffect(() => {
    api(`business/${businessId}`, {
      headers: { token: localStorage.getItem("access_token") },
    })
      .then((business) => {
        setBusiness(business);
      })
      .catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    if (selectVal != null) {
      let firstDay = new Date(`${selectVal} 1, 2021 23:15:30`);
      setDay1(firstDay.getDay());
      api(`calendar/${selectVal}_${businessId}`, {
        headers: { token: localStorage.getItem("access_token") },
      })
        .then((calendar) => {
          if (calendar.msg) {
            setMsg(calendar.msg);
          } else {
            const daynumsArr = calendar.map((day) => {
              return {
                daynum: day.daynum,
                isworking: day.isworking,
              };
            });
            daynumsArr.sort((a, b) => {
              if (a.daynum > b.daynum) return 1;
              else if (a.daynum == b.daynum) return 0;
              else return -1;
            });
            setDays(daynumsArr);
            setMsg(null);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [selectVal]);

  {
    return business == null ? (
      <img
        src="https://media2.giphy.com/media/1dH0xIDSToAtZYwf8D/giphy.gif"
        className="scissors"
      />
    ) : (
      <div className="BusinessPage">
        <Title title={business.businessObj.businessname} />
        <div>
          {user.myFavorites &&
          user.myFavorites.indexOf(String(businessId)) == -1 ? (
            <img
              className="favorite-icon empty"
              src="/img/emptystar.svg"
              alt=""
              onClick={favToggle}
            />
          ) : (
            <img
              className="favorite-icon "
              src="/img/filledstar.svg"
              alt=""
              onClick={favToggle}
            />
          )}
          <Card
            id={business.businessObj.id}
            bsCard={true}
            businessName={business.businessObj.businessname}
            ownerFirstName={business.firstname}
            ownerLastName={business.lastname}
            geolocation={business.businessObj.geolocation}
            businessAddress={business.businessObj.businessaddress}
            phone={business.phone}
            setUser={setUser}
          />
        </div>
        <select onChange={changeHandler}>
          <option vale="">--Month--</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>

        {msg ? (
          <h2 className="msg">{msg}</h2>
        ) : selectVal != null ? (
          <div className="days">
            {[0, 1, 2, 3, 4, 5, 6].map((elem) => {
              return <div className="square">{daysObj[day1 + elem]}</div>;
            })}

            {days.map((day, i) => {
              return (
                <DayBox
                  key={i}
                  businessId={businessId}
                  month={selectVal}
                  isworking={day.isworking}
                  daynum={day.daynum}
                />
              );
            })}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
};

export default BusinessPage;
