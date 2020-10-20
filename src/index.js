import "dotenv/config";
import cors from "cors";
import fs from "fs";
import express from "express";
import { users } from "./data/users.json";
import { wallets } from "./data/wallets.json";
import { companies } from "./data/companies.json";
import { transactions } from "./data/transactions.json";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  next();
  console.log('incoming!')
});

app.post("/users/search", (req, res) => {
  return res.send(Object.values(users));
});

app.get("/user/:username", (req, res) => {
  const username = req.params.username;
  users.map((user) => {
    if (username === user.username) {
      return res.send(user);
    }
    return null;
  });
  return null;
});

app.get("/wallet/:walletId", (req, res) => {
  const walletId = req.params.walletId;
  wallets.map((wallet) => {
    if (walletId === wallet.id) {
      wallet.transactions = transactions.filter(transaction => transaction.walletId === wallet.id);
      return res.send(wallet);
    }
    return null;
  });
  return null;
});



app.get('/transactions/search/:walletId', (req, res) => {
  const walletId = req.params.walletId
  const walletTransactions = transactions.filter(transaction => transaction.walletId === walletId)
  return res.send(walletTransactions)
})


app.get("/company/:comapnyId", (req, res) => {
  const companyId = req.params.comapnyId;
  companies.map((company) => {
    if (companyId === company.id) {
      company.users = users.filter(user => user.companyId == company.id)
      return res.send(company);
    }
    return null;
  });
  return null;
});

app.post("/transfer", (req, res) => {
  console.log('/transfer')
  let updatedWallets
  try {
    let currrentWallets = wallets
    updatedWallets = currrentWallets
    const srcWalletId = req.body.fromUser.walletId
    const dstWalletId = req.body.toUser.walletId
    const transferAmount = parseInt(req.body.amount)
    let updatedSrcWallet
    let updatedDstWallet
    for (let i=0; i < currrentWallets.length; i++) {
      let wallet = currrentWallets[i]
      if (wallet.id == srcWalletId) {
        updatedSrcWallet = wallet
        updatedSrcWallet.balance = wallet.balance - transferAmount
        updatedWallets[i] = updatedSrcWallet
      }
      if (wallet.id == dstWalletId) {
        updatedDstWallet = wallet
        updatedDstWallet.balance = wallet.balance + transferAmount
        updatedWallets[i] = updatedDstWallet
      }
      fs.writeFileSync(
        '/app/src/data/wallets.json', 
        JSON.stringify(
          {"wallets": updatedWallets}
        ), function (err) {
        if (err) throw err;
        console.log('Replaced!');
      });
    } 
  } catch(err) {
    console.log(err)
  }
      
    
  return res.send({"status": "success"})
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
