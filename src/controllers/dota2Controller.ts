import { Request, Response, NextFunction } from "express";
import { Item } from "../models/dota2CosmeticItem";
import { MarketItems } from "../models/MarketItem";
import { Transaction } from "../models/Transaction";
import { RaceItems } from "../models/RaceItem";
import { RaceTransaction } from "../models/RaceTransaction";
import axios from "axios";
import cron from 'node-cron';
interface Hero {
    id: number;
    name: string;
    type: string;
    img: string;
}

interface filterList {
  rarity: string[];
  quality: string[];
  type: string[];
  hero: string[];
}

async function getHeroListFromAPI(): Promise<Hero[]> {
    const heroDataJson = await fetch('https://raw.githubusercontent.com/joshuaduffy/dota2api/master/dota2api/ref/heroes.json')
    let heroJson = await heroDataJson.json();
    let heroData = heroJson.heroes;
    const BASE_URL = 'https://api.opendota.com/api/heroes';
    try {
        const response = await axios.get(BASE_URL);
        const heroes = response.data;

        return heroes.map((hero: any) => ({
            id: hero.id,
            name: hero.localized_name,
            type: hero.primary_attr,
            img1: heroData.filter((item:any) => item.id == hero.id)[0]?.url_vertical_portrait,
            img2: `https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.localized_name.toLowerCase().replace(/\s/g, '_').replace(/-/g, '')}.png`,
        }));
    } catch (error) {   
        console.error('Error fetching heroes:', error);
        throw error;
    }
}

export const getHeroes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const heroList = await getHeroListFromAPI();
  res.status(200).json({ success: true, data: heroList });
};

async function getFilterList(): Promise<filterList> {
    let rarity: string[] = [];
    let quality: string[] = [];
    let type: string[] = [];
    let hero: string[] = [];
    try {
        const items = await Item.find({});
        items.forEach(item => {
            if (!rarity.includes(item.rarity)) {
                rarity.push(item.rarity);
            }
            if (!quality.includes(item.quality)) {
                quality.push(item.quality);
            }
            if (!type.includes(item.type)) {
                type.push(item.type);
            }
            if (!hero.includes(item.hero)) {
                hero.push(item.hero);
            }
        });
        return { rarity, quality, type, hero };
    } catch (error) {
        console.error('Error fetching heroes:', error);
        throw error;
    }
}

export const getFilterLists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const filterList = await getFilterList();
  res.status(200).json({ success: true, data: filterList });
}

const fetchSteamItemData = async (steamID: any) => {
    const steamTID = "76561199774219137"
    const url = `http://steamcommunity.com/inventory/${steamTID}/570/2?l=english`;
  
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data) {
          const id = data.assets.map((item: any) => ({
            id: item.appid + '_' + item.contextid + '_' + item.assetid + '_' + item.classid + '_' + item.instanceid + '_' + item.amount + '_',
          })); 
          const items = data.descriptions.map((item: any, index: number) => ({
            id: id[index].id,
            itemName: item.name,
            iconUrl: item.icon_url,
            quality: item.tags.filter((item: any) => item.category === 'Quality').length > 0 ? item.tags.filter((item: any) => item.category === 'Quality')[0].localized_tag_name : undefined,
            rarity: item.tags.filter((item: any) => item.category === 'Rarity').length > 0 ? item.tags.filter((item: any) => item.category === 'Rarity')[0].localized_tag_name : undefined,
            type: item.tags.filter((item: any) => item.category === 'Type').length > 0 ? item.tags.filter((item: any) => item.category === 'Type')[0].localized_tag_name : undefined,
            slot: item.tags.filter((item: any) => item.category === 'Slot').length > 0 ? item.tags.filter((item: any) => item.category === 'Slot')[0].localized_tag_name : undefined,
            hero: item.tags.filter((item: any) => item.category === 'Hero').length > 0 ? item.tags.filter((item: any) => item.category === 'Hero')[0].localized_tag_name : undefined,
          }))
          console.log(items);
          return items;
        } else {
            console.log('No player found with this Steam ID');
            return null;
        }
    } catch (error) {
        console.error('Error fetching Steam user data:', error);
    }
  }
  
export const dota2ItemSave = async (steamID: any) => {
  const itemData = await fetchSteamItemData(steamID);
  if(itemData){
    itemData.forEach(async (item: any) => {
      const existingItem = await Item.findOne({ id: item.id });
      if (!existingItem) {
        await Item.create({
          id: item.id,
          itemName: item.itemName,
          iconUrl: item.iconUrl,
          quality: item.quality,
          rarity: item.rarity,
          type: item.type,
          slot: item.slot,
          hero: item.hero,
        });
      } else {
        console.log("Item already exists");
      }
    })
  }
  return itemData;
}

export const getPostItems = async (req: Request, res: Response, next: NextFunction) => {
  // const items = await dota2ItemSave(req.query.steamID);
  const items = await Item.find({});
  res.status(200).json({ success: true, data: items });
}

export const saveMarketItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const marketItem = await MarketItems.find({ item_id: req.body.item_id });
  if( marketItem.length == 0 ){
    try {
      const marketItem = await MarketItems.create({
        item_id: req.body.item_id,
        seller: req.body.seller,
        item: req.body.item,
        price: req.body.price,
      });
      res.status(201).json({ success: true, data: marketItem });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message, details: error.errors });
    }
  }
};

