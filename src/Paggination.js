import React, { useEffect, useState } from "react";
import { Router } from "react-router-dom";
import "./style.css";
import {Switch, Route, Link} from "react-router-dom";

const renderData = (data) => {
  return (
    <ul>
      <table>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Age</th>
        <th>Email</th>
        <th>Website</th>
        {data.map((todo, index) => {
          return (

            <tr>
              <td>{todo.first_name}</td>
              <td>{todo.last_name}</td>
              <td>{todo.age}</td>
              <td>{todo.email}</td>
              <td>{todo.web}</td>  
            </tr>

          )
        })}
      </table>
    </ul>
  );
};


function PaginationComponent() {


  const [data, setData] = useState([]);
  const [searchApiData, setSearchApiData] = useState([]);
  const [filterVal, setFilterVal] = useState('');
  // const [data, setData] = useState([]);

  const [currentPage, setcurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(10);

  const [pageNumberLimit, setpageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  // filter

  const handleFilter=(e)=> {
    if(e.target.value === '')  {
      setData(searchApiData)
    }
    else { 
      const filterResult = searchApiData.filter(item => 
        item.first_name.toLowerCase().includes(e.target.value.toLowerCase()) || 
        item.last_name.toLowerCase().includes(e.target.value.toLowerCase()))
      
   
    if(filterResult.length > 0) {
      setData(filterResult)
    }
    else {  
      setData ([{"first_name": "No Data"}])
    }
  }
    setFilterVal(e.target.value)
  }




  const handleClick = (event) => {
    setcurrentPage(Number(event.target.id));
  };
  //end filter
  const pages = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li
          key={number}
          id={number}
          onClick={handleClick}
          className={currentPage == number ? "active" : null}
        >
          {number}
        </li>
      );
    } else {
      return null;
    }
  });



  useEffect(()=> {
    const fetchData = () => {
      fetch('https://datapeace-storage.s3-us-west-2.amazonaws.com/dummy_data/users.json')
      .then(response => response.json())
      .then(json => {
        setData(json)
        setSearchApiData(json)
      })
    }
    fetchData();
  }, [])


  const handleNextbtn = () => {
    setcurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevbtn = () => {
    setcurrentPage(currentPage - 1);

    if ((currentPage - 1) % pageNumberLimit == 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  let pageIncrementBtn = null;
  if (pages.length > maxPageNumberLimit) {
    pageIncrementBtn = <li onClick={handleNextbtn}> &hellip; </li>;
  }

  let pageDecrementBtn = null;
  if (minPageNumberLimit >= 1) {
    pageDecrementBtn = <li onClick={handlePrevbtn}> &hellip; </li>;
  }

  const handleLoadMore = () => {
    setitemsPerPage(itemsPerPage + 5);
  };


  //-------------------------
  const sortTypes = {
    up: {
      class: 'sort-up',
      fn: (a, b) => a.net_worth - b.net_worth
    },
    down: {
      class: 'sort-down',
      fn: (a, b) => b.net_worth - a.net_worth
    },
    default: {
      class: 'sort',
      fn: (a, b) => a
    }
  }

  return (
    <>
      
      <div >
      <h1 className="head">Users</h1>
      <input className="p-input-icon-right" type = 'search' placeholder = 'Search by first or last name' value= {filterVal} onInput={(e) => handleFilter(e)} />        
      <button onClick = "handleFilter">🔍</button>
      </div>
      {renderData(currentItems)}
      <ul className="pageNumbers">
        <li>
          <button
            onClick={handlePrevbtn}
            disabled={currentPage == pages[0] ? true : false}> ⬅️ </button>
        </li>
        {pageDecrementBtn}
        {renderPageNumbers}
        {pageIncrementBtn}

        <li>
          <button
            onClick={handleNextbtn}
            disabled={currentPage == pages[pages.length - 1] ? true : false}>➡️</button>
        </li>
      </ul>
      <button onClick={handleLoadMore} className="loadmore">Load More</button>
    </>
  );
}

export default PaginationComponent;