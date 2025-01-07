import './App.css';
import { useState, useEffect } from "react";

function App() {
  const [name,setName] = useState('');
  const [datetime,setDatetime] = useState('');
  const [description,setDescription] = useState('');
  const [transactions,setTransactions] = useState([]);
  useEffect(() => {
    getTransactions().then(setTransactions);
  },[]);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL+'/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(e){
    e.preventDefault();
    const url = process.env.REACT_APP_API_URL+'/transaction';
    const price = name.split(' ')[0];
    fetch(url, {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({
        price,
        name:name.substring(price.length+1),
        description,
        datetime
      })
  }).then(response => {
      response.json().then(json => {
        setName('');
        setDatetime('');
        setDescription('');
        console.log('result',json);
      });
  });
  }
  let balance = 0;
  for (const transaction of transactions){ 
    balance += parseFloat(transaction.price);
  }

  balance = balance.toFixed(2);
  const fraction = balance.toString().split('.')[1];
  balance = balance.toString().split('.')[0];

  return (
    <main>
      <h1>${balance}<span></span></h1> 
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input type="text" value = {name} 
          onChange={(e) => setName(e.target.value)}
          placeholder={'+200 new Samsung TV'} />
          <input value = {datetime}
          onChange={(e) => setDatetime(e.target.value)}
          type="datetime-local" />
        </div>
        <div className="description">
          <input type="text" 
          value = {description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={'description'} />
       </div>
       <button type="submit">Add new transaction</button>
      </form>
            <div className="transactions">
        {transactions.length > 0 && transactions.map((transaction) => (
          <div key={transaction._id}>  {/* Add a unique key */}
            <div className="transaction"> 
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>
                  {transaction.price}
                </div>
                <div className="datetime">{transaction.datetime}</div>
              </div>
            </div>
          </div>
        ))}
 
      </div>
    </main>
  );
}

export default App;