export const getMarketItem = async (req: Request, res: Response, next: NextFunction) => {
  const items = await MarketItems.find({});
  res.status(200).json({ success: true, data: items });
}

export const saveRaceItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const raceItems = await RaceItems.find({ item_id: req.body.item_id });
    if (raceItems.length === 0) {
      const raceItem = await RaceItems.create({
        item_id: req.body.item_id,
        seller: req.body.seller,
        item: req.body.item,
        price: req.body.price,
        status: req.body.status,
        startDate: new Date(),
      });
      res.status(201).json({ success: true, data: raceItem });
      
      // Schedule the task to stop the race after 5 minutes
      const stopRace = cron.schedule('*/5 * * * *', async () => {
          await RaceItems.deleteOne({ item_id: req.body.item_id });
          const endRaceStatus = await RaceTransaction.findOne({item_id: req.body.item_id})
          if(endRaceStatus){
            endRaceStatus.status = 1;
            endRaceStatus.save();
          }
        stopRace.stop(); // Stop the cron job after execution
      });
    } else {
      res.status(400).json({ success: false, message: 'Race item already exists.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, details: error.errors });
  }
};

export const getRaceItem = async (req: Request, res: Response, next: NextFunction) => {
  const items = await RaceItems.find({});
  res.status(200).json({ success: true, data: items });
}

export const upgradeRaceTransactionList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existingRaceItem = await RaceTransaction.findOne({ item_id: req.body.item_id });
    if (!existingRaceItem) {
      await RaceTransaction.create({
        item_id: req.body.item_id,
        seller: req.body.seller,
        buyer: [{
          buyer: req.body.buyer[0].buyer,
          bidPrice: req.body.buyer[0].bidPrice,
          date: new Date(),
          tradeLink:req.body.buyer[0].tradeLink
        }],
        item: req.body.item,
        price: req.body.price,
        status: req.body.status,
      })
      res.status(200).json({ success: true, message: "RaceTransactionList updated successfully", data: existingRaceItem });
    }else {
      const buyerToUpdate = req.body.buyer[0];
      existingRaceItem.buyer.push({
        buyer: buyerToUpdate.buyer,
        bidPrice: buyerToUpdate.bidPrice,
        date: new Date(),
        tradeLink: buyerToUpdate.tradeLink,
      });
      await existingRaceItem.save();
      res.status(200).json({ success: true, message: "RaceTransactionList updated successfully", data: existingRaceItem });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error", upgrade: false });
  }
};

export const saveBuyItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await MarketItems.deleteOne({ item_id: req.body.item_id });
    if (!result) {
      res.status(404).send('Item not found');
    }
    const data = await RaceItems.find({item_id: req.body.item_id});
    if (data.length === 0) {
      await Transaction.create({
        item_id: req.body.item_id,
        seller: req.body.seller,
        buyer: req.body.buyer,
        item: {
          itemName: req.body.item.itemName,
          iconUrl: req.body.item.iconUrl,
          quality: req.body.item.quality,
          rarity: req.body.item.rarity,
          type: req.body.item.type,
          slot: req.body.item.slot,
          hero: req.body.item.hero
        },
        price: req.body.price,
        tradeLink: req.body.tradeLink,
        status: req.body.status,
      });
    }
    res.status(201).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransaction = async (req: Request, res: Response, next: NextFunction) => {
  const items = await Transaction.find({
    $or: [
        { seller: req.query.userID },
        { buyer: req.query.userID }
    ]
  });
  res.status(200).json({ success: true, data: items });
}

export const upgradeTransaction = async (req: Request, res: Response, next: NextFunction) => {
  if(req.body){
    try {
      const existingTransaction = await Transaction.findOne({ item_id: req.body.item_id });
      if (existingTransaction) {
        existingTransaction.status = req.body.status;
        await existingTransaction.save();
        res.status(201).json({ success: true, upgrade: true });
      }else {
        res.status(404).json({ success: false, message: "Transaction not found", upgrade: false });
      }
    } catch (error) {
      res.status(400).json({ success: false, message: error.message, details: error.errors });
    }
  }
}

export const getRaceTransaction = async (req: Request, res: Response, next: NextFunction) => {
  const items = await RaceTransaction.find({
    $or: [
        { seller: req.query.userID },
        { 'buyer.buyer': req.query.userID }
    ]
  });
  res.status(200).json({ success: true, data: items });
}

export const getRaceTransactionList = async (req: Request, res: Response, next: NextFunction) => {
  const items = await RaceTransaction.findOne({item_id: req.body.item_id});
  res.status(200).json({ success: true, data: items });
}

export const upgradeRaceTransaction = async (req: Request, res: Response, next: NextFunction) => {
  if(req.body){
    try {
      const existingTransaction = await RaceTransaction.findOne({ item_id: req.body.item_id });
      if (existingTransaction) {
        existingTransaction.status = req.body.status;
        await existingTransaction.save();
        res.status(201).json({ success: true, upgrade: true });
      }else {
        res.status(404).json({ success: false, message: "Transaction not found", upgrade: false });
      }
    } catch (error) {
      res.status(400).json({ success: false, message: error.message, details: error.errors });
    }
  }else {
    res.status(404).json({ success: false, message: "Transaction not found", upgrade: false });
  }
}