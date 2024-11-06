import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/schemas/UserSchema";
import { User } from "../models/User";
import axios from "axios";


interface Hero {
    id: number;
    name: string;
    type: string;
    img: string;
}

// Function to fetch heroes

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
