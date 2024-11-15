import express from "express";

import { 
  getHeroes, 
  getFilterLists, 
  getPostItems, 
  saveMarketItem, 
  getMarketItem, 
  saveRaceItem,
  getRaceItem,
  saveBuyItem,
  getTransaction, 
  upgradeTransaction,
  getRaceTransaction,
  getRaceTransactionList,
  upgradeRaceTransactionList,
  upgradeRaceTransaction,
 } from "../controllers/dota2Controller";

const router = express.Router();

router.get("/heroes", getHeroes);

router.get("/itemFilterList", getFilterLists)

router.get("/postItems", getPostItems); // get My items from Steam API with my steamID

router.post("/marketItem", saveMarketItem);

router.get("/getMarketItem", getMarketItem);

router.post("/raceItem", saveRaceItem);

router.get("/getRaceItem", getRaceItem);

router.post("/upgradeRaceTransactionList", upgradeRaceTransactionList);

router.post("/buyItem", saveBuyItem); 

router.get("/transactionDB", getTransaction);

router.post("/upgradeTransactionDB", upgradeTransaction);

router.get("/raceTransactionDB", getRaceTransaction);

router.post("/raceTransactionList", getRaceTransactionList);

router.post("/upgradeRaceTransactionDB", upgradeRaceTransaction);

export default router;
