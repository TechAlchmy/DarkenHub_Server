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
    const BASE_URL = 'https://api.opendota.com/api/heroes';
    try {
        const response = await axios.get(BASE_URL);
        const heroes = response.data;

        return heroes.map((hero: any) => ({
            id: hero.id,
            name: hero.localized_name,
            type: hero.primary_attr,
            img: `https://cdn.dota2.com/apps/dota2/images/heroes/${hero.localized_name.toLowerCase().replace(/\s/g, '_').replace(/-/g, '')}_vert.jpg`
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
