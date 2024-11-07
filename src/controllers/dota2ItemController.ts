
import { Item } from "../models/dota2CosmeticItem";

const fetchSteamItemData = async (steamID: any) => {
  const steamTID = "76561199774219137"
  const url = `http://steamcommunity.com/inventory/${steamTID}/570/2?l=english`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      if (data) {
          const items = data.descriptions.map((item: any) => ({
            itemName: item.name,
            quality: item.tags.filter((item: any) => item.category === 'Quality').length > 0 ? item.tags.filter((item: any) => item.category === 'Quality')[0].localized_tag_name : undefined,
            rarity: item.tags.filter((item: any) => item.category === 'Rarity').length > 0 ? item.tags.filter((item: any) => item.category === 'Rarity')[0].localized_tag_name : undefined,
            type: item.tags.filter((item: any) => item.category === 'Type').length > 0 ? item.tags.filter((item: any) => item.category === 'Type')[0].localized_tag_name : undefined,
            slot: item.tags.filter((item: any) => item.category === 'Slot').length > 0 ? item.tags.filter((item: any) => item.category === 'Slot')[0].localized_tag_name : undefined,
            hero: item.tags.filter((item: any) => item.category === 'Hero').length > 0 ? item.tags.filter((item: any) => item.category === 'Hero')[0].localized_tag_name : undefined,
          }))
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
    console.log(itemData)
    if(itemData){
      itemData.forEach(async (item: any) => {
        await Item.create({
          itemName: item.itemName,
          quality: item.quality,
          rarity: item.rarity,
          type: item.type,
          slot: item.slot,
          hero: item.hero,
        });
      })
    }
}