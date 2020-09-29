import "dotenv/config";
import cors from "cors";
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
      wallet.transactions = transactions;
      return res.send(wallet);
    }
    return null;
  });
  return null;
});

app.get("/company/:comapnyId", (req, res) => {
  const companyId = req.params.comapnyId;
  companies.map((company) => {
    if (companyId === company.id) {
      return res.send(company);
    }
    return null;
  });
  return null;
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